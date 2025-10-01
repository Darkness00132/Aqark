import { Router } from "express";
import auth from "../middlewares/auth.js";
import limitReq from "../middlewares/limitReq.js";
import {
  signup,
  login,
  getMyProfile,
  getProfile,
  verify,
  forgetPassword,
  resetPassword,
  updateProfile,
  logout,
} from "../controller/user.controller.js";

const router = Router();

router.post("/signup", limitReq, signup);

router.post("/login", limitReq, login);

router.get("/profile/me", auth, getMyProfile);

router.get("/profile/:slug", getProfile);

router.get("/verifyEmail", limitReq, verify);

router.post("/forgetPassword", limitReq, forgetPassword);

router.post("/resetPassword", limitReq, resetPassword);

router.put("/profile", auth, updateProfile);

router.delete("/logout", auth, logout);

export default router;
