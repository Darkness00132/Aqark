import "dotenv/config";
import express, { Response, Request, NextFunction } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import sequelize from "./db/sql.js";
import { RateLimiterMemory, RateLimiterRes } from "rate-limiter-flexible";
import helmet from "helmet";
import compression from "compression";
import googleRouter from "./routes/google.route.js";
import userRouter from "./routes/user.route.js";
import reviewsRouter from "./routes/review.route.js";
import adsRouter from "./routes/ads.route.js";
import creditsRouter from "./routes/credits.routes.js";
import adminRouter from "./routes/admin.route.js";
import sanitizeXSS from "./utils/sanitizeXSS.js";
import { getClientIP } from "./utils/getClientIp.js";

const app = express();
const PORT = process.env.PORT ?? 3000;

// OPTIMIZATION: Increase rate limit points for better UX
const rateLimiter = new RateLimiterMemory({
  points: 100, // Increased from 60
  duration: 60,
  blockDuration: 60, // Block for 1 minute after exceeding
});

app.use(async (req, res, next) => {
  try {
    const ip = getClientIP(req);
    await rateLimiter.consume(ip);
    next();
  } catch (err) {
    const rejRes = err as RateLimiterRes;
    const retrySecs = Math.ceil(rejRes.msBeforeNext / 1000);
    res.status(429).json({
      message: `لقد وصلت الحد الأقصى للطلبات. حاول مرة أخرى بعد ${retrySecs} ثانية.`,
    });
  }
});

// OPTIMIZATION: Add compression middleware
app.use(compression());

app
  .use(express.json({ limit: "10mb" })) // Add limit to prevent large payloads
  .use(express.urlencoded({ extended: true, limit: "10mb" }))
  .set("trust proxy", 1);

// OPTIMIZATION: Move sanitization to after JSON parsing
app.use((req, _res, next) => {
  req.secureBody = sanitizeXSS(req.body);
  req.secureQuery = sanitizeXSS(req.query);
  next();
});

// OPTIMIZATION: Configure CORS more efficiently
const allowedOrigins = [process.env.FRONTEND_URL, process.env.ADMIN_URL].filter(
  Boolean
);

app
  .use(
    cors({
      origin: (origin, cb) => {
        if (!origin || allowedOrigins.includes(origin)) {
          return cb(null, true);
        }
        cb(new Error("Not allowed by CORS"));
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE"],
      maxAge: 86400, // Cache preflight for 24 hours
    })
  )
  .use(cookieParser())
  .use(helmet())
  .use(helmet.noSniff())
  .use(helmet.dnsPrefetchControl({ allow: false }))
  .use(helmet.referrerPolicy({ policy: "no-referrer-when-downgrade" }))
  .use(
    helmet.hsts({ maxAge: 63072000, includeSubDomains: true, preload: true })
  )
  .disable("x-powered-by");

// Database connection
try {
  await sequelize.authenticate();
  if (process.env.PRODUCTION === "false") {
    await sequelize.sync({ alter: true });
    console.log("Database synced");
  }
  console.log("Connected to database");
} catch (error) {
  console.error("Unable to connect to the database:", error);
  process.exit(1); // Exit if database connection fails
}

// Routes
app
  .use("/api/users", userRouter)
  .use("/api", googleRouter)
  .use("/api/reviews", reviewsRouter)
  .use("/api/ads", adsRouter)
  .use("/api/credits", creditsRouter)
  .use("/api/admin", adminRouter);

// OPTIMIZATION: Improved error handler
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  // Only log in development
  if (process.env.NODE_ENV !== "production") {
    console.error("Error:", err);
  }

  let status = 500;
  let message = "Something went wrong";
  let details: any = null;

  if (err instanceof Error) {
    switch (err.name) {
      case "JsonWebTokenError":
        status = 401;
        message = "Invalid or malformed token";
        break;

      case "TokenExpiredError":
        status = 401;
        message = "Token has expired";
        break;

      case "ValidationError": {
        const errorObj = err as any;
        if (errorObj.errors) {
          details = Object.values(errorObj.errors).map((e: any) => ({
            field: e.path,
            message: e.message,
          }));
        } else if (errorObj.details) {
          details = errorObj.details.map((e: any) => ({
            field: e.path?.join("."),
            message: e.message,
          }));
        }
        status = 400;
        message = "Validation failed";
        break;
      }

      default:
        message = err.message || message;
        break;
    }
  } else if (err && typeof err === "object") {
    const e = err as any;

    if (
      e.code === 11000 ||
      e.code === "E11000" ||
      e.name === "SequelizeUniqueConstraintError"
    ) {
      const field =
        Object.keys(e.keyValue || e.fields || {})[0] ||
        (e.errors?.[0]?.path ?? "unknown");
      const value = e.keyValue?.[field] || e.errors?.[0]?.value;
      status = 409;
      message = `Duplicate value for field '${field}'`;
      details = { field, value };
    } else if (e.name === "CastError") {
      status = 400;
      message = `Invalid value for '${e.path}'`;
      details = { field: e.path, value: e.value };
    } else if (e.name === "SequelizeValidationError") {
      status = 400;
      message = "Validation failed";
      details = e.errors.map((x: any) => ({
        field: x.path,
        message: x.message,
      }));
    }
  }

  res.status(status).json({
    message,
    ...(details && { details }),
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
