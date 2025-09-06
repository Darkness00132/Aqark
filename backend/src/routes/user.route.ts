// src/routes/user.route.ts
import { Router } from "express";
import auth from "../middlewares/auth.js";
import {
  signup,
  login,
  getProfile,
  verifyEmail,
  forgetPassword,
  resetPassword,
  updateProfile,
  logout,
} from "../controller/user.controller.js";

const router = Router();

router.post("/signup", signup);

router.post("/login", login);

router.get("/profile", auth, getProfile);

router.get("/verifyEmail", verifyEmail);

router.post("/forgetPassword", forgetPassword);

router.post("/resetPassword", resetPassword);

router.put("/profile", auth, updateProfile);

router.delete("/logout", auth, logout);

export default router;
