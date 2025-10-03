import { Router } from "express";
import auth from "../middlewares/auth.js";
import {
  getReviews,
  getMyReviews,
  createReview,
  updateReview,
  deleteReview,
} from "../controller/review.controller.js";

const router = Router();

router.get("/:slug", getReviews);

router.get("/me", auth, getMyReviews);

router.post("/:slug", auth, createReview);

router.put("/:reviewId", auth, updateReview);

router.delete("/:reviewId", auth, deleteReview);

export default router;
