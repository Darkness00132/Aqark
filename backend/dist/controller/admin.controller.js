import { col, fn, literal } from "sequelize";
import { Ad, CreditsPlan, Transaction, User } from "../models/associations.js";
import asyncHandler from "../utils/asyncHnadler.js";
export const getStatus = asyncHandler(async (req, res) => {
    const [userCount, users, ads, boughtCredits] = await Promise.all([
        User.count(),
        User.findAll({ attributes: ["createdAt"], raw: true }),
        Ad.count(),
        Transaction.findAll({
            where: { type: "purchase" },
            attributes: [
                [fn("SUM", col("credits")), "totalCreditsBought"],
                [fn("SUM", literal(`"price" + "gatewayfee"`)), "totalRevenue"],
            ],
            raw: true,
        }),
    ]);
    const { totalCreditsBought, totalRevenue } = boughtCredits[0];
    res.status(200).json({
        userCount,
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
    const { credits, price, bonus } = req.body;
    if (!credits || !price) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    await CreditsPlan.create({
        userId: req.user.id,
        credits,
        price,
        bonus: bonus || 0,
    });
    res.status(201).json({ message: "Credits plan created" });
});
//# sourceMappingURL=admin.controller.js.map