import { Router } from "express";
import auth from "../middlewares/auth.js";
import { createPlan, createPlanDiscount, deletePlan, getPlans, createPayment, paymentResponse, } from "../controller/credits.controller.js";
import admin from "../middlewares/admin.js";
const router = Router();
router.get("/plans", getPlans);
router.post("/createPlan", auth, admin, createPlan);
router.post("/createPlanDiscount", auth, admin, createPlanDiscount);
router.delete("/deletePlan/:id", auth, admin, deletePlan);
router.post("/createPayment", auth, createPayment);
router.post("/webhook/response", paymentResponse);
export default router;
//# sourceMappingURL=credits.routes.js.map