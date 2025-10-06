import { AuthRequest } from "../middlewares/auth.js";
import { Response } from "express";
import asyncHandler from "../utils/asyncHnadler.js";
import CreditsPlan from "../models/creditsPlan.js";

export const getPlans = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const plans = CreditsPlan.findAll();
    res.status(200).json({ plans });
  }
);
