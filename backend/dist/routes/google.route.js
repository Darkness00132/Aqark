import passport from "passport";
import { Router } from "express";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";
import welcomeEmail from "../emails/welcomeEmail.js";
import { getClientIP } from "../utils/getClientIp.js";
import { CreditsLog } from "../models/associations.js";
const router = Router();
/* -------------------------------------------------------------------------- */
/*                              Handle Successful Login                       */
/* -------------------------------------------------------------------------- */
async function handleLogin(user, req, res, isAdminMode) {
    const ip = getClientIP(req);
    const userAgent = req.headers["user-agent"] || "unknown";
    user.ips = user.ips || [];
    const existingEntry = user.ips.find((entry) => entry.ip === ip && entry.userAgent === userAgent);
    if (existingEntry) {
        existingEntry.lastLogin = new Date();
    }
    else {
        user.ips.push({ ip, userAgent, lastLogin: new Date() });
    }
    await user.save();
    const token = await user.generateAuthToken();
    // إرسال رسالة ترحيب عند أول تسجيل تحقق
    if (!user.isVerified) {
        welcomeEmail(user.email);
    }
    // حفظ التوكن داخل كوكي محمية
    res.cookie("jwt-auth", token, {
        httpOnly: true,
        secure: process.env.PRODUCTION === "true",
        sameSite: process.env.PRODUCTION === "true" ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7, // أسبوع
        priority: "high",
    });
    const redirectUrl = isAdminMode
        ? `${process.env.ADMIN_URL}/login?status=success`
        : `${process.env.FRONTEND_URL}/user/login?status=success`;
    res.redirect(redirectUrl);
}
/* -------------------------------------------------------------------------- */
/*                               Google Strategy                              */
/* -------------------------------------------------------------------------- */
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.API_URL + "/auth/google/callback",
    passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) => {
    try {
        let parsedState = {
            role: "user",
            mode: "login",
        };
        if (typeof req.query.state === "string") {
            try {
                parsedState = JSON.parse(req.query.state);
            }
            catch {
                return done(new Error("بيانات الحالة غير صالحة"), false);
            }
        }
        const { role, mode } = parsedState;
        let user = await User.findOne({ where: { googleId: profile.id } });
        /* --------------------------- الحالة ١: المستخدم غير موجود --------------------------- */
        if (!user) {
            const email = profile.emails?.[0]?.value;
            const existing = await User.findOne({ where: { email } });
            if (existing) {
                existing.googleId = profile.id;
                await existing.save();
                user = existing;
            }
            else {
                // منع تسجيل جديد في وضع تسجيل الدخول أو المشرف
                if (mode === "login" || mode === "adminLogin") {
                    return done(new Error("ليس لديك صلاحية تسجيل الدخول"), false);
                }
                // إنشاء مستخدم جديد
                user = await User.create({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: email,
                    avatar: profile.photos?.[0]?.value || "",
                    role,
                    isVerified: true,
                    credits: role === "landlord" ? 100 : 0,
                    ips: [
                        {
                            ip: getClientIP(req),
                            userAgent: req.headers["user-agent"] || "unknown",
                            lastLogin: new Date(),
                        },
                    ],
                });
                // منح نقاط ترحيبية
                await CreditsLog.create({
                    userId: user.id,
                    type: "gift",
                    description: "Signup verification bonus",
                    credits: 100,
                });
            }
        }
        /* ------------------------ الحالة ٢: التحقق من صلاحيات المشرف ------------------------ */
        if (mode === "adminLogin" &&
            !["admin", "superAdmin", "owner"].includes(user.role)) {
            return done(new Error("ليس لديك صلاحية دخول إلى لوحة التحكم"), false);
        }
        return done(null, { user, mode });
    }
    catch (err) {
        return done(err, false);
    }
}));
/* -------------------------------------------------------------------------- */
/*                                    Routes                                  */
/* -------------------------------------------------------------------------- */
// الخطوة ١: بدء تسجيل الدخول عبر Google
router.get("/auth/google", (req, res, next) => {
    const role = typeof req.query.role === "string" ? req.query.role : "user";
    const mode = typeof req.query.mode === "string" ? req.query.mode : "login";
    const state = JSON.stringify({ role, mode });
    passport.authenticate("google", {
        scope: ["profile", "email"],
        state,
    })(req, res, next);
});
// الخطوة ٢: استقبال رد Google بعد تسجيل الدخول
router.get("/auth/google/callback", (req, res, next) => {
    passport.authenticate("google", { session: false }, async (err, data) => {
        let parsedState = { mode: "login" };
        try {
            if (typeof req.query.state === "string") {
                parsedState = JSON.parse(req.query.state);
            }
        }
        catch {
            // تجاهل الأخطاء
        }
        const isAdminMode = parsedState.mode === "adminLogin";
        const redirectBase = isAdminMode
            ? process.env.ADMIN_URL
            : process.env.FRONTEND_URL + "/user";
        /* -------------------------- معالجة جميع حالات الفشل -------------------------- */
        if (err) {
            console.error("Google Auth Error:", err.message);
            return res.redirect(`${redirectBase}/login?status=failed&message=${encodeURIComponent(err.message || "حدث خطأ أثناء تسجيل الدخول عبر Google")}`);
        }
        if (!data || !data.user) {
            return res.redirect(`${redirectBase}/login?status=failed&message=${encodeURIComponent("تعذر العثور على حساب مرتبط بهذا البريد الإلكتروني")}`);
        }
        /* -------------------------- تسجيل الدخول بنجاح -------------------------- */
        await handleLogin(data.user, req, res, isAdminMode);
    })(req, res, next);
});
export default router;
//# sourceMappingURL=google.route.js.map