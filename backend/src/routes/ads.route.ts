import { Router } from "express";
import auth from "../middlewares/auth.js";
import {
  getAllAds,
  getMyAds,
  getAdBySlug,
  createAd,
  updateAd,
  deleteAd,
  getMyAd,
  getSitemapAds,
} from "../controller/ads.controller.js";

const router = Router();

router.get("/all", getAllAds);

router.get("/me", auth, getMyAds);

router.get("/sitemap", getSitemapAds);

router.get("/me/:id", auth, getMyAd);

router.get("/:slug", getAdBySlug);

router.post("/create", auth, createAd);

router.put("/:id", auth, updateAd);

router.delete("/:id", auth, deleteAd);

export default router;
