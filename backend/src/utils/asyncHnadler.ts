import type { Request, Response, NextFunction, RequestHandler } from "express";

/**
 * Wraps an async Express route handler and forwards errors to next()
 */
function asyncHandler<ReqBody = any, ResBody = any, ReqQuery = any>(
  fn: (
    req: Request<ReqQuery, ResBody, ReqBody>,
    res: Response<ResBody>,
    next: NextFunction
  ) => Promise<any>
): RequestHandler<ReqQuery, ResBody, ReqBody> {
  return function (req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export default asyncHandler;
