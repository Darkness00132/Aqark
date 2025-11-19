import { Router } from "express";
import express from "express";
import auth from "../middlewares/auth.js";
import {
  createPlan,
  createPlanDiscount,
  deletePlan,
  getPlans,
  createPayment,
  paymentProcessed,
} from "../controller/credits.controller.js";
import admin from "../middlewares/admin.js";

const router = Router();

router.get("/plans", getPlans);

router.post("/createPlan", auth, admin, createPlan);

router.post("/createPlanDiscount", auth, admin, createPlanDiscount);

router.delete("/deletePlan/:id", auth, admin, deletePlan);

router.post("/createPayment", auth, createPayment);

router.post(
  "/webhook/processed",
  express.json({
    verify: (req: any, res, buf) => {
      req.rawBody = buf.toString("utf8");
    },
  }),
  paymentProcessed
);

export default router;
