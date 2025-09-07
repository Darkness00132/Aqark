import crypto from "crypto";
import User from "../models/user.model.js";
import { signupSchema, loginSchema, forgetPasswordSchema, resetPasswordSchema, updateProfileSchema, } from "../utils/validate.js";
import asyncHandler from "../utils/asyncHnadler.js";
export const signup = asyncHandler(async (req, res) => {
    const { error, value } = signupSchema.validate(req.body);
    if (error)
        return res.status(400).json({ message: error.details[0]?.message });
    const { name, email, password, role } = value;
    let user = await User.findOne({ email });
    if (user)
        return res.status(400).json({ message: "انت بالفعل تمتلك حساب" });
    user = await User.create({
        name,
        email,
        password,
        role,
        isVerified: true,
        verificationToken: crypto.randomBytes(32).toString("hex"),
        verificationTokenExpires: new Date(Date.now() + 10 * 60 * 1000),
    });
    // const protocol = req.protocol;
    // const host = req.get("host");
    // const verifyUrl = `${protocol}://${host}/api/users/verifyEmail?verificationToken=${user.verificationToken}`;
    // await verifyEmail(verifyUrl, "delivered@resend.dev");
    const token = await user.generateAuthToken();
    res
        .status(201)
        .json({ message: "تم انشاء حساب بنجاح يرجى تحقق من ايميلك", token });
});
export const verifyEmail = asyncHandler(async (req, res) => {
    const { verificationToken } = req.query;
    const user = await User.findOne({ verificationToken });
    if (!user ||
        (user.verificationTokenExpire &&
            user.verificationTokenExpire.getTime() < Date.now())) {
        return res.status(404).json({ message: "انتهت صلاحية الرابط" });
    }
    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpire = null;
    await user.save();
    // await welcomeEmail("delivered@resend.dev");
    res.redirect(process.env.FRONTEND_URL + "/login");
});
export const login = asyncHandler(async (req, res) => {
    const { error, value } = loginSchema.validate(req.body);
    if (error)
        return res.status(400).json({ message: error.details[0]?.message });
    const { email, enteredPassword } = value;
    const user = await User.findOne({ email });
    if (!user)
        return res.status(404).json({ message: "لا يوجد حساب فى هذا الايميل" });
    if (!user.isVerified) {
        return res
            .status(500)
            .json({ message: "الرجاء التحقق من بريدك الإلكتروني لتفعيل الحساب." });
    }
    const isMatch = await user.matchPassword(enteredPassword);
    if (!isMatch)
        return res.status(400).json({ message: "كلمة مرور خاطئة" });
    const token = await user.generateAuthToken();
    // res.cookie("jwt-auth", token, { ... });
    res.status(200).json({ message: "تم تسجيل الدخول بنجاح", token });
});
export const getProfile = asyncHandler(async (req, res) => {
    res.status(200).json({ user: req.user });
});
export const forgetPassword = asyncHandler(async (req, res) => {
    const { error, value } = forgetPasswordSchema.validate(req.body);
    if (error)
        return res.status(400).json({ message: error.details[0]?.message });
    const { email } = value;
    const user = await User.findOne({ email });
    if (!user)
        return res.status(404).json({ message: "لا يوجد حساب فى هذا الايميل" });
    user.resetPasswordToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordTokenExpire = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();
    // await forgetPasswordEmail(user.resetPasswordToken, "delivered@resend.dev");
    res.status(200).json({
        message: "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني",
    });
});
export const resetPassword = asyncHandler(async (req, res) => {
    const { error, value } = resetPasswordSchema.validate(req.body);
    if (error)
        return res.status(400).json({ message: error.details[0]?.message });
    const { password, resetPasswordToken } = value;
    const user = await User.findOne({ resetPasswordToken });
    if (!user ||
        (user.resetPasswordTokenExpire &&
            user.resetPasswordTokenExpire.getTime() < Date.now())) {
        return res.status(404).json({ message: "انتهت صلاحية الرابط" });
    }
    user.resetPasswordToken = null;
    user.resetPasswordTokenExpire = null;
    user.password = password;
    await user.save();
    // await passwordChangedEmail("delivered@resend.dev");
    res.status(200).json({ message: "تم تغيير كلمة مرور بنجاح" });
});
export const updateProfile = asyncHandler(async (req, res) => {
    const { value, error } = updateProfileSchema.validate(req.body);
    if (error)
        return res.status(400).json({ message: error.details[0]?.message });
    const { name, role, avatar, password, enteredPassword } = value;
    if (name)
        req.user.name = name;
    if (role)
        req.user.role = role;
    if (enteredPassword) {
        const isMatch = await req.user.matchPassword(password);
        if (!isMatch)
            return res.status(400).json({ message: "كلمة مرور خاطئة" });
        req.user.password = enteredPassword;
    }
    await req.user.save();
    return res.status(200).json({ message: "تم تحديث ملفك الشخصى بنجاح" });
});
export const logout = asyncHandler(async (req, res) => {
    // const userToken = req.signedCookies["jwt-auth"];
    const authHeader = req.headers.authorization;
    const userToken = authHeader && authHeader.split(" ")[1];
    req.user.tokens = req.user.tokens.filter((t) => t.token !== userToken);
    await req.user.save();
    // res.clearCookie("jwt-auth", { ... });
    res.status(200).json({ message: "تم تسجيل الخروج بنجاح" });
});
