import { createAdSchema, getAdsSchema, updateAdSchema, } from "../validates/ad.js";
import { s3Client, Bucket } from "./upload.controller.js";
import asyncHandler from "../utils/asyncHnadler.js";
import { User, Ad, AdLogs, CreditsLogs } from "../models/associations.js";
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import adsFilters from "../utils/adsFilter.js";
import sequelize from "../db/sql.js";
import sanitizeXSS from "../utils/sanitizeXSS.js";
import adCostInCredits from "../utils/adCostInCredits.js";
export const getAllAds = asyncHandler(async (req, res) => {
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
export const getMyAds = asyncHandler(async (req, res) => {
    const ads = await Ad.findAll({
        where: { userId: req.user.id },
        include: [{ model: User, as: "user" }],
        order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ ads });
});
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
    ad.increment("views", { by: 1 });
    res.status(200).json({ ad });
});
export const incrementWhatsappClicks = asyncHandler(async (req, res) => {
    const { slug } = sanitizeXSS(req.params);
    if (!slug) {
        return res.status(400).json({ message: "المعرف غير موجود في الرابط" });
    }
    const [rows, affectedRows] = await Ad.increment("whatsappClicksCount", {
        by: 1,
        where: { slug },
    });
    if (affectedRows === 0) {
        return res.status(404).json({ message: "لم يتم العثور على الإعلان" });
    }
    res.status(200).json();
});
export const createAd = asyncHandler(async (req, res) => {
    const { error, value } = createAdSchema.validate(req.secureBody);
    if (error) {
        return res.status(400).json({ message: error.details[0] });
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
    await sequelize.transaction(async (t) => {
        const ad = await Ad.create({
            ...value,
            userId: req.user.id,
            costInCredits,
        }, { transaction: t });
        req.user.credits -= costInCredits;
        await req.user.save({ transaction: t });
        await AdLogs.create({
            userId: req.user.id,
            adId: ad.id,
            action: "create",
            description: `Created ad with title: ${ad.title}`,
        }, { transaction: t });
        await CreditsLogs.create({
            userId: req.user.id,
            adId: ad.id,
            description: "Spent credits for creating ad",
            type: "spend",
            credits: costInCredits,
        }, { transaction: t });
    });
    res.status(201).json({ message: "تم انشاء اعلان بنجاح" });
});
export const updateAd = asyncHandler(async (req, res) => {
    const { id } = sanitizeXSS(req.params);
    const ad = await Ad.findOne({ where: { id, userId: req.user.id } });
    if (!ad) {
        return res
            .status(404)
            .json({ message: "الإعلان غير موجود أو لا تملك صلاحية التعديل عليه" });
    }
    const { error, value } = updateAdSchema.validate(req.secureBody);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    await ad.update(value);
    await AdLogs.create({
        userId: req.user.id,
        adId: ad.id,
        action: "update",
        description: `Updated ad with title: ${ad.title}`,
    });
    return res.status(200).json({ message: "تم تحديث الإعلان بنجاح" });
});
export const deleteAd = asyncHandler(async (req, res) => {
    const { id } = sanitizeXSS(req.params);
    const ad = await Ad.findOne({ where: { id, userId: req.user.id } });
    if (!ad) {
        return res
            .status(404)
            .json({ message: "الإعلان غير موجود أو لا تملك صلاحية الحذف عليه" });
    }
    //delete images from S3
    const keys = ad.images?.map((img) => img.key) || [];
    if (keys.length > 0) {
        await s3Client.send(new DeleteObjectsCommand({
            Bucket,
            Delete: { Objects: keys.map((Key) => ({ Key })) },
        }));
    }
    ad.images = [];
    ad.isDeleted = true;
    await ad.save();
    await AdLogs.create({
        userId: req.user.id,
        adId: ad.id,
        action: "delete",
        description: `Deleted ad with title: ${ad.title}`,
    });
    return res.status(200).json({ message: "تم حذف الإعلان بنجاح" });
});
//# sourceMappingURL=ads.controller.js.map