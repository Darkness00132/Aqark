import auth from "../middlewares/auth.js";
import multer from "multer";
import {
  deleteAdImages,
  uploadAdImages,
  uploadAvatar,
  updateAdImages,
} from "../controller/upload.controller.js";
import { Router } from "express";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedMime = ["image/png", "image/jpg", "image/jpeg", "image/webp"];
    if (allowedMime.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("فقط الصور بصيغ PNG, JPG, JPEG, WEBP مسموح بها"));
    }
  },
});

router.put("/avatar", auth, upload.single("avatar"), uploadAvatar);

router.post("/adImages", auth, upload.array("images", 5), uploadAdImages);

router.put("/adImages/:id", auth, upload.array("images", 5), updateAdImages);

router.delete("/images", auth, deleteAdImages);

export default router;
