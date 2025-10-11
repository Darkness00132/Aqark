import Joi from "joi";

export interface createCreditsPlan {
  credits: number;
  price: number;
  discount?: number;
  bonus?: number;
}

export const createCreditsPlanSchema = Joi.object<createCreditsPlan>({
  credits: Joi.number().integer().min(1),
  price: Joi.number().integer().min(1),
  discount: Joi.number().integer().min(1).optional(),
  bonus: Joi.number().integer().min(1).optional(),
});
