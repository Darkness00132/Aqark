import { RateLimiterMemory } from "rate-limiter-flexible";
import asyncHandler from "../utils/asyncHnadler.js";
export default function rateLimit(points, duration, message) {
    const limiter = new RateLimiterMemory({ points, duration });
    return asyncHandler(async (req, res, next) => {
        try {
            await limiter.consume(req.ip || "unknown");
            next();
        }
        catch (error) {
            const err = error;
            const retrySecs = Math.ceil(err.msBeforeNext / 1000);
            return res.status(429).json({
                message: `${message} Try again in ${retrySecs} seconds.`,
            });
        }
    });
}
//# sourceMappingURL=limitReq.js.map