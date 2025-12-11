import type { Response, Request } from "express";
import type { AuthRequest } from "../middlewares/auth.js";
import { User, Review, CreditsLog } from "../models/associations.js";
import {
  signupSchema,
  loginSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
  updateProfileSchema,
} from "../validates/user.js";
import sequelize from "../db/sql.js";
import { col, fn } from "sequelize";
import { nanoid } from "nanoid";
import asyncHandler from "../utils/asyncHnadler.js";
import verifyEmail from "../emails/verifyEmail.js";
import welcomeEmail from "../emails/welcomeEmail.js";
import forgetPasswordEmail from "../emails/ForgetPasswordEmail.js";
import passwordChangedEmail from "../emails/passwordChangedEmail.js";
import sanitizeXSS from "../utils/sanitizeXSS.js";
import { handleAvatarUpload } from "../utils/upload.js";
import { getClientIP } from "../utils/getClientIp.js";

const SIGNUP_BONUS_CREDITS = 100;

// ========== SIGNUP ==========
export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { error, value } = signupSchema.validate(req.secureBody);
  if (error)
    return res.status(400).json({ message: error.details[0]?.message });

  const { name, email, password, role } = value;

  // OPTIMIZATION: Only select needed fields
  let user = await User.findOne({
    where: { email },
    attributes: ["id"],
    raw: true,
  });

  if (user) return res.status(400).json({ message: "انت بالفعل تمتلك حساب" });

  const ip = getClientIP(req);
  const userAgent = req.headers["user-agent"] || "unknown";

  user = await User.create({
    name,
    email,
    password,
    role: role || "user",
    verificationToken: nanoid(16),
    verificationTokenExpire: new Date(Date.now() + 10 * 60 * 1000),
    ips: [{ ip, userAgent, lastLogin: new Date() }],
    credits: 0,
  });

  // Send email asynchronously (don't block response)
  verifyEmail(user.verificationToken!, user.email).catch((err) =>
    console.error("Verify email failed to send:", err)
  );

  res.status(201).json({ message: "تم انشاء حساب بنجاح يرجى تحقق من ايميلك" });
});

// ========== VERIFY ==========
export const verify = asyncHandler(async (req: Request, res: Response) => {
  const { verificationToken } = req.secureQuery;
  if (!verificationToken)
    return res.status(400).json({ message: "الرابط غير صالح" });

  const user = await User.findOne({ where: { verificationToken } });
  if (!user || user.isVerified)
    return res.redirect(process.env.FRONTEND_URL + "/?login=already");

  if (
    user.verificationTokenExpire &&
    user.verificationTokenExpire.getTime() < Date.now()
  )
    return res.status(404).json({ message: "انتهت صلاحية الرابط" });

  user.isVerified = true;
  user.verificationToken = null;
  user.verificationTokenExpire = null;
  user.credits = SIGNUP_BONUS_CREDITS;

  const ip = getClientIP(req);
  const userAgent = req.headers["user-agent"] || "unknown";
  user.ips = user.ips || [];
  user.ips.push({ ip, userAgent, lastLogin: new Date() });

  // Transaction ensures atomicity
  await sequelize.transaction(async (t) => {
    await user.save({ transaction: t });
    await CreditsLog.create(
      {
        userId: user.id!,
        type: "gift",
        description: "Signup verification bonus",
        credits: SIGNUP_BONUS_CREDITS,
      },
      { transaction: t }
    );
  });

  // Send welcome email after successful transaction
  welcomeEmail(user.email).catch((err) =>
    console.error("Welcome email failed to send:", err)
  );

  const token = await user.generateAuthToken();
  res.cookie("jwt-auth", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    secure: process.env.PRODUCTION === "true",
    sameSite: process.env.PRODUCTION === "true" ? "none" : "lax",
    priority: "high",
  });

  res.redirect(process.env.FRONTEND_URL!);
});

