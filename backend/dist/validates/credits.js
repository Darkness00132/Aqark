import Joi from "joi";
export const createCreditsPlanSchema = Joi.object({
    credits: Joi.number().integer().min(1),
    price: Joi.number().integer().min(1),
    discount: Joi.number().integer().min(1).optional(),
    bonus: Joi.number().integer().min(1).optional(),
});
//# sourceMappingURL=credits.js.map