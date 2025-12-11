import { Request, Response } from "express";
import { AuthRequest } from "../middlewares/auth.js";
import {
  createAdSchema,
  updateAdSchema,
  getAdsSchema,
} from "../validates/ad.js";
import asyncHandler from "../utils/asyncHnadler.js";
import { User, Ad, AdLogs, CreditsLog } from "../models/associations.js";
import {
  handleAdImagesUpload,
  handleAdImagesUpdate,
  deleteAdImages,
} from "../utils/upload.js";
import adsFilters from "../utils/adsFilter.js";
import { Order } from "sequelize";
import sequelize from "../db/sql.js";
import sanitizeXSS from "../utils/sanitizeXSS.js";
import adCostInCredits from "../utils/adCostInCredits.js";
import validateAdImageUpdate from "../validates/validateAdImageUpdate.js";

// ========== GET ALL ADS (OPTIMIZED) ==========
export const getAllAds = asyncHandler(async (req: Request, res: Response) => {
  const { value, error } = getAdsSchema.validate(req.secureQuery);
  if (error) {
    return res.status(400).json({ message: error.details });
  }

  const where = { ...adsFilters(value), isDeleted: false };
  const { page = 1, limit = 8, order } = value;

  let orderChoice: Order;
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

  // OPTIMIZATION: Use separate count and findAll for better performance
  const [ads, count] = await Promise.all([
    Ad.findAll({
      where,
      attributes: [
        "id",
        "title",
        "slug",
        "city",
        "area",
        "rooms",
        "space",
        "propertyType",
        "type",
        "price",
        "images",
        "createdAt",
      ],
      include: [
        {
          model: User,
          as: "user",
          attributes: ["slug", "name", "avatar"],
          required: false,
        },
      ],
      limit,
      offset,
      order: orderChoice,
      raw: true,
      nest: true,
    }),
    Ad.count({ where }),
  ]);

  res.status(200).json({
    totalPages: Math.ceil(count / limit),
    ads,
  });
});

// ========== GET MY ADS (OPTIMIZED) ==========
export const getMyAds = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { value, error } = getAdsSchema.validate(req.secureQuery);
    if (error) {
      return res.status(400).json({ message: error.details });
    }

    const where = { ...adsFilters(value), userId: req.user.id };
    const { page = 1, limit = 8, order } = value;

    let orderChoice: Order;
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

    const [ads, count] = await Promise.all([
      Ad.findAll({
        where,
        attributes: [
          "id",
          "title",
          "slug",
          "city",
          "area",
          "rooms",
          "space",
          "propertyType",
          "type",
          "price",
          "images",
          "createdAt",
          "isDeleted",
        ],
        include: [
          {
            model: User,
            as: "user",
            attributes: ["slug", "name", "avatar"],
            required: false,
          },
        ],
        limit,
        offset,
        order: orderChoice,
        raw: true,
        nest: true,
      }),
      Ad.count({ where }),
    ]);

    res.status(200).json({
      totalPages: Math.ceil(count / limit),
      ads,
    });
  }
);

// ========== GET SITEMAP ADS ==========
export const getSitemapAds = asyncHandler(
  async (req: Request, res: Response) => {
    const part = parseInt(req.query?.part as string) || 1;
    const limit = 50000;

    const [ads, count] = await Promise.all([
      Ad.findAll({
        attributes: ["slug", "updatedAt"],
        limit,
        offset: (part - 1) * limit,
        raw: true,
      }),
      Ad.count(),
    ]);

    res.status(200).json({ ads, total: count });
  }
);

// ========== GET MY AD BY ID (OPTIMIZED) ==========
export const getMyAd = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { id } = sanitizeXSS(req.params);

  if (!id) {
    return res.status(400).json({ message: "المعرف غير موجود في الرابط" });
  }

  const ad = await Ad.findOne({
    where: { id, userId: req.user.id },
    raw: true,
  });

  if (!ad) {
    return res.status(404).json({ message: "لم يتم العثور على الإعلان" });
  }

  res.status(200).json({ ad });
});

