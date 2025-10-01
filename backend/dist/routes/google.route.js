import { Router } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";
import welcomeEmail from "../emails/welcomeEmail.js";
import { getClientIP } from "../utils/getClientIp.js";
const router = Router();
// --- Central login/signup handler ---
async function handleLogin(user, req, res) {
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
    if (!user.isVerified) {
        welcomeEmail(user.email);
    }
    res.cookie("jwt-auth", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        secure: process.env.PRODUCTION === "true",
        sameSite: process.env.PRODUCTION === "true" ? "none" : "lax",
        priority: "high",
    });
    res.redirect(`${process.env.FRONTEND_URL}/?login=success`);
}
// --- Passport Google Strategy ---
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.API_URL + "/auth/google/callback",
    passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) => {
    try {
        if (req.secureQuery.state) {
            req.secureQuery.state = JSON.parse(req.secureQuery.state);
        }
        const { role = "user", mode = "login" } = req.secureQuery.state;
        let user = await User.findOne({ where: { googleId: profile.id } });
        if (!user) {
            const existUser = await User.findOne({
                where: { email: profile.emails?.[0]?.value },
            });
            if (existUser) {
                existUser.googleId = profile.id;
                await existUser.save();
                user = existUser;
            }
            else {
                if (mode === "login")
                    return done(undefined, false);
                user = await User.create({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails?.[0]?.value,
                    avatar: profile.photos?.[0]?.value || "",
                    role,
                    isVerified: true,
                    credits: role === "landlord" ? 10 : 0,
                    ips: [
                        {
                            ip: getClientIP(req),
                            userAgent: req.headers["user-agent"] || "unknown",
                            lastLogin: new Date(),
                        },
                    ],
                });
            }
        }
        done(undefined, user);
    }
    catch (err) {
        done(err, undefined);
    }
}));
// --- Routes ---
router.get("/auth/google", (req, res, next) => {
    const role = typeof req.secureQuery.role === "string" ? req.secureQuery.role : "user";
    const mode = typeof req.secureQuery.mode === "string" ? req.secureQuery.mode : "login";
    const state = JSON.stringify({ role, mode });
    passport.authenticate("google", {
        scope: ["profile", "email"],
        state,
    })(req, res, next);
});
router.get("/auth/google/callback", (req, res, next) => {
    passport.authenticate("google", {
        session: false,
        failureRedirect: `${process.env.FRONTEND_URL}/user/signup`,
    })(req, res, next);
}, async (req, res, next) => {
    try {
        if (!req.user)
            return res.redirect(`${process.env.FRONTEND_URL}/user/signup`);
        await handleLogin(req.user, req, res);
    }
    catch (err) {
        next(err);
    }
});
export default router;
//# sourceMappingURL=google.route.js.map