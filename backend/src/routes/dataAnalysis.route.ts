import { Router } from "express";
import sequelize from "../db/sql.js";
import asyncHandler from "../utils/asyncHnadler.js";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    // get database and convert it to csv

    res.json();
  })
);

export default router;
