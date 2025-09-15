import { RateLimiterMemory } from "rate-limiter-flexible";
import asyncHandler from "../utils/asyncHnadler.js";
const rateLimiter = new RateLimiterMemory({
    points: 5, // 5 requests
    duration: 5 * 60, // 5 minutes
});
const limitReq = asyncHandler(async (req, res, next) => {
    try {
        await rateLimiter.consume(req.ip || req.socket.remoteAddress || "unknown");
        next();
    }
    catch (err) {
        const rejRes = err;
        const retrySecs = Math.ceil(rejRes.msBeforeNext / 1000);
        res.status(429).json({
            message: `وصلت لعدد أقصى لمحاولة تسجيل دخول. حاول مرة أخرى بعد ${retrySecs} ثانية.`,
        });
    }
});
export default limitReq;
//# sourceMappingURL=limitReq.js.map