const Joi = require("joi");

const signupSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required().messages({
    "string.min": "كلمة المرور يجب ألا تقل عن 6 أحرف",
    "any.required": "يجب إدخال كلمة المرور",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "كلمة المرور يجب ألا تقل عن 6 أحرف",
    "any.required": "يجب إدخال كلمة المرور",
  }),
  role: Joi.string().valid("user", "landlord").required().messages({
    "any.only": "المهنة يجب أن يكون إما 'user' أو 'landlord'",
    "any.required": "حقل المهنة مطلوب",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "البريد الإلكتروني غير صالح",
    "any.required": "يجب إدخال البريد الإلكتروني",
  }),
  enteredPassword: Joi.string().min(6).required().messages({
    "string.min": "كلمة المرور يجب ألا تقل عن 6 أحرف",
    "any.required": "يجب إدخال كلمة المرور",
  }),
});

const forgetPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "البريد الإلكتروني غير صالح",
    "any.required": "يجب إدخال البريد الإلكتروني",
  }),
});

const resetPasswordSchema = Joi.object({
  password: Joi.string().min(6).required().messages({
    "string.min": "كلمة المرور يجب ألا تقل عن 6 أحرف",
    "any.required": "يجب إدخال كلمة المرور",
  }),
  resetPasswordToken: Joi.string().required(),
});
module.exports = {
  signupSchema,
  loginSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
};
