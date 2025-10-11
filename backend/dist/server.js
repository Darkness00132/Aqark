import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import sequelize from "./db/sql.js";
import { RateLimiterMemory } from "rate-limiter-flexible";
import helmet from "helmet";
import googleRouter from "./routes/google.route.js";
import userRouter from "./routes/user.route.js";
import uploadRouter from "./routes/upload.route.js";
import reviewsRouter from "./routes/review.route.js";
import adsRouter from "./routes/ads.route.js";
import creditsRouter from "./routes/credits.routes.js";
import dataAnlysisRouter from "./routes/dataAnalysis.route.js";
import adminRouter from "./routes/admin.route.js";
import sanitizeXSS from "./utils/sanitizeXSS.js";
import { getClientIP } from "./utils/getClientIp.js";
const app = express();
const PORT = process.env.PORT ?? 3000;
const rateLimiter = new RateLimiterMemory({
    points: 60, // 60 requests
    duration: 60, // per minute
});
app.use(async (req, res, next) => {
    try {
        const ip = getClientIP(req);
        await rateLimiter.consume(ip);
        next();
    }
    catch (err) {
        const rejRes = err;
        const retrySecs = Math.ceil(rejRes.msBeforeNext / 1000);
        res.status(429).json({
            message: `لقد وصلت الحد الأقصى للطلبات. حاول مرة أخرى بعد ${retrySecs} ثانية.`,
        });
    }
});
app
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .set("trust proxy", 1);
app.use((req, _res, next) => {
    req.secureBody = sanitizeXSS(req.body);
    req.secureQuery = sanitizeXSS(req.query);
    next();
});
app
    .use(cors({
    origin: (origin, cb) => {
        if (!origin)
            return cb(null, true);
        if ([process.env.FRONTEND_URL, process.env.ADMIN_URL].includes(origin)) {
            return cb(null, true);
        }
        else {
            cb(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
}))
    .use(cookieParser())
    .use(helmet())
    .use(helmet.noSniff())
    .use(helmet.dnsPrefetchControl({ allow: false }))
    .use(helmet.referrerPolicy({ policy: "no-referrer-when-downgrade" }))
    .use(helmet.hsts({ maxAge: 63072000, includeSubDomains: true, preload: true }))
    .disable("x-powered-by");
//database
try {
    await sequelize.authenticate();
    if (process.env.PRODUCTION === "false") {
        await sequelize.sync({ alter: true });
        console.log("data base sync");
    }
    console.log("Connected to Supabase");
}
catch (error) {
    console.error("Unable to connect to the database:", error);
}
// Routes
app
    .use("/api/users", userRouter)
    .use(googleRouter)
    .use("/api/upload", uploadRouter)
    .use("/api/reviews", reviewsRouter)
    .use("/api/ads", adsRouter)
    .use("/api/data-analysis", dataAnlysisRouter)
    .use("/api/credits", creditsRouter)
    .use("/api/admin", adminRouter);
app.use((err, _req, res, _next) => {
    console.error("Error:", err);
    // Default structure
    let status = 500;
    let message = "Something went wrong";
    let details = null;
    // --- Handle known error types ---
    // 1. Native Error object
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
                // Mongoose or Joi-style validation error
                const errorObj = err;
                if (errorObj.errors) {
                    details = Object.values(errorObj.errors).map((e) => ({
                        field: e.path,
                        message: e.message,
                    }));
                }
                else if (errorObj.details) {
                    // Joi validation
                    details = errorObj.details.map((e) => ({
                        field: e.path?.join("."),
                        message: e.message,
                    }));
                }
                status = 400;
                message = "Validation failed";
                break;
            }
            default:
                // Default Error fallback
                message = err.message || message;
                break;
        }
    }
    // 2. Handle plain object errors (like from MongoDB / Sequelize)
    else if (err && typeof err === "object") {
        const e = err;
        // Duplicate key (MongoDB or Sequelize unique constraint)
        if (e.code === 11000 ||
            e.code === "E11000" ||
            e.name === "SequelizeUniqueConstraintError") {
            const field = Object.keys(e.keyValue || e.fields || {})[0] ||
                (e.errors?.[0]?.path ?? "unknown");
            const value = e.keyValue?.[field] || e.errors?.[0]?.value;
            status = 409;
            message = `Duplicate value for field '${field}'`;
            details = { field, value };
        }
        // Invalid ID or bad cast
        else if (e.name === "CastError") {
            status = 400;
            message = `Invalid value for '${e.path}'`;
            details = { field: e.path, value: e.value };
        }
        // Sequelize validation errors
        else if (e.name === "SequelizeValidationError") {
            status = 400;
            message = "Validation failed";
            details = e.errors.map((x) => ({
                field: x.path,
                message: x.message,
            }));
        }
    }
    // --- Final unified response ---
    res.status(status).json({
        message,
        ...(details && { details }),
    });
});
// export default app;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//# sourceMappingURL=server.js.map