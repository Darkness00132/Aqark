const User = require("../models/user.model");
const crypto = require("crypto");
const {
  signupSchema,
  loginSchema,
  forgetPasswordSchema,
  resetPasswordSchema,
} = require("../utils/validate");
const asyncHandler = require("../utils/asyncHnadler");
const verifyEmail = require("../emails/verifyEmail");
const welcomeEmail = require("../emails/welcomeEmail");
const forgetPasswordEmail = require("../emails/ForgetPasswordEmail");
const passwordChangedEmail = require("../emails/passwordChangedEmail");

let userContoller = {};

userContoller.signup = asyncHandler(async (req, res) => {
  const { error, value } = signupSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { name, email, password, role } = value;
  let user = await User.findOne({ email });
  if (user) {
    return res.status(400).json({ message: "انت بالفعل تمتلك حساب" });
  }
  user = await User.create({
    name,
    email,
    password,
    role,
    verificationToken: crypto.randomBytes(32).toString("hex"),
    verificationTokenExpires: Date.now() + 10 * 60 * 1000,
  });

  const protocol = req.protocol;
  const host = req.get("host");
  const verifyUrl = `${protocol}://${host}/api/users/verifyEmail?verificationToken=${user.verificationToken}`;
  await verifyEmail(verifyUrl, "delivered@resend.dev");

  res.status(201).json({ message: "تم انشاء حساب بنجاح يرجى تحقق من ايميلك" });
});

userContoller.verifyEmail = asyncHandler(async (req, res) => {
  const { verificationToken } = req.query;
  const user = await User.findOne({ verificationToken });
  if (!user || user.verificationTokenExpires < Date.now()) {
    return res.status(404).json({ message: "انتهت صلاحية الرابط" });
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpires = undefined;

  await user.save();

  await welcomeEmail("delivered@resend.dev");

  res.redirect(process.env.FRONTEND_URL + "/login");
});

userContoller.login = asyncHandler(async (req, res) => {
  const { error, value } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { email, enteredPassword } = value;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "لا يوجد حساب فى هذا الايميل" });
  }

  if (!user.isVerified) {
    return res
      .status(500)
      .json({ message: "الرجاء التحقق من بريدك الإلكتروني لتفعيل الحساب." });
  }
  const isMatch = await user.matchPassword(enteredPassword);

  if (!isMatch) {
    return res.status(400).json({
      message: "كلمة مرور خاطئة",
    });
  }

  const token = await user.generateAuthToken();

  // res.cookie("jwt-auth", token, {
  //   httpOnly: true,
  //   signed: true,
  //   maxAge: 7 * 24 * 60 * 60 * 1000,
  //   secure: process.env.PRODUCTION === "true",
  //   sameSite: process.env.PRODUCTION === "true" ? "none" : "lax",
  //   domain: process.env.PRODUCTION === "true" ? "aqark" : undefined,
  // });

  res.status(200).json({ message: "تم تسجيل الدخول بنجاح" }, token);
});

userContoller.getProfile = asyncHandler(async (req, res) => {
  res.status(200).json({ user: req.user });
});

userContoller.forgetPassword = asyncHandler(async (req, res) => {
  const { error, value } = forgetPasswordSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { email } = value;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ message: "لا يوجد حساب فى هذا الايميل" });
  }

  user.resetPasswordToken = crypto.randomBytes(32).toString("hex");
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  await user.save();
  await forgetPasswordEmail(user.resetPasswordToken, "delivered@resend.dev");

  res.status(200).json({
    message: "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني",
  });
});

userContoller.resetPassword = asyncHandler(async (req, res) => {
  const { error, value } = resetPasswordSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  const { password, resetPasswordToken } = value;

  const user = await User.findOne({ resetPasswordToken });

  if (!user || user.resetPasswordTokenExpires < Date.now()) {
    return res.status(404).json({ message: "انتهت صلاحية الرابط" });
  }
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpires = undefined;
  user.password = password;

  await user.save();

  await passwordChangedEmail("delivered@resend.dev");

  res.status(200).json({ message: "تم تغيير كلمة مرور بنجاح" });
});

userContoller.logout = asyncHandler(async (req, res) => {
  // const userToken = req.signedCookies["jwt-auth"];

  const authHeader = req.headers.authorization;
  const userToken = authHeader && authHeader.split(" ")[1];

  req.user.tokens = req.user.tokens.filter((token) => token !== userToken);
  await req.user.save();

  // res.clearCookie("jwt-auth", {
  //   httpOnly: true,
  //   secure: process.env.PRODUCTION === "true",
  //   sameSite: process.env.PRODUCTION === "true" ? "none" : "lax",
  //   domain: process.env.PRODUCTION === "true" ? ".vercel.app" : undefined,
  // });
  return res.status(200).json({ message: "تم تسجيل الخروج بنجاح" });
});

module.exports = userContoller;
