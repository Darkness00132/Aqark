import type { Response, Request } from "express";
import type { AuthRequest } from "../middlewares/auth.js";
import User, { type Role } from "../models/user.model.js";
import {
  signupSchema,
  loginSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
} from "../validates/user.js";
import { col, fn } from "sequelize";
import { nanoid } from "nanoid";
import asyncHandler from "../utils/asyncHnadler.js";
import verifyEmail from "../emails/verifyEmail.js";
import welcomeEmail from "../emails/welcomeEmail.js";
import forgetPasswordEmail from "../emails/ForgetPasswordEmail.js";
import passwordChangedEmail from "../emails/passwordChangedEmail.js";
import Review from "../models/review.model.js";

interface SignupValue {
  name: string;
  email: string;
  password: string;
  role: Role;
}

interface LoginValue {
  email: string;
  enteredPassword: string;
}

interface ForgetPasswordValue {
  email: string;
}

interface ResetPasswordValue {
  password: string;
  resetPasswordToken: string;
}

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { error, value } = signupSchema.validate(req.secureBody);
  if (error)
    return res.status(400).json({ message: error.details[0]?.message });

  const { name, email, password, role }: SignupValue = value;
  let user = await User.findOne({ where: { email } });
  if (user) return res.status(400).json({ message: "انت بالفعل تمتلك حساب" });

  user = await User.create({
    name,
    email,
    password,
    role,
    verificationToken: nanoid(16),
    verificationTokenExpire: new Date(Date.now() + 10 * 60 * 1000),
  });

  await verifyEmail(user.verificationToken!, user.email);

  res.status(201).json({ message: "تم انشاء حساب بنجاح يرجى تحقق من ايميلك" });
});

export const verify = asyncHandler(async (req: Request, res: Response) => {
  const { verificationToken } = req.secureQuery;
  const user = await User.findOne({ where: { verificationToken } });

  if (!user || user.isVerified) {
    return res.redirect(process.env.FRONTEND_URL + "/?login=already");
  }

  if (
    user.verificationTokenExpire &&
    user.verificationTokenExpire.getTime() < Date.now()
  ) {
    return res.status(404).json({ message: "انتهت صلاحية الرابط" });
  }

  user.isVerified = true;
  user.verificationToken = null;
  user.verificationTokenExpire = null;
  user.credits = 20;

  await user.save();

  await welcomeEmail(user.email);

  const token = await user.generateAuthToken();
  res.cookie("jwt-auth", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    secure: process.env.PRODUCTION === "true",
    sameSite: process.env.PRODUCTION === "true" ? "none" : "lax",
    priority: "high",
  });

  res.redirect(process.env.FRONTEND_URL + "/?login=success");
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { error, value } = loginSchema.validate(req.secureBody);
  if (error)
    return res.status(400).json({ message: error.details[0]?.message });

  const { email, enteredPassword } = value;
  const user = await User.findOne({ where: { email } });
  if (!user)
    return res.status(404).json({ message: "لا يوجد حساب فى هذا الايميل" });

  if (!user.isVerified) {
    return res
      .status(403)
      .json({ message: "الرجاء التحقق من بريدك الإلكتروني لتفعيل الحساب." });
  }

  const isMatch = await user.matchPassword(enteredPassword);
  if (!isMatch) return res.status(400).json({ message: "كلمة مرور خاطئة" });

  const token = await user.generateAuthToken();

  res.cookie("jwt-auth", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7, //saved for 7days
    secure: process.env.PRODUCTION === "true",
    sameSite: process.env.PRODUCTION === "true" ? "none" : "lax",
    priority: "high",
  });

  res.status(200).json({ message: "تم تسجيل الدخول بنجاح" });
});

export const getMyProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    return res.status(200).json({ user: req.user });
  }
);

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const { publicId } = req.secureParams;
  let user = await User.findOne({ where: { publicId } });
  if (!user) {
    return res.status(400).json({ message: "المستخدم غير موجود" });
  }

  const result = (await Review.findOne({
    attributes: [
      [fn("AVG", col("rating")), "avgRating"],
      [fn("COUNT", col("id")), "totalReviews"],
    ],
    where: { reviewedUserId: user.id },
    raw: true,
  })) as { avgRating: string; totalReviews: string } | null;

  const avgRating = parseFloat(result?.avgRating || "0");
  const totalReviews = parseInt(result?.totalReviews || "0");
  await user.update({ avgRating, totalReviews });

  return res.status(200).json({ user });
});

export const forgetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { error, value } = forgetPasswordSchema.validate(req.secureBody);
    if (error)
      return res.status(400).json({ message: error.details[0]?.message });

    const { email } = value as ForgetPasswordValue;
    const user = await User.findOne({ where: { email } });
    if (!user)
      return res.status(404).json({ message: "لا يوجد حساب فى هذا الايميل" });

    user.resetPasswordToken = nanoid(16);
    user.resetPasswordTokenExpire = new Date(Date.now() + 10 * 60 * 1000);

    await user.save();
    await forgetPasswordEmail(user.resetPasswordToken!, user.email);

    res.status(200).json({
      message: "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني",
    });
  }
);

export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { error, value } = resetPasswordSchema.validate(req.secureBody);
    if (error)
      return res.status(400).json({ message: error.details[0]?.message });

    const { password, resetPasswordToken } = value as ResetPasswordValue;
    const user = await User.findOne({ where: { resetPasswordToken } });

    if (
      !user ||
      (user.resetPasswordTokenExpire &&
        user.resetPasswordTokenExpire.getTime() < Date.now())
    ) {
      return res.status(404).json({ message: "انتهت صلاحية الرابط" });
    }

    user.resetPasswordToken = null;
    user.resetPasswordTokenExpire = null;
    user.password = password;

    await user.save();

    await passwordChangedEmail(user.email);

    res.status(200).json({ message: "تم تغيير كلمة مرور بنجاح" });
  }
);

export const updateProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { value, error } = updateProfileSchema.validate(req.secureBody);
    if (error)
      return res.status(400).json({ message: error.details[0]?.message });
    const { name, role, password, newPassword } = value;
    if (name) req.user.name = name;
    if (role) req.user.role = role;
    if (newPassword) {
      const isMatch = await req.user.matchPassword(password);
      if (!isMatch) return res.status(400).json({ message: "كلمة مرور خاطئة" });
      req.user.password = newPassword;
    }
    await req.user.save();

    return res.status(200).json({ message: "تم تحديث ملفك الشخصى بنجاح" });
  }
);

export const logout = asyncHandler(async (req: AuthRequest, res: Response) => {
  const userToken = req.cookies["jwt-auth"];

  req.user.tokens = req.user.tokens.filter(
    (t: { token: string }) => t.token !== userToken
  );
  await req.user.save();

  res.clearCookie("jwt-auth", {
    httpOnly: true,
    secure: process.env.PRODUCTION === "true",
    sameSite: process.env.PRODUCTION === "true" ? "none" : "lax",
  });

  res.status(200).json({ message: "تم تسجيل الخروج بنجاح" });
});