// ========== GET AD BY SLUG (PUBLIC) - CRITICAL OPTIMIZATION ==========
export const getAdBySlug = asyncHandler(async (req: Request, res: Response) => {
  const { slug } = sanitizeXSS(req.params);

  if (!slug) {
    return res.status(400).json({ message: "المعرف غير موجود في الرابط" });
  }

  // CRITICAL: Use raw query with specific attributes and isDeleted filter
  const ad = await Ad.findOne({
    where: { slug, isDeleted: false },
    attributes: [
      "id",
      "title",
      "slug",
      "city",
      "area",
      "rooms",
      "space",
      "propertyType",
      "address",
      "type",
      "description",
      "images",
      "price",
      "whatsappNumber",
      "createdAt",
      "updatedAt",
    ],
    include: [
      {
        model: User,
        as: "user",
        attributes: ["slug", "name", "avatar", "avgRating", "totalReviews"],
        required: false,
      },
    ],
    raw: true,
    nest: true,
  });

  if (!ad) {
    return res.status(404).json({ message: "لم يتم العثور على الإعلان" });
  }

  res.status(200).json({ ad });
});

// ========== CREATE AD (WITH IMAGES) ==========
export const createAd = asyncHandler(
  async (req: AuthRequest, res: Response) => {
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

    const files = req.files as Express.Multer.File[] | undefined;
    const uploadedImages =
      files && files.length > 0 ? await handleAdImagesUpload(files, 5) : [];

    const result = await sequelize.transaction(async (t) => {
      const ad = await Ad.create(
        {
          ...value,
          userId: req.user.id,
          costInCredits,
          images: uploadedImages,
        },
        { transaction: t }
      );

      req.user.credits -= costInCredits;
      await req.user.save({ transaction: t });

      await AdLogs.create(
        {
          userId: req.user.id,
          adId: ad.id!,
          action: "create",
          description: `Created ad with title: ${ad.title}`,
        },
        { transaction: t }
      );

      await CreditsLog.create(
        {
          userId: req.user.id,
          adId: ad.id,
          description: "Spent credits for creating ad",
          type: "spend",
          credits: costInCredits,
        },
        { transaction: t }
      );

      return ad;
    });

    if (!result && uploadedImages.length > 0) {
      await deleteAdImages(uploadedImages);
    }

    res.status(201).json({ message: "تم انشاء اعلان بنجاح" });
  }
);

// ========== UPDATE AD (WITH IMAGES) ==========
export const updateAd = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = sanitizeXSS(req.params);

    const ad = await Ad.findOne({ where: { id, userId: req.user.id } });
    if (!ad) {
      return res
        .status(404)
        .json({ message: "الإعلان غير موجود أو لا تملك صلاحية التعديل عليه" });
    }

    req.secureBody = sanitizeXSS(req.body);
    req.secureBody.deletedImages = JSON.parse(
      req.secureBody.deletedImages || "[]"
    );

    const { error, value } = updateAdSchema.validate(req.secureBody);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const files = req.files as Express.Multer.File[] | undefined;
    const deletedImages = value.deletedImages as
      | Array<{ key: string }>
      | undefined;
    if (files || !deletedImages || deletedImages.length > 0) {
      const validationError = validateAdImageUpdate(
        ad.images,
        deletedImages,
        files
      );

      if (validationError) {
        return res.status(400).json({ message: validationError });
      }
      const keysToDelete = deletedImages?.map(({ key }) => key);
      const updatedImages = await handleAdImagesUpdate(
        ad.images || [],
        files,
        keysToDelete || []
      );

      await ad.update({ ...value, images: updatedImages });
    } else {
      await ad.update(value);
    }

    await AdLogs.create({
      userId: req.user.id,
      adId: ad.id!,
      action: "update",
      description: `Updated ad with title: ${ad.title}`,
    });

    res.status(200).json({ message: "تم تحديث الإعلان بنجاح" });
  }
);

// ========== DELETE AD (WITH IMAGES) ==========
export const deleteAd = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { id } = sanitizeXSS(req.params);

    const ad = await Ad.findOne({ where: { id, userId: req.user.id } });
    if (!ad) {
      return res
        .status(404)
        .json({ message: "الإعلان غير موجود أو لا تملك صلاحية الحذف عليه" });
    }

    if (ad.images && ad.images.length > 0) {
      await deleteAdImages(ad.images);
    }

    ad.images = [];
    ad.isDeleted = true;
    await ad.save();

    await AdLogs.create({
      userId: req.user.id,
      adId: ad.id!,
      action: "delete",
      description: `Deleted ad with title: ${ad.title}`,
    });

    res.status(200).json({ message: "تم حذف الإعلان بنجاح" });
  }
);
