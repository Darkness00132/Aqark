import Joi from "joi";
export const createCreditsPlanSchema = Joi.object({
    credits: Joi.number().integer().min(1).required(),
    price: Joi.number().integer().min(1).required(),
    bonus: Joi.number().integer().min(1).optional(),
});
export const createPlanDiscountSchema = Joi.object({
    planId: Joi.number().integer().min(1).required(),
    percentage: Joi.number().integer().min(1).max(100).required(),
    startsAt: Joi.date().required(),
    endsAt: Joi.date().greater(Joi.ref("startsAt")).required(),
});
//# sourceMappingURL=credits.js.map