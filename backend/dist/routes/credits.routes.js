import { Router } from "express";
import auth from "../middlewares/auth.js";
import { createPlan, createPlanDiscount, createPayment, deletePlan, getPlans, } from "../controller/credits.controller.js";
import admin from "../middlewares/admin.js";
const router = Router();
router.get("/plans", getPlans);
router.post("/createPayment", auth, createPayment);
router.post("/createPlan", auth, admin, createPlan);
router.post("/createPlanDiscount", auth, admin, createPlanDiscount);
router.delete("/deletePlan/:id", auth, admin, deletePlan);
export default router;
//# sourceMappingURL=credits.routes.js.map