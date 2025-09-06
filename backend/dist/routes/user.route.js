// src/routes/user.route.ts
import { Router } from "express";
import auth from "../middlewares/auth.js";
import { signup, login, getProfile, verifyEmail, forgetPassword, resetPassword, logout, } from "../controller/user.controller.js";
const router = Router();
router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", auth, getProfile);
router.get("/verifyEmail", verifyEmail);
router.post("/forgetPassword", forgetPassword);
router.post("/resetPassword", resetPassword);
router.delete("/logout", auth, logout);
export default router;
