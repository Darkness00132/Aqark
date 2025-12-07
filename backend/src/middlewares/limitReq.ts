import { RateLimiterMemory, RateLimiterRes } from "rate-limiter-flexible";
import asyncHandler from "../utils/asyncHnadler.js";
import { Request, Response, NextFunction } from "express";

export default function rateLimit(
  points: number,
  duration: number,
  message: string
) {
  const limiter = new RateLimiterMemory({ points, duration });

  return asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        await limiter.consume(req.ip || "unknown");
        next();
      } catch (error) {
        const err = error as RateLimiterRes;
        const retrySecs = Math.ceil(err.msBeforeNext / 1000);
        return res.status(429).json({
          message: `${message} Try again in ${retrySecs} seconds.`,
        });
      }
    }
  );
}
