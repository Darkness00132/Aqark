import { col, fn, literal } from "sequelize";
import { Ad, CreditsPlan, Transaction, User } from "../models/associations.js";
import asyncHandler from "../utils/asyncHnadler.js";
export const getStatus = asyncHandler(async (req, res) => {
    const users = User.findAndCountAll();
    const ads = Ad.findAndCountAll();
    const boughtCredits = await Transaction.findAll({
        where: { type: "purchase" },
        attributes: [
            [fn("SUM", col("credits")), "totalCreditsBought"],
            [
                // total revenue = price + gatewayFee
                fn("SUM", literal("price + gatewayFee")),
                "totalRevenue",
            ],
        ],
        raw: true,
    });
    const { totalCreditsBought, totalRevenue } = boughtCredits[0];
    res.status(200).json({
        users,
        ads,
        totalCreditsBought: Number(totalCreditsBought || 0),
        totalRevenue: Number(totalRevenue || 0),
    });
});
export const makeCreditsPlan = asyncHandler(async (req, res) => {
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
});
//# sourceMappingURL=admin.controller.js.map