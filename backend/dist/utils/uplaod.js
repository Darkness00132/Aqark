// src/helpers/upload.helper.ts
import { s3Service } from "../services/s3.service.js";
import { imageService } from "../services/image.service.js";
/**
 * Process and upload avatar
 * Returns { url, key } or null if no file
 */
export async function handleAvatarUpload(file, oldKey) {
    if (!file)
        return null;
    // Validate
    const validation = imageService.validateFiles([file], "avatar");
    if (!validation.valid) {
        throw new Error(validation.error);
    }
    // Process
    const processedBuffer = await imageService.processAvatar(file.buffer);
    // Upload
    const result = await s3Service.uploadOne(processedBuffer, "avatars");
    // Delete old avatar
    if (oldKey) {
        await s3Service.deleteOne(oldKey);
    }
    return result;
}
/**
 * Process and upload ad images
 * Returns array of { url, key } or empty array if no files
 */
export async function handleAdImagesUpload(files, maxCount = 5) {
    if (!files || files.length === 0)
        return [];
    // Validate
    const validation = imageService.validateFiles(files, "ad", maxCount);
    if (!validation.valid) {
        throw new Error(validation.error);
    }
    // Process
    const processedBuffers = await imageService.processAdImages(files);
    // Upload
    return await s3Service.uploadMany(processedBuffers, "adImages");
}
/**
 * Update ad images (add new, delete old)
 * Returns updated images array
 */
export async function handleAdImagesUpdate(existingImages, newFiles, keysToDelete) {
    let finalImages = [...existingImages];
    // Delete specified images
    if (keysToDelete.length > 0) {
        await s3Service.deleteMany(keysToDelete);
        finalImages = finalImages.filter((img) => !keysToDelete.includes(img.key));
    }
    // Upload new images
    if (newFiles && newFiles.length > 0) {
        const newImages = await handleAdImagesUpload(newFiles);
        finalImages = [...newImages, ...finalImages];
    }
    // Validate total count
    if (finalImages.length > 5) {
        throw new Error("لا يمكن أن يحتوي الإعلان على أكثر من 5 صور");
    }
    return finalImages;
}
/**
 * Delete all ad images
 */
export async function deleteAdImages(images) {
    if (!images || images.length === 0)
        return;
    const keys = images.map((img) => img.key);
    await s3Service.deleteMany(keys);
}
//# sourceMappingURL=uplaod.js.map