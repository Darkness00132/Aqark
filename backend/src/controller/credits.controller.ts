import { AuthRequest } from "../middlewares/auth.js";
import {
  createCreditsPlanSchema,
  createPlanDiscountSchema,
} from "../validates/credits.js";
import {
  getAuthToken,
  createOrder,
  getpaymentToken,
  verifySignature,
} from "../utils/paymob.js";
import { Response } from "express";
import {
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
      paymentMethod: "paymob",
      gatewayfee,
      netRevenue,
    });

    return res.status(200).json({
      paymentUrl: `https://accept.paymob.com/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentToken}`,
    });
  }
);

export const paymentResponse = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!verifySignature(req)) {
      console.log("Invalid signature!");
      return res.status(400).json({ message: "Invalid signature" });
    }

    const event = req.secureBody;
    console.log("Received Paymob event:", event);

    const paymentId = event.data.order.id;
    const transaction = await Transaction.findOne({
      where: { paymentId },
    });
    // Handle different event types:
    if (event.type === "transaction_success") {
      if (transaction && transaction.paymentStatus !== "completed") {
        transaction.paymentStatus = "completed";
        await transaction.save();
        const user = await User.findByPk(transaction.userId);
        if (user) {
          user.credits += transaction.totalCredits;
          await user.save();
        }
      }
    } else if (event.type === "transaction_failed") {
      // Handle failure
      if (transaction) {
        transaction.paymentStatus = "failed";
        await transaction.save();
      }
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
