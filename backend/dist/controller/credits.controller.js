import asyncHandler from "../utils/asyncHnadler.js";
import CreditsPlan from "../models/creditsPlan.js";
export const getPlans = asyncHandler(async (req, res) => {
    const plans = CreditsPlan.findAll();
    res.status(200).json({ plans });
});
//# sourceMappingURL=credits.controller.js.map