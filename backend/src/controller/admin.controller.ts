import { AuthRequest } from "../middlewares/auth.js";
import { Ad, CreditsPlan, User } from "../models/associations.js";
import asyncHandler from "../utils/asyncHnadler.js";
import { Response } from "express";

export const getStatus = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const users = User.findAndCountAll();
    const ads = Ad.findAndCountAll();
    res.status(200).json({ users, ads });
  }
);

export const makeCreditsPlan = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (req.user.role !== "owner" && req.user.role !== "superAdmin") {
      return res
        .status(401)
        .json({ message: "you must be superAdmin or higher" });
    }
    const { name, credits, price, bonus } = req.body;
    if (!name || !credits || !price) {
      return res.status(400).json({ message: "Missing required fields" });
    }
    await CreditsPlan.create({
      name,
      credits,
      price,
      bonus: bonus || 0,
    });
    res.status(201).json({ message: "Credits plan created" });
  }
);
