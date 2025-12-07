import passport from "passport";
import { Router } from "express";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";
import welcomeEmail from "../emails/welcomeEmail.js";
import { getClientIP } from "../utils/getClientIp.js";
import { CreditsLog } from "../models/associations.js";
import sequelize from "../db/sql.js";
const router = Router();
const SIGNUP_BONUS_CREDITS = 100;
// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.API_URL + "/api/auth/google/callback",
    passReqToCallback: true,
}, async (req, _accessToken, _refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
            return done(new Error("لم يتم العثور على البريد الإلكتروني"), false);
        }
        // Parse role and mode from state
        let role = "user";
        let mode = "login";
        if (typeof req.query.state === "string") {
            try {
                const parsed = JSON.parse(req.query.state);
                role = parsed.role || "user";
                mode = parsed.mode || "login";
            }
            catch {
                return done(new Error("بيانات الحالة غير صالحة"), false);
            }
        }
        // Find user by Google ID or email
        let user = await User.findOne({
            where: { googleId: profile.id },
        });
        if (!user) {
            user = await User.findOne({ where: { email } });
        }
        // User exists - link Google ID if not linked
        if (user) {
            if (!user.googleId) {
                user.googleId = profile.id;
                await user.save();
            }
            return done(null, user);
        }
        // User doesn't exist
        if (mode === "login") {
            return done(new Error("هذا الحساب غير مسجل. يرجى إنشاء حساب جديد أولاً."), false);
        }
        // Create new user (signup mode)
        const ip = getClientIP(req);
        const userAgent = req.headers["user-agent"] || "unknown";
        user = await sequelize.transaction(async (t) => {
            const newUser = await User.create({
                googleId: profile.id,
                name: profile.displayName,
                email,
                avatar: profile.photos?.[0]?.value,
                role,
                isVerified: true,
                credits: SIGNUP_BONUS_CREDITS,
                ips: [{ ip, userAgent, lastLogin: new Date() }],
            }, { transaction: t });
            await CreditsLog.create({
                userId: newUser.id,
                type: "gift",
                description: "Signup verification bonus",
                credits: SIGNUP_BONUS_CREDITS,
            }, { transaction: t });
            return newUser;
        });
        // Send welcome email (non-blocking)
        welcomeEmail(email).catch((err) => console.error("Welcome email failed:", err));
        return done(null, user);
    }
    catch (err) {
        return done(err, false);
    }
}));
// Router for Google OAuth
// Start Google OAuth
router.get("/auth/google", (req, res, next) => {
    const role = req.query.role || "user";
    const mode = req.query.mode || "login";
    const state = JSON.stringify({ role, mode });
    passport.authenticate("google", {
        scope: ["profile", "email"],
        state,
    })(req, res, next);
});
// Google callback
router.get("/auth/google/callback", (req, res, next) => {
    passport.authenticate("google", { session: false }, async (err, user) => {
        const redirectBase = process.env.FRONTEND_URL + "/user";
        // Handle errors
        if (err) {
            console.error("Google Auth Error:", err.message);
            return res.redirect(`${redirectBase}/login?status=failed&message=${encodeURIComponent(err.message)}`);
        }
        if (!user) {
            return res.redirect(`${redirectBase}/login?status=failed&message=${encodeURIComponent("فشل تسجيل الدخول")}`);
        }
        // Update IP tracking
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
        // Generate JWT and set cookie
        const token = await user.generateAuthToken();
        res.cookie("jwt-auth", token, {
            httpOnly: true,
            secure: process.env.PRODUCTION === "true",
            sameSite: process.env.PRODUCTION === "true" ? "none" : "lax",
            maxAge: 1000 * 60 * 60 * 24 * 7,
            priority: "high",
        });
        // Redirect to frontend
        res.redirect(process.env.FRONTEND_URL);
    })(req, res, next);
});
export default router;
//# sourceMappingURL=google.route.js.map