// ========== RESEND VERIFICATION ==========
export const resendVerification = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.secureBody;

    if (!email) {
      return res.status(400).json({ message: "البريد الإلكتروني مطلوب" });
    }

    // OPTIMIZATION: Only select needed fields
    const user = await User.findOne({
      where: { email },
      attributes: [
        "id",
        "email",
        "isVerified",
        "verificationToken",
        "verificationTokenExpire",
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "لا يوجد حساب فى هذا الايميل" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "الحساب مفعل بالفعل" });
    }

    const token = nanoid(16);
    user.verificationToken = token;
    user.verificationTokenExpire = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    verifyEmail(user.verificationToken!, user.email).catch((err) =>
      console.error("Verify email failed to send:", err)
    );

    res.status(200).json({
      message: "تم إرسال بريد التحقق بنجاح. يرجى التحقق من صندوق الوارد.",
    });
  }
);

// ========== LOGIN - OPTIMIZED ==========
export const login = asyncHandler(async (req: Request, res: Response) => {
  const { error, value } = loginSchema.validate(req.secureBody);
  if (error)
    return res.status(400).json({ message: error.details[0]?.message });

  const { email, enteredPassword } = value;

  // OPTIMIZATION: Only select needed fields for authentication
  const user = await User.findOne({
    where: { email },
    attributes: ["id", "email", "password", "isVerified", "ips", "tokens"],
  });

  if (!user)
    return res.status(404).json({ message: "لا يوجد حساب فى هذا الايميل" });

  if (!user.isVerified)
    return res
      .status(403)
      .json({ message: "الرجاء التحقق من بريدك الإلكتروني لتفعيل الحساب." });

  const isMatch = await user.matchPassword(enteredPassword);
  if (!isMatch) return res.status(400).json({ message: "كلمة مرور خاطئة" });

  const ip = getClientIP(req);
  const userAgent = req.headers["user-agent"] || "unknown";
  user.ips = user.ips || [];

  const existingEntry = user.ips.find(
    (entry) => entry.ip === ip && entry.userAgent === userAgent
  );

  if (existingEntry) {
    existingEntry.lastLogin = new Date();
  } else {
    user.ips.push({ ip, userAgent, lastLogin: new Date() });
  }

  await user.save();
  const token = await user.generateAuthToken();

  res.cookie("jwt-auth", token, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    secure: process.env.PRODUCTION === "true",
    sameSite: process.env.PRODUCTION === "true" ? "none" : "lax",
    priority: "high",
  });

  res.status(200).json({ message: "تم تسجيل الدخول بنجاح" });
});

// ========== GET MY PROFILE ==========
export const getMyProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    return res.status(200).json({ user: req.user });
  }
);

// ========== GET ANY USER'S PROFILE - OPTIMIZED ==========
export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = sanitizeXSS(req.params);

  // OPTIMIZATION: Use Promise.all to run queries in parallel
  const [user, reviewStats, reviews] = await Promise.all([
    User.findOne({
      where: { slug },
      attributes: [
        "id",
        "slug",
        "name",
        "avatar",
        "avgRating",
        "totalReviews",
        "createdAt",
      ],
    }),
    Review.findOne({
      attributes: [
        [fn("AVG", col("rating")), "avgRating"],
        [fn("COUNT", col("id")), "totalReviews"],
      ],
      where: { reviewedUserId: slug }, // Use slug directly if possible
      raw: true,
    }),
    Review.findAll({
      where: { reviewedUserId: slug }, // Use slug directly if possible
      attributes: ["id", "rating", "comment", "createdAt"],
      include: [
        {
          model: User,
          as: "reviewer",
          attributes: ["name", "avatar"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: 20, // OPTIMIZATION: Limit reviews to first 20
      raw: true,
      nest: true,
    }),
  ]);

  if (!user) return res.status(400).json({ message: "المستخدم غير موجود" });

  const avgRating = parseFloat((reviewStats as any)?.avgRating || "0");
  const totalReviews = parseInt((reviewStats as any)?.totalReviews || "0");

  // Update ratings if changed
  if (user.avgRating !== avgRating || user.totalReviews !== totalReviews) {
    await user.update({ avgRating, totalReviews });
  }

  res.status(200).json({
    user: {
      ...user.toJSON(),
      avgRating,
      totalReviews,
    },
    reviews,
  });
});

// ========== FORGET PASSWORD ==========
export const forgetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { error, value } = forgetPasswordSchema.validate(req.secureBody);
    if (error)
      return res.status(400).json({ message: error.details[0]?.message });

    const { email } = value;

    const user = await User.findOne({
      where: { email },
      attributes: [
        "id",
        "email",
        "resetPasswordToken",
        "resetPasswordTokenExpire",
      ],
    });

    if (!user)
      return res.status(404).json({ message: "لا يوجد حساب فى هذا الايميل" });

    user.resetPasswordToken = nanoid(16);
    user.resetPasswordTokenExpire = new Date(Date.now() + 10 * 60 * 1000);

    await user.save();

    forgetPasswordEmail(user.resetPasswordToken!, user.email).catch((err) =>
      console.error("Forget password email failed to send:", err)
    );

    res.status(200).json({
      message: "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني",
    });
  }
);

