import Router, {} from "express";
import auth, {} from "../middlewares/auth.js";
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import asyncHandler from "../utils/asyncHnadler.js";
const router = Router();
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Only images are allowed"), false);
        }
        cb(null, true);
    },
});
router.put("/avatar", auth, upload.single("avatar"), asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "يرجى ارسال الصورة" });
    }
    const stream = cloudinary.uploader.upload_stream({ folder: "avatars" }, async (err, result) => {
        if (err)
            return res.status(500).json({ message: err.message });
        //Delete old image if its from cloudinary
        if (req.user?.avatarId) {
            await cloudinary.uploader.destroy(req.user.avatarId);
        }
        req.user.avatar = result?.secure_url;
        req.user.avatarId = result?.public_id;
        await req.user.save();
        res.status(200).json({ message: "تم رفع صورة" });
    });
    stream.end(req.file.buffer);
}));
export default router;
