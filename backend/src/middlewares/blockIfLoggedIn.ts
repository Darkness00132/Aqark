import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const blockIfLoggedIn = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies["jwt-auth"];
  if (!token) return next(); // No token → allow login

  try {
    // Token exists AND is valid → user is logged in
    jwt.verify(token, process.env.JWT_SECRET!);
    return res.status(400).json({
      message: "You are already logged in",
    });
  } catch {
    // Token exists but invalid/expired → allow login
    return next();
  }
};
