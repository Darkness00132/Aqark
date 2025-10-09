import { Router } from "express";
import auth from "../middlewares/auth.js";
import admin from "../middlewares/admin.js";
import { getStatus } from "../controller/admin.controller.js";
const router = Router();
router.use(auth, admin);
router.get("/status", getStatus);
export default router;
//# sourceMappingURL=admin.route.js.map