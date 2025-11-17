import passport from "passport";
import { Router, Request, Response, NextFunction } from "express";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User, { type Role } from "../models/user.model.js";
import welcomeEmail from "../emails/welcomeEmail.js";
import { getClientIP } from "../utils/getClientIp.js";
import { CreditsLog } from "../models/associations.js";

const router = Router();

/* -------------------------------------------------------------------------- */
/*                        Handle Successful Login                              */
/* -------------------------------------------------------------------------- */
async function handleLogin(
  user: User,
  req: Request,
  res: Response,
  isAdminMode: boolean
) {
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

  if (!user.isVerified) {
    welcomeEmail(user.email);
  }

  res.cookie("jwt-auth", token, {
    httpOnly: true,
    secure: process.env.PRODUCTION === "true",
    sameSite: process.env.PRODUCTION === "true" ? "none" : "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
    priority: "high",
  });

  const redirectUrl = isAdminMode
    ? process.env.ADMIN_URL
    : process.env.FRONTEND_URL;

  res.redirect(redirectUrl!);
}

/* -------------------------------------------------------------------------- */
/*                               Google Strategy                              */
/* -------------------------------------------------------------------------- */
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
        // Parse state (role + mode)
        let parsedState: { role: Role; mode: string } = {
          role: "user",
          mode: "login",
        };
        if (typeof req.query.state === "string") {
          try {
            parsedState = JSON.parse(req.query.state);
          } catch {
            return done(new Error("بيانات الحالة غير صالحة"), false);
          }
        }

        const { role, mode } = parsedState;

        // Find user by Google ID
        let user = await User.findOne({ where: { googleId: profile.id } });

        // ---------------------- User does not exist ----------------------
        if (!user) {
          const email = profile.emails?.[0]?.value;
          const existing = await User.findOne({ where: { email } });

          if (existing) {
            // Link Google ID to existing account
            existing.googleId = profile.id;
            await existing.save();
            user = existing;
          } else if (mode === "login" || mode === "adminLogin") {
            // BLOCK login attempts for new users
            return done(
              new Error(
                "هذا الحساب غير مسجل لدينا. برجاء إنشاء حساب جديد أولاً قبل تسجيل الدخول."
              ),
              false
            );
          } else {
            // Only allow creation in signup mode
            user = await User.create({
              googleId: profile.id,
              name: profile.displayName,
              email: email!,
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

            await CreditsLog.create({
              userId: user.id!,
              type: "gift",
              description: "Signup verification bonus",
              credits: 100,
            });
          }
        }

        // ---------------------- Admin permission check ----------------------
        if (
          mode === "adminLogin" &&
          !["admin", "superAdmin", "owner"].includes(user.role)
        ) {
          return done(new Error("ليس لديك صلاحية دخول إلى لوحة التحكم"), false);
        }

        // ---------------------- Successful login ----------------------
        return done(null, { user, mode });
      } catch (err) {
        return done(err as Error, false);
      }
    }
  )
);

/* -------------------------------------------------------------------------- */
/*                                    Routes                                  */
/* -------------------------------------------------------------------------- */

// Step 1: Start Google login/signup
router.get(
  "/auth/google",
  (req: Request, res: Response, next: NextFunction) => {
    const role =
      typeof req.query.role === "string" ? (req.query.role as Role) : "user";
    const mode =
      typeof req.query.mode === "string" ? (req.query.mode as string) : "login";

    const state = JSON.stringify({ role, mode });

    passport.authenticate("google", {
      scope: ["profile", "email"],
      state,
    })(req, res, next);
  }
);

// Step 2: Google callback
router.get(
  "/auth/google/callback",
  (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "google",
      { session: false },
      async (err, data: { user: User; mode: string } | false) => {
        let parsedState: { mode: string } = { mode: "login" };
        try {
          if (typeof req.query.state === "string") {
            parsedState = JSON.parse(req.query.state);
          }
        } catch {
          // ignore
        }

        const isAdminMode = parsedState.mode === "adminLogin";
        const redirectBase = isAdminMode
          ? process.env.ADMIN_URL
          : process.env.FRONTEND_URL + "/user";

        // ---------------------- Handle errors ----------------------
        if (err) {
          console.error("Google Auth Error:", err.message);
          return res.redirect(
            `${redirectBase}/login?status=failed&message=${encodeURIComponent(
              err.message
            )}`
          );
        }

        if (!data || !data.user) {
          return res.redirect(
            `${redirectBase}/login?status=failed&message=${encodeURIComponent(
              "تعذر العثور على حساب مرتبط بهذا البريد الإلكتروني"
            )}`
          );
        }

        // ---------------------- Success ----------------------
        await handleLogin(data.user, req, res, isAdminMode);
      }
    )(req, res, next);
  }
);

export default router;
