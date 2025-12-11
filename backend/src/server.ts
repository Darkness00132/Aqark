import "dotenv/config";
import express from "express";
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
import errorHandler from "./middlewares/errorHandler.js";
import { getClientIP } from "./utils/getClientIp.js";

const app = express();
const PORT = process.env.PORT ?? 3000;

// RATE LIMITING
const rateLimiter = new RateLimiterMemory({
  points: 100, // Number of requests
  duration: 60, // Per 60 seconds
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
      retryAfter: retrySecs,
    });
  }
});

// MIDDLEWARE CONFIGURATION
// Trust proxy - important for rate limiting and IP detection behind reverse proxy
app.set("trust proxy", 1);

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

// Compression for performance (reduces response size)
app.use(compression());

// XSS sanitization - sanitize request data
app.use((req, _res, next) => {
  req.secureBody = sanitizeXSS(req.body);
  req.secureQuery = sanitizeXSS(req.query);
  next();
});

// CORS CONFIGURATION
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        process.env.FRONTEND_URL,
        process.env.ADMIN_URL,
      ].filter(Boolean);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ["Set-Cookie"],
    maxAge: 600, // Cache preflight requests for 10 minutes
  })
);

// SECURITY HEADERS (HELMET)
app.use(cookieParser());

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Additional helmet middlewares for enhanced security
app.use(helmet.noSniff()); // Prevent MIME type sniffing
app.use(helmet.dnsPrefetchControl({ allow: false })); // Control DNS prefetching
app.use(helmet.referrerPolicy({ policy: "strict-origin-when-cross-origin" }));
app
  .use(
    helmet.hsts({
      maxAge: 31536000, // 1 year in seconds
      includeSubDomains: true,
      preload: true,
    })
  )
  .disable("x-powered-by");

// DATABASE CONNECTION
try {
  await sequelize.authenticate();
  console.log("✓ Database connection established");

  if (process.env.PRODUCTION === "false") {
    await sequelize.sync({ alter: true });
    console.log("✓ Database schema synchronized");
  }
} catch (error) {
  console.error("✗ Unable to connect to database:", error);
  process.exit(1);
}

// API ROUTES
app
  .use("/api/users", userRouter)
  .use("/api", googleRouter)
  .use("/api/reviews", reviewsRouter)
  .use("/api/ads", adsRouter)
  .use("/api/credits", creditsRouter)
  .use("/api/admin", adminRouter)
  .use((_req, res) => {
    res.status(404).json({ message: "Route not found" });
  })
  .use(errorHandler);

app.listen(PORT, () => {
  console.log(`✓ Server running on port ${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || "development"}`);
});
