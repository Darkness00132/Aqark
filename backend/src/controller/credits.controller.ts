import { AuthRequest } from "../middlewares/auth.js";
import {
  createCreditsPlanSchema,
  createPlanDiscountSchema,
} from "../validates/credits.js";
import { getAuthToken, createOrder, getpaymentToken } from "../utils/paymob.js";
import { Response } from "express";
import {
  CreditsLog,
  CreditsPlan,
  PlanDiscount,
  Transaction,
  User,
} from "../models/associations.js";
import { Op } from "sequelize";
import asyncHandler from "../utils/asyncHnadler.js";
import sanitizeXSS from "../utils/sanitizeXSS.js";

export const getPlans = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const plans = await CreditsPlan.findAll({
      order: [["id", "ASC"]],
      include: [
        {
          model: PlanDiscount,
          as: "discounts",
          where: {
            startsAt: { [Op.lte]: new Date() },
            endsAt: { [Op.gte]: new Date() },
          },
          required: false,
        },
      ],
    });

    return res.status(200).json({ plans });
  }
);

export const createPlan = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { value: plan, error } = createCreditsPlanSchema.validate(
      req.secureBody
    );
    if (error) return res.status(400).json({ message: error.details });

    await CreditsPlan.create({ ...plan, userId: req.user.id });
    return res.status(201).json({ message: "Plan created successfully" });
  }
);

export const createPayment = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { planId } = req.secureBody;
    const plan = await CreditsPlan.findByPk(planId);
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    const discount = await PlanDiscount.findOne({
      where: {
        planId: plan.id,
        startsAt: { [Op.lte]: new Date() },
        endsAt: { [Op.gte]: new Date() },
      },
    });
    const credits = plan.credits + (plan.bonus || 0);
    const price = plan.price;
    const finalPrice = discount
      ? price - (price * discount.percentage) / 100
      : price;

    const authToken = await getAuthToken();
    const orderId = await createOrder(authToken, finalPrice, planId);

    const billingData = {
      first_name: req.user.name.split(" ")[0] || req.user.name,
      last_name: req.user.name.split(" ")[1] || "NA",
      email: req.user.email,
      phone_number: "NA",
      apartment: "NA",
      floor: "NA",
      street: "NA",
      building: "NA",
      city: "NA",
      country: "EG",
      state: "NA",
    };

    const paymentToken = await getpaymentToken(
      authToken,
      orderId,
      finalPrice,
      billingData
    );

    const gatewayfee = 3 + finalPrice * 0.0275;
    const netRevenue = finalPrice - gatewayfee;
    await Transaction.create({
      userId: req.user.id,
      planId: planId,
      paymentId: orderId,
      type: "purchase",
      totalCredits: credits,
      price,
      finalPrice,
      discount: discount?.percentage || 0,
      paymentStatus: "pending",
      gatewayfee,
      netRevenue,
    });

    return res.status(200).json({
      paymentUrl: `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentToken}`,
    });
  }
);

export const paymentProcessed = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const data = req.body;

    const paymobTransactionId = data.obj.id;
    const paymobOrderId = data.obj.order.id;
    const isSuccess = data.obj.success === true;

    const cardLast4 = data.obj.source_data?.pan;
    const paymentType = data.obj.source_data?.type;
    const cardSubType = data.obj.source_data?.sub_type;

    const transaction = await Transaction.findOne({
      where: { paymentId: String(paymobOrderId) },
      include: [{ model: User, as: "user" }],
    });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    if (isSuccess) {
      if (transaction.paymentStatus === "completed") {
        return res.status(200).json({ received: true });
      }

      let paymentMethod = paymentType || "unknown";
      if (paymentType === "card" && cardSubType) {
        paymentMethod = cardSubType;
      }

      // Update transaction
      transaction.paymentStatus = "completed";
      transaction.paymobTransactionId = String(paymobTransactionId);
      transaction.cardLast4 = cardLast4 || null;
      transaction.paymentMethod = paymentMethod;

      await transaction.save();

      // Update user credits
      (transaction as any).user.credits += transaction.totalCredits;
      await (transaction as any).user.save();

      // Create credit log
      await CreditsLog.create({
        userId: transaction.userId,
        credits: transaction.totalCredits,
        type: "purchase",
        description: `Purchased ${transaction.totalCredits} credits via ${paymentMethod}${
          cardLast4 ? ` (****${cardLast4})` : ""
        }`,
      });
    } else {
      if (transaction.paymentStatus === "failed") {
        return res.status(200).json({ received: true });
      }

      let paymentMethod = paymentType || "unknown";
      if (paymentType === "card" && cardSubType) {
        paymentMethod = cardSubType;
      }

      const failureReason = data.obj.data?.message || "Payment declined";

      transaction.paymentStatus = "failed";
      transaction.paymobTransactionId = String(paymobTransactionId);
      transaction.cardLast4 = cardLast4 || null;
      transaction.paymentMethod = paymentMethod;
      transaction.failureReason = failureReason;

      await transaction.save();
    }

    res.status(200).json({ received: true });
  }
);

export const updateCreditsPlan = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id, bonus } = req.secureBody;
    if (!id || bonus === undefined)
      return res.status(400).json({ message: "Missing id or bonus" });

    const [updated] = await CreditsPlan.update(
      { bonus },
      { where: { id: parseInt(id) } }
    );

    if (!updated)
      return res.status(404).json({ message: "Plan not found or not updated" });

    return res.status(200).json({ message: "Plan updated successfully" });
  }
);

export const createPlanDiscount = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { value: planDiscount, error } = createPlanDiscountSchema.validate(
      req.secureBody
    );
    if (error) return res.status(400).json({ message: error.details });

    const planExists = await CreditsPlan.findByPk(planDiscount.planId);
    if (!planExists) return res.status(404).json({ message: "Plan not found" });

    // prevent overlapping discounts
    const overlap = await PlanDiscount.findOne({
      where: {
        planId: planDiscount.planId,
        [Op.and]: [
          { startsAt: { [Op.lte]: planDiscount.endsAt } },
          { endsAt: { [Op.gte]: planDiscount.startsAt } },
        ],
      },
    });

    if (overlap)
      return res.status(400).json({
        message: "There is already an overlapping discount for this plan",
      });

    await PlanDiscount.create({
      ...planDiscount,
      userId: req.user.id,
    });

    return res.status(201).json({ message: "Discount created successfully" });
  }
);

export const deletePlan = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = sanitizeXSS(req.params);
    if (!id) return res.status(400).json({ message: "Missing id" });
  }
);
