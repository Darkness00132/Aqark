const router = require("express").Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user.model");
const welcomeEmail = require("../emails/welcomeEmail");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/auth/google/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = await User.create({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos?.[0]?.value || "",
            role: "user",
            isVerified: true,
          });
        }
        return done(null, user);
      } catch (e) {
        done(e, null);
      }
    }
  )
);

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  async (req, res) => {
    const token = await req.user.generateAuthToken();
    res.cookie("jwt-auth", token, {
      httpOnly: true,
      signed: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: process.env.PRODUCTION === "true",
      sameSite: process.env.PRODUCTION === "true" ? "none" : "lax",
      domain: process.env.PRODUCTION === "true" ? ".vercel.app" : undefined,
    });

    welcomeEmail("delivered@resend.dev");
    res.redirect(process.env.FRONTEND_URL + "/profile");
  }
);

module.exports = router;
