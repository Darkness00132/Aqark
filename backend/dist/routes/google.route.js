import passport from "passport";
import { Router } from "express";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";
import welcomeEmail from "../emails/welcomeEmail.js";
import { getClientIP } from "../utils/getClientIp.js";
import { CreditsLog } from "../models/associations.js";
const router = Router();
/* ----------------------------- Helper: handle login ----------------------------- */
async function handleLogin(user, req, res) {
    const ip = getClientIP(req);
    const userAgent = req.headers["user-agent"] || "unknown";
    user.ips = user.ips || [];
    const existingEntry = user.ips.find((entry) => entry.ip === ip && entry.userAgent === userAgent);
    if (existingEntry)
        existingEntry.lastLogin = new Date();
    else
        user.ips.push({ ip, userAgent, lastLogin: new Date() });
    await user.save();
    const token = await user.generateAuthToken();
    if (!user.isVerified)
        welcomeEmail(user.email);
    res.cookie("jwt-auth", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        secure: process.env.PRODUCTION === "true",
        sameSite: process.env.PRODUCTION === "true" ? "none" : "lax",
        priority: "high",
    });
    res.redirect(`${process.env.FRONTEND_URL}/?login=success`);
}
/* ----------------------------- Google Strategy ----------------------------- */
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.API_URL}/auth/google/callback`,
    passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) => {
    try {
        // Safely parse state
        let parsedState = {
            role: "user",
            mode: "login",
        };
        if (typeof req.query.state === "string") {
            try {
                parsedState = JSON.parse(req.query.state);
            }
            catch {
                return done(new Error("Invalid state data"), false);
            }
        }
        const { role, mode } = parsedState;
        let user = await User.findOne({ where: { googleId: profile.id } });
        // --- New user or linking existing ---
        if (!user) {
            const email = profile.emails?.[0]?.value;
            // If account already exists by email
            const existing = await User.findOne({ where: { email } });
            if (existing) {
                existing.googleId = profile.id;
                await existing.save();
                user = existing;
            }
            else {
                // Prevent new signup if mode = login or adminLogin
                if (mode === "login" || mode === "adminLogin") {
                    return done(new Error("You do not have admin access"), false);
                }
                // Create new user
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
                // Log signup credits
                await CreditsLog.create({
                    userId: user.id,
                    type: "gift",
                    description: "Signup verification bonus",
                    credits: 100,
                });
            }
        }
        // --- Admin login validation ---
        if (mode === "adminLogin" &&
            !["admin", "superAdmin", "owner"].includes(user.role)) {
            return done(new Error("You do not have admin access"), false);
        }
        return done(null, user);
    }
    catch (err) {
        return done(err, false);
    }
}));
/* ----------------------------- Routes ----------------------------- */
// Start Google Auth
router.get("/auth/google", (req, res, next) => {
    const role = typeof req.query.role === "string" ? req.query.role : "user";
    const mode = typeof req.query.mode === "string" ? req.query.mode : "login";
    const state = JSON.stringify({ role, mode });
    passport.authenticate("google", {
        scope: ["profile", "email"],
        state,
    })(req, res, next);
});
// Callback
router.get("/auth/google/callback", (req, res, next) => {
    passport.authenticate("google", { session: false }, async (err, user, info) => {
        if (err) {
            console.error("Google Auth Error:", err.message);
            return res.redirect(`${process.env.FRONTEND_URL}/?login=failed`);
        }
        if (!user) {
            return res.redirect(`${process.env.FRONTEND_URL}/?login=failed`);
        }
        await handleLogin(user, req, res);
    })(req, res, next);
});
export default router;
//# sourceMappingURL=google.route.js.map