// ========== RESET PASSWORD ==========
export const resetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { error, value } = resetPasswordSchema.validate(req.secureBody);
    if (error)
      return res.status(400).json({ message: error.details[0]?.message });

    const { password, resetPasswordToken } = value;

    const user = await User.findOne({ where: { resetPasswordToken } });

    if (
      !user ||
      (user.resetPasswordTokenExpire &&
        user.resetPasswordTokenExpire.getTime() < Date.now())
    )
      return res.status(404).json({ message: "انتهت صلاحية الرابط" });

    user.resetPasswordToken = null;
    user.resetPasswordTokenExpire = null;
    user.password = password;

    await user.save();

    passwordChangedEmail(user.email).catch((err) =>
      console.error("Password changed email failed to send:", err)
    );

    res.status(200).json({ message: "تم تغيير كلمة مرور بنجاح" });
  }
);

// ========== RESEND RESET PASSWORD ==========
export const resendResetPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.secureBody;

    if (!email) {
      return res.status(400).json({ message: "البريد الإلكتروني مطلوب" });
    }

    const user = await User.findOne({
      where: { email },
      attributes: [
        "id",
        "email",
        "resetPasswordToken",
        "resetPasswordTokenExpire",
      ],
    });

    if (!user) {
      return res.status(404).json({ message: "لا يوجد حساب فى هذا الايميل" });
    }

    const token = nanoid(16);
    user.resetPasswordToken = token;
    user.resetPasswordTokenExpire = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    forgetPasswordEmail(user.resetPasswordToken!, user.email).catch((err) =>
      console.error("Forget password email failed to send:", err)
    );

    res.status(200).json({
      message:
        "تم إرسال بريد إعادة تعيين كلمة المرور بنجاح. يرجى التحقق من صندوق الوارد.",
    });
  }
);

// ========== UPDATE PROFILE ==========
export const updateProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (
      !req.file &&
      (!req.secureBody || Object.keys(req.secureBody).length === 0)
    ) {
      return res.status(400).json({ message: "لا توجد بيانات للتحديث" });
    }

    if (req.secureBody && Object.keys(req.secureBody).length > 0) {
      const { value, error } = updateProfileSchema.validate(req.secureBody);
      if (error) {
        return res.status(400).json({ message: error.details[0]?.message });
      }

      const { name, password, newPassword } = value;

      if (name) {
        req.user.name = name;
      }

      if (newPassword) {
        if (!password) {
          return res
            .status(400)
            .json({ message: "كلمة المرور الحالية مطلوبة" });
        }
        const isMatch = await req.user.matchPassword(password);
        if (!isMatch) {
          return res.status(400).json({ message: "كلمة مرور خاطئة" });
        }
        req.user.password = newPassword;
      }
    }

    if (req.file) {
      const avatarResult = await handleAvatarUpload(
        req.file,
        req.user.avatarKey
      );

      if (avatarResult) {
        req.user.avatar = avatarResult.url;
        req.user.avatarKey = avatarResult.key;
      }
    }

    await req.user.save();

    res.status(200).json({
      message: "تم تحديث ملفك الشخصى بنجاح",
      user: req.user.toJSON(),
    });
  }
);

// ========== LOGOUT ==========
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
