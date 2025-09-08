import Joi from "joi";
import { joiPasswordExtendCore } from "joi-password";

const JoiPassword = Joi.extend(joiPasswordExtendCore);

const passwordSchema = JoiPassword.string()
  .min(6)
  .minOfLowercase(1)
  .minOfUppercase(1)
  .minOfNumeric(1)
  .minOfSpecialCharacters(1)
  .doesNotInclude(["password"])
  .noWhiteSpaces();

export interface SignupBody {
  name: string;
  email: string;
  password: string;
  role: "user" | "landlord";
}

export interface LoginBody {
  email: string;
  enteredPassword: string;
}

export interface googleAuth {
  role: string;
}

export interface ForgetPasswordBody {
  email: string;
}

export interface ResetPasswordBody {
  password: string;
  resetPasswordToken: string;
}

export interface UpdateProfileBody {
  name?: string;
  role?: string;
  password?: string;
  enteredPassword?: string;
  avatar?: string;
}

export const signupSchema = Joi.object<SignupBody>({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required().messages({
    "string.email": "البريد الإلكتروني غير صالح",
    "any.required": "يجب إدخال البريد الإلكتروني",
  }),
  password: passwordSchema.required().messages({
    "string.min": "كلمة المرور يجب ألا تقل عن 6 أحرف",
    "any.required": "يجب إدخال كلمة المرور",
  }),
  role: Joi.string().valid("user", "landlord").required().messages({
    "any.only": "المهنة يجب أن يكون إما 'user' أو 'landlord'",
    "any.required": "حقل المهنة مطلوب",
  }),
});

export const loginSchema = Joi.object<LoginBody>({
  email: Joi.string().email().required().messages({
    "string.email": "البريد الإلكتروني غير صالح",
    "any.required": "يجب إدخال البريد الإلكتروني",
  }),
  enteredPassword: passwordSchema.required().messages({
    "string.min": "كلمة المرور يجب ألا تقل عن 6 أحرف",
    "any.required": "يجب إدخال كلمة المرور",
  }),
});

export const forgetPasswordSchema = Joi.object<ForgetPasswordBody>({
  email: Joi.string().email().required().messages({
    "string.email": "البريد الإلكتروني غير صالح",
    "any.required": "يجب إدخال البريد الإلكتروني",
  }),
});

export const resetPasswordSchema = Joi.object<ResetPasswordBody>({
  password: passwordSchema.required().messages({
    "string.min": "كلمة المرور يجب ألا تقل عن 6 أحرف",
    "any.required": "يجب إدخال كلمة المرور",
  }),
  resetPasswordToken: Joi.string().required(),
});

export const updateProfileSchema = Joi.object<UpdateProfileBody>({
  name: Joi.string().optional(),
  role: Joi.string().valid("user", "landlord").optional(),
  password: passwordSchema.when("enteredPassword", {
    is: Joi.exist(),
    then: passwordSchema.required(),
    otherwise: passwordSchema.optional(),
  }),
  enteredPassword: passwordSchema.optional(),
});
