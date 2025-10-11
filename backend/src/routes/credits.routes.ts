import { Router } from "express";
import auth from "../middlewares/auth.js";
import {
  createPlan,
  deletePlan,
  getPlans,
} from "../controller/credits.controller.js";
import admin from "../middlewares/admin.js";

const router = Router();

router.use(auth);

router.get("/plans", getPlans);

router.post("/createPlan", admin, createPlan);

router.delete("/deletePlan/:id", admin, deletePlan);

export default router;
