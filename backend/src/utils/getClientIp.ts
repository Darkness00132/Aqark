import { Request } from "express";

export function getClientIP(req: Request) {
  return (
    req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
    req.socket.remoteAddress ||
    req.ip ||
    "unknown"
  );
}
