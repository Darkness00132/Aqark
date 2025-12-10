import { createAdSchema, updateAdSchema, getAdsSchema, } from "../validates/ad.js";
import asyncHandler from "../utils/asyncHnadler.js";
import { User, Ad, AdLogs, CreditsLog } from "../models/associations.js";
import { handleAdImagesUpload, handleAdImagesUpdate, deleteAdImages, } from "../utils/upload.js";
import adsFilters from "../utils/adsFilter.js";
import sequelize from "../db/sql.js";
import sanitizeXSS from "../utils/sanitizeXSS.js";
import adCostInCredits from "../utils/adCostInCredits.js";
import validateAdImageUpdate from "../validates/validateAdImageUpdate.js";
// ========== GET ALL ADS ==========
export const getAllAds = asyncHandler(async (req, res) => {
    const { value, error } = getAdsSchema.validate(req.secureQuery);
    if (error) {
        return res.status(400).json({ message: error.details });
    }
    const where = { ...adsFilters(value), isDeleted: false };
    const { page = 1, limit = 8, order } = value;
    let orderChoice;
    switch (order) {
        case "ASC":
            orderChoice = [["createdAt", "ASC"]];
            break;
        case "lowPrice":
            orderChoice = [["price", "ASC"]];
            break;
        case "highPrice":
            orderChoice = [["price", "DESC"]];
            break;
        default:
            orderChoice = [["createdAt", "DESC"]];
    }
    const offset = (page - 1) * limit;
    const { count, rows } = await Ad.findAndCountAll({
        where,
        include: [{ model: User, as: "user" }],
        limit,
        offset,
        order: orderChoice,
    });
    res.status(200).json({
        totalPages: Math.ceil(count / limit),
        ads: rows,
    });
});
// ========== GET MY ADS ==========
export const getMyAds = asyncHandler(async (req, res) => {
    const { value, error } = getAdsSchema.validate(req.secureQuery);
    if (error) {
        return res.status(400).json({ message: error.details });
    }
    const where = adsFilters(value);
    const { page = 1, limit = 8, order } = value;
    let orderChoice;
    switch (order) {
        case "ASC":
            orderChoice = [["createdAt", "ASC"]];
            break;
        case "lowPrice":
            orderChoice = [["price", "ASC"]];
            break;
        case "highPrice":
            orderChoice = [["price", "DESC"]];
            break;
        default:
            orderChoice = [["createdAt", "DESC"]];
    }
    const offset = (page - 1) * limit;
    const { count, rows } = await Ad.findAndCountAll({
        where: { ...where, userId: req.user.id },
        include: [{ model: User, as: "user" }],
        limit,
        offset,
        order: orderChoice,
    });
    res.status(200).json({
        totalPages: Math.ceil(count / limit),
        ads: rows,
    });
});
// ========== GET SITEMAP ADS ==========
export const getSitemapAds = asyncHandler(async (req, res) => {
    const part = parseInt(req.query?.part) || 1;
    const limit = 50000;
    const { count, rows } = await Ad.findAndCountAll({
        attributes: ["slug", "updatedAt"],
        limit,
        offset: (part - 1) * limit,
    });
    res.status(200).json({ ads: rows, total: count });
});
// ========== GET MY AD BY ID ==========
export const getMyAd = asyncHandler(async (req, res) => {
    const { id } = sanitizeXSS(req.params);
    if (!id) {
        return res.status(400).json({ message: "المعرف غير موجود في الرابط" });
    }
    const ad = await Ad.findOne({ where: { id, userId: req.user.id } });
    if (!ad) {
        return res.status(404).json({ message: "لم يتم العثور على الإعلان" });
    }
    res.status(200).json({ ad });
});
// ========== GET AD BY SLUG (PUBLIC) ==========
export const getAdBySlug = asyncHandler(async (req, res) => {
    const { slug } = sanitizeXSS(req.params);
    if (!slug) {
        return res.status(400).json({ message: "المعرف غير موجود في الرابط" });
    }
    const ad = await Ad.findOne({
        where: { slug },
        include: [{ model: User, as: "user" }],
    });
    if (!ad) {
        return res.status(404).json({ message: "لم يتم العثور على الإعلان" });
    }
    res.status(200).json({ ad });
});
// ========== CREATE AD (WITH IMAGES) ==========
export const createAd = asyncHandler(async (req, res) => {
    req.secureBody = sanitizeXSS(req.body);
    const { error, value } = createAdSchema.validate(req.secureBody);
    if (error) {
        return res.status(400).json({ message: error.details[0]?.message });
    }
    const costInCredits = adCostInCredits({
        type: value.type,
        price: value.price,
    });
    if (req.user.credits < costInCredits) {
        return res
            .status(400)
            .json({ message: "رصيدك الحالى لا يكفى لعمل اعلان" });
    }
    // Upload images if provided
    const files = req.files;
    const uploadedImages = files && files.length > 0 ? await handleAdImagesUpload(files, 5) : [];
    // Create ad in transaction
    const result = await sequelize.transaction(async (t) => {
        const ad = await Ad.create({
            ...value,
            userId: req.user.id,
            costInCredits,
            images: uploadedImages,
        }, { transaction: t });
        req.user.credits -= costInCredits;
        await req.user.save({ transaction: t });
        await AdLogs.create({
            userId: req.user.id,
            adId: ad.id,
            action: "create",
            description: `Created ad with title: ${ad.title}`,
        }, { transaction: t });
        await CreditsLog.create({
            userId: req.user.id,
            adId: ad.id,
            description: "Spent credits for creating ad",
            type: "spend",
            credits: costInCredits,
        }, { transaction: t });
        return ad;
    });
    // If transaction fails, rollback S3 uploads (asyncHandler catches errors)
    if (!result && uploadedImages.length > 0) {
        await deleteAdImages(uploadedImages);
    }
    res.status(201).json({ message: "تم انشاء اعلان بنجاح" });
});
// ========== UPDATE AD (WITH IMAGES) ==========
export const updateAd = asyncHandler(async (req, res) => {
    const { id } = sanitizeXSS(req.params);
    const ad = await Ad.findOne({ where: { id, userId: req.user.id } });
    if (!ad) {
        return res
            .status(404)
            .json({ message: "الإعلان غير موجود أو لا تملك صلاحية التعديل عليه" });
    }
    req.secureBody = sanitizeXSS(req.body);
    //ensure deletedImages is array
    req.secureBody.deletedImages = JSON.parse(req.secureBody.deletedImages || "[]");
    const { error, value } = updateAdSchema.validate(req.secureBody);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    // Handle image updates if provided
    const files = req.files;
    const deletedImages = value.deletedImages;
    if (files || !deletedImages || deletedImages.length > 0) {
        const validationError = validateAdImageUpdate(ad.images, deletedImages, files);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }
        const keysToDelete = deletedImages?.map(({ key }) => key);
        const updatedImages = await handleAdImagesUpdate(ad.images || [], files, keysToDelete || []);
        // Update ad with new images
        await ad.update({ ...value, images: updatedImages });
    }
    else {
        // Update ad without touching images
        await ad.update(value);
    }
    await AdLogs.create({
        userId: req.user.id,
        adId: ad.id,
        action: "update",
        description: `Updated ad with title: ${ad.title}`,
    });
    res.status(200).json({ message: "تم تحديث الإعلان بنجاح" });
});
// ========== DELETE AD (WITH IMAGES) ==========
export const deleteAd = asyncHandler(async (req, res) => {
    const { id } = sanitizeXSS(req.params);
    const ad = await Ad.findOne({ where: { id, userId: req.user.id } });
    if (!ad) {
        return res
            .status(404)
            .json({ message: "الإعلان غير موجود أو لا تملك صلاحية الحذف عليه" });
    }
    // Delete images from S3
    if (ad.images && ad.images.length > 0) {
        await deleteAdImages(ad.images);
    }
    // Soft delete
    ad.images = [];
    ad.isDeleted = true;
    await ad.save();
    await AdLogs.create({
        userId: req.user.id,
        adId: ad.id,
        action: "delete",
        description: `Deleted ad with title: ${ad.title}`,
    });
    res.status(200).json({ message: "تم حذف الإعلان بنجاح" });
});
//# sourceMappingURL=ads.controller.js.map