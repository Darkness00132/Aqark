import Joi from "joi";

export interface createCreditsPlan {
  credits: number;
  price: number;
  discount?: number;
  bonus?: number;
}

export interface createPlanDiscountSchema {
  planId: number;
  percentage: number;
  startsAt: Date;
  endsAt: Date;
}

export const createCreditsPlanSchema = Joi.object<createCreditsPlan>({
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
