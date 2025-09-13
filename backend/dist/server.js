import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import sequelize from './db/sql.js';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import helmet from 'helmet';
import xss from 'xss';
import googleRouter from './routes/google.route.js';
import userRouter from './routes/user.route.js';
import uploadRouter from './routes/upload.route.js';
const app = express();
const PORT = process.env.PORT ?? 3000;
const rateLimiter = new RateLimiterMemory({
    points: 60, // 60 requests
    duration: 60, // per minute
});
app.use(async (req, res, next) => {
    try {
        await rateLimiter.consume(req.ip || req.socket.remoteAddress || 'unknown');
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
    .set('trust proxy', 1);
// Sanitize input to prevent xss attacks
const sanitizeXSS = (input) => {
    if (typeof input === 'string')
        return xss(input);
    if (typeof input === 'object' && input !== null) {
        const sanitized = Array.isArray(input) ? [] : {};
        for (const key in input) {
            sanitized[key] = sanitizeXSS(input[key]);
        }
        return sanitized;
    }
    return input;
};
app.use((req, _res, next) => {
    req.secureBody = sanitizeXSS(req.body);
    req.secureQuery = sanitizeXSS(req.query);
    req.secureParams = sanitizeXSS(req.params);
    next();
});
app
    .use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}))
    .use(cookieParser())
    .use(helmet())
    .use(helmet.noSniff())
    .use(helmet.dnsPrefetchControl({ allow: false }))
    .use(helmet.referrerPolicy({ policy: 'no-referrer-when-downgrade' }))
    .use(helmet.hsts({ maxAge: 63072000, includeSubDomains: true, preload: true }))
    .disable('x-powered-by');
//database
try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    console.log('Connected to Supabase');
}
catch (error) {
    console.error('Unable to connect to the database:', error);
}
// Routes
app
    .use('/api/users', userRouter)
    .use(googleRouter)
    .use('/api/upload', uploadRouter);
app.use((err, _req, res, _next) => {
    console.error('Error:', err);
    // If err is an Error object
    if (err instanceof Error) {
        // Handle JWT errors
        if (err.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Invalid token' });
        }
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired' });
        }
        // Handle validation errors (if using Joi or similar)
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors || {}).map((e) => ({
                field: e.path,
                message: e.message,
            }));
            return res.status(400).json({ message: 'Validation failed', errors });
        }
        // Default Error response
        return res
            .status(500)
            .json({ message: err.message || 'Something went wrong' });
    }
    // If err is a plain object (like { code: 11000 } from DB)
    if (err && typeof err === 'object') {
        const e = err;
        if (e.code === 11000 || e.code === 'E11000') {
            const field = Object.keys(e.keyValue || {})[0];
            const value = field ? e.keyValue?.[field] : undefined;
            return res.status(409).json({
                message: `Duplicate value for field '${field}': '${value}'`,
                field,
                value,
            });
        }
        if (e.name === 'CastError') {
            return res
                .status(400)
                .json({ message: `Invalid value for '${e.path}': ${e.value}` });
        }
    }
    // Fallback for anything else (like null-prototype objects)
    res.status(500).json({ message: 'Something went wrong', error: err });
});
// export default app;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//# sourceMappingURL=server.js.map