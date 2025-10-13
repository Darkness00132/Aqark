import { createCreditsPlanSchema, createPlanDiscountSchema, } from "../validates/credits.js";
import { CreditsPlan, PlanDiscount } from "../models/associations.js";
import { Op } from "sequelize";
import asyncHandler from "../utils/asyncHnadler.js";
import sanitizeXSS from "../utils/sanitizeXSS.js";
export const getPlans = asyncHandler(async (req, res) => {
    const now = new Date();
    const plans = await CreditsPlan.findAll({
        where: { isDeleted: false },
        include: [
            {
                model: PlanDiscount,
                as: "discounts",
                where: {
                    startsAt: { [Op.lte]: now },
                    endsAt: { [Op.gte]: now },
                    isDeleted: false,
                },
                required: false, // allow plans with no active discounts
            },
        ],
        order: [["id", "ASC"]],
    });
    return res.status(200).json({ plans });
});
export const createPlan = asyncHandler(async (req, res) => {
    const { value: plan, error } = createCreditsPlanSchema.validate(req.secureBody);
    if (error)
        return res.status(400).json({ message: error.details });
    await CreditsPlan.create({ ...plan, userId: req.user.id });
    return res.status(201).json({ message: "Plan created successfully" });
});
export const updateCreditsPlan = asyncHandler(async (req, res) => {
    const { id, bonus } = req.secureBody;
    if (!id || bonus === undefined)
        return res.status(400).json({ message: "Missing id or bonus" });
    const [updated] = await CreditsPlan.update({ bonus }, { where: { id: parseInt(id) } });
    if (!updated)
        return res.status(404).json({ message: "Plan not found or not updated" });
    return res.status(200).json({ message: "Plan updated successfully" });
});
export const createPlanDiscount = asyncHandler(async (req, res) => {
    const { value: planDiscount, error } = createPlanDiscountSchema.validate(req.secureBody);
    if (error)
        return res.status(400).json({ message: error.details });
    const planExists = await CreditsPlan.findByPk(planDiscount.planId);
    if (!planExists)
        return res.status(404).json({ message: "Plan not found" });
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
});
export const deletePlan = asyncHandler(async (req, res) => {
    const { id } = sanitizeXSS(req.params);
    if (!id)
        return res.status(400).json({ message: "Missing id" });
    const plan = await CreditsPlan.findByPk(id);
    if (!plan) {
        return res.status(404).json({ message: "Plan not found" });
    }
    await plan.update({ isDeleted: true });
    return res.status(200).json({ message: "Plan deleted successfully" });
});
//# sourceMappingURL=credits.controller.js.map