import { NextFunction, Request, Response } from "express";

export default function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
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
}
