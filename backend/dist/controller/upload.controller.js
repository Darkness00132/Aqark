import asyncHandler from "../utils/asyncHnadler.js";
import { s3Service } from "../services/s3.service.js";
import { imageService } from "../services/image.service.js";
export const uploadAvatar = asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "يرجى ارسال الصورة" });
    }
    // Validate file type and size
    const validation = imageService.validateFiles([req.file], "avatar");
    if (!validation.valid) {
        return res.status(400).json({ message: validation.error });
    }
    try {
        const processedBuffer = await imageService.processAvatar(req.file.buffer);
        // Upload to S3
        const { url, key } = await s3Service.uploadOne(processedBuffer, "avatars");
        // Delete old avatar if exists
        if (req.user.avatarKey) {
            await s3Service.deleteOne(req.user.avatarKey);
        }
        req.user.avatar = url;
        req.user.avatarKey = key;
        await req.user.save();
        res.status(200).json({
            message: "تم تحديث الصورة بنجاح",
            avatar: url,
        });
    }
    catch (error) {
        console.error("Avatar upload error:", error);
        return res
            .status(500)
            .json({ message: error.message || "فشل رفع الصورة" });
    }
});
/**
 * Upload images for a new ad (called during ad creation)
 * Returns array of {url, key} to be stored with the ad
 */
export const uploadAdImages = asyncHandler(async (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: "يرجى ارسال الصور" });
    }
    const files = req.files;
    // Validate files (max 5 images)
    const validation = imageService.validateFiles(files, "ad", 5);
    if (!validation.valid) {
        return res.status(400).json({ message: validation.error });
    }
    try {
        // Process images concurrently
        const processedBuffers = await imageService.processAdImages(files);
        // Upload to S3
        const uploadedImages = await s3Service.uploadMany(processedBuffers, "adImages");
        res.status(200).json({
            message: "تم رفع الصور بنجاح",
            images: uploadedImages,
        });
    }
    catch (error) {
        console.error("Ad images upload error:", error);
        return res
            .status(500)
            .json({ message: error.message || "فشل رفع الصور" });
    }
});
export const deleteAdImages = asyncHandler(async (req, res) => {
    const { keys } = req.secureBody;
    // Validate input
    if (!keys || !Array.isArray(keys) || keys.length === 0) {
        return res.status(400).json({ message: "لم يتم توفير المفاتيح" });
    }
    try {
        // Delete from S3
        await s3Service.deleteMany(keys);
        res.status(200).json({ message: "تم حذف الصور بنجاح" });
    }
    catch (error) {
        console.error("Delete images error:", error);
        return res
            .status(500)
            .json({ message: error.message || "فشل حذف الصور" });
    }
});
//# sourceMappingURL=upload.controller.js.map