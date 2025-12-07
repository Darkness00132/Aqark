import { Router } from "express";
import auth from "../middlewares/auth.js";
import { getAllAds, getMyAds, getAdBySlug, createAd, updateAd, deleteAd, getMyAd, getSitemapAds, } from "../controller/ads.controller.js";
import { upload } from "../middlewares/upload.js";
const router = Router();
router.get("/all", getAllAds);
router.get("/me", auth, getMyAds);
router.get("/sitemap", getSitemapAds);
router.get("/me/:id", auth, getMyAd);
router.get("/:slug", getAdBySlug);
router.post("/create", auth, upload({ type: "ad" }).array("images", 5), createAd);
router.put("/:id", auth, upload({ type: "ad" }).array("images", 5), updateAd);
router.delete("/:id", auth, deleteAd);
export default router;
//# sourceMappingURL=ads.route.js.map