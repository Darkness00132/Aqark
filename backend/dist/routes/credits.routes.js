import { Router } from "express";
import auth from "../middlewares/auth.js";
import { getPlans } from "../controller/credits.controller.js";
const router = Router();
router.use(auth);
router.get("/plans", getPlans);
export default router;
//# sourceMappingURL=credits.routes.js.map