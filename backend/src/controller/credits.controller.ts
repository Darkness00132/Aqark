import { AuthRequest } from "../middlewares/auth.js";
import {
  createCreditsPlanSchema,
  createPlanDiscountSchema,
} from "../validates/credits.js";
import { getAuthToken, createOrder, getpaymentToken } from "../utils/paymob.js";
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

    console.log("=== WEBHOOK RECEIVED ===");
    console.log("Full request body:", JSON.stringify(data, null, 2));

    // ✅ Basic validation instead of HMAC
    if (!data || !data.obj || !data.obj.id) {
      console.log("❌ Invalid request structure!");
      return res.status(400).json({ message: "Invalid request" });
    }

    console.log("✅ Request structure validated");

    // Extract transaction details
    const paymobTransactionId = data.obj.id; // Use Paymob's transaction ID
    const paymobOrderId = data.obj.order?.id; // Paymob's order ID
    const isSuccess = data.obj.success === true;
    const amountCents = data.obj.amount_cents;

    console.log("Extracted data:");
    console.log("- paymobTransactionId:", paymobTransactionId);
    console.log("- paymobOrderId:", paymobOrderId);
    console.log("- isSuccess:", isSuccess);
    console.log("- amountCents:", amountCents);

    // ✅ Find transaction by Paymob's order ID or transaction ID
    // You need to store this when creating the order
    const transaction = await Transaction.findOne({
      where: {
        paymentId: String(paymobOrderId), // Find by Paymob order ID
      },
    });

    if (!transaction) {
      console.log("❌ Transaction not found for order:", paymobOrderId);
      return res.status(404).json({ message: "Transaction not found" });
    }

    console.log("✅ Transaction found:", {
      id: transaction.id,
      currentStatus: transaction.paymentStatus,
      expectedAmount: transaction.finalPrice,
    });

    // Handle success/failure
    if (isSuccess) {
      console.log("💳 Processing successful payment...");

      // Verify amount matches (Paymob sends in cents)
      const expectedAmountCents = Math.round(transaction.finalPrice * 100);
      console.log("Amount verification:", {
        expected: expectedAmountCents,
        received: amountCents,
        match: amountCents === expectedAmountCents,
      });

      if (amountCents !== expectedAmountCents) {
        console.log("❌ Amount mismatch!", {
          expected: expectedAmountCents,
          received: amountCents,
        });
        return res.status(400).json({ message: "Amount mismatch" });
      }

      // Check if already completed (idempotency)
      if (transaction.paymentStatus === "completed") {
        console.log("⚠️ Transaction already completed, skipping...");
        return res
          .status(200)
          .json({ received: true, message: "Already processed" });
      }

      // Update transaction
      console.log("Updating transaction to completed...");
      transaction.paymentStatus = "completed";
      transaction.paymobTransactionId = String(paymobTransactionId);
      await transaction.save();
      console.log("✅ Transaction updated successfully");

      // Add credits to user
      const user = await User.findByPk(transaction.userId);
      if (user) {
        console.log("Adding credits to user:", {
          userId: user.id,
          currentCredits: user.credits,
          creditsToAdd: transaction.totalCredits,
        });

        user.credits += transaction.totalCredits;
        await user.save();

        console.log(
          "✅ Credits added successfully. New balance:",
          user.credits
        );
      } else {
        console.log("❌ User not found:", transaction.userId);
      }
    } else {
      console.log("❌ Processing failed payment...");

      if (transaction.paymentStatus === "failed") {
        console.log("⚠️ Transaction already marked as failed, skipping...");
        return res
          .status(200)
          .json({ received: true, message: "Already processed" });
      }

      transaction.paymentStatus = "failed";
      transaction.paymobTransactionId = String(paymobTransactionId);
      await transaction.save();
      console.log("✅ Transaction marked as failed");
    }

    console.log("=== WEBHOOK PROCESSING COMPLETE ===\n");
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
