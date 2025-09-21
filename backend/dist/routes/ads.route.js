import { Router } from "express";
import auth from "../middlewares/auth.js";
import { getAllAds, getMyAds, getAdBySlug, createAd, updateAd, deleteAd, incrementWhatsappClicks, } from "../controller/ads.controller.js";
const router = Router();
router.get("/all", getAllAds);
router.get("/me", auth, getMyAds);
router.get("/:slug", getAdBySlug);
router.post("/increment-whatsapp-clicks/:id", incrementWhatsappClicks);
router.post("/create", auth, createAd);
router.put("/:id", auth, updateAd);
router.delete("/:id", auth, deleteAd);
export default router;
//# sourceMappingURL=ads.route.js.map