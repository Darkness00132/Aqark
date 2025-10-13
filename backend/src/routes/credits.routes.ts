import { Router } from "express";
import auth from "../middlewares/auth.js";
import {
  createPlan,
  createPlanDiscount,
  deletePlan,
  getPlans,
} from "../controller/credits.controller.js";
import admin from "../middlewares/admin.js";

const router = Router();

router.use(auth);

router.get("/plans", getPlans);

router.post("/createPlan", auth, admin, createPlan);

router.post("/createPlanDiscount", auth, admin, createPlanDiscount);

router.delete("/deletePlan/:id", auth, admin, deletePlan);

export default router;
