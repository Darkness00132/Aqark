import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User, { type Role } from "../models/user.model.js";
import type { AuthRequest } from "../middlewares/auth.js";
import welcomeEmail from "../emails/welcomeEmail.js";

const router = Router();

// Passport Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.API_URL + "/auth/google/callback",
      passReqToCallback: true,
    },
    async (req: Request, accessToken, refreshToken, profile, done) => {
      try {
        if (req.secureQuery.state) {
          req.secureQuery.state = JSON.parse(req.secureQuery.state);
        }
        const { role = "user", mode = "login" }: { role: Role; mode: string } =
          req.secureQuery.state;

        let user = await User.findOne({
          where: { googleId: profile.id },
        });

        if (!user) {
          // check by email
          const existUser = await User.findOne({
            where: { email: profile.emails?.[0]?.value },
          });

          if (existUser) {
            existUser.googleId = profile.id;
            await existUser.save();
            user = existUser;
          } else {
            if (mode === "login") {
              // user tried login but no account
              return done(undefined, false);
            }
            // signup mode
            user = await User.create({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails?.[0]?.value!,
              avatar: profile.photos?.[0]?.value || "",
              role,
              isVerified: true,
              credits: role === "landlord" ? 10 : 0,
            });
          }
        }

        return done(undefined, user);
      } catch (e) {
        done(e, undefined);
      }
    }
  )
);

// Routes
router.get(
  "/auth/google",
  (req: Request, res: Response, next: NextFunction) => {
    const role =
      typeof req.secureQuery.role === "string" ? req.secureQuery.role : "user";
    const mode =
      typeof req.secureQuery.mode === "string" ? req.secureQuery.mode : "login";
    const state = JSON.stringify({ role, mode });

    passport.authenticate("google", {
      scope: ["profile", "email"],
      state,
    })(req, res, next);
  }
);

router.get(
  "/auth/google/callback",
  (req, res, next) => {
    passport.authenticate("google", {
      session: false,
      failureRedirect: process.env.FRONTEND_URL + "/user/signup",
    })(req, res, next);
  },
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.redirect(`${process.env.FRONTEND_URL}/user/signup`);
      }

      const token = await req.user.generateAuthToken();
      welcomeEmail(req.user.email);

      res.cookie("jwt-auth", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        secure: process.env.PRODUCTION === "true",
        sameSite: process.env.PRODUCTION === "true" ? "none" : "lax",
        priority: "high",
      });

      res.redirect(`${process.env.FRONTEND_URL}/?login=success`);
    } catch (err) {
      next(err);
    }
  }
);

export default router;
