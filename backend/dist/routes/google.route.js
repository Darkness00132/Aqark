import dotenv from "dotenv";
dotenv.config();
import { Router } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";
// import welcomeEmail from "../emails/welcomeEmail.js";
const router = Router();
// Passport Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.API_URL + "/auth/google/callback",
    passReqToCallback: true,
}, async (req, accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
            const existUser = await User.findOne({
                email: profile.emails?.[0]?.value,
            });
            if (existUser) {
                existUser.googleId = profile.id;
                await existUser.save();
                user = existUser;
            }
            else {
                user = await User.create({
                    googleId: profile.id,
                    name: profile.displayName,
                    email: profile.emails?.[0]?.value,
                    avatar: profile.photos?.[0]?.value || "",
                    role: "user",
                    isVerified: true,
                });
            }
        }
        return done(undefined, user);
    }
    catch (e) {
        done(e, undefined);
    }
}));
// Routes
router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/auth/google/callback", passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
}), async (req, res, next) => {
    try {
        const token = await req.user.generateAuthToken();
        // Example sending welcome email
        // welcomeEmail("delivered@resend.dev");
        // Redirect with token
        res.redirect(`${process.env.FRONTEND_URL}/profile?token=${token}`);
    }
    catch (err) {
        next(err);
    }
});
export default router;
