import { createCreditsPlanSchema } from "../validates/credits.js";
import asyncHandler from "../utils/asyncHnadler.js";
import CreditsPlan from "../models/creditsPlan.js";
import sanitizeXSS from "../utils/sanitizeXSS.js";
export const getPlans = asyncHandler(async (req, res) => {
    const plans = await CreditsPlan.findAll();
    res.status(200).json({ plans });
});
export const createPlan = asyncHandler(async (req, res) => {
    const { value: plan, error } = createCreditsPlanSchema.validate(req.secureBody);
    if (error) {
        return res.status(400).json({ message: error.details });
    }
    await CreditsPlan.create({ ...plan, userId: req.user.id });
    res.status(201).json({ message: "plan created" });
});
export const deletePlan = asyncHandler(async (req, res) => {
    const { id } = sanitizeXSS(req.params);
    if (!id) {
        return res.status(400).json({ message: "missig id" });
    }
    const plan = await CreditsPlan.destroy({ where: { id } });
    if (!plan) {
        return res
            .status(404)
            .json({ message: "invalid id or plan doesnot exist" });
    }
    return res.status(200).json({ message: "plan deleted" });
});
//# sourceMappingURL=credits.controller.js.map