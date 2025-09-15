import { Router } from "express";
import auth from "../middlewares/auth.js";
import {
  getReviews,
  getMyReviews,
  setLove,
  createReview,
  updateReview,
  deleteReview,
} from "../controller/review.controller.js";

const router = Router();

router.get("/:publicId", getReviews);

router.get("/me", auth, getMyReviews);

router.post("/:publicId", auth, createReview);

router.post("/:reviewId/love", auth, setLove);

router.put("/:reviewId", auth, updateReview);

router.delete("/:reviewId", auth, deleteReview);

export default router;
