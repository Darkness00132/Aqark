import { Request, Response } from "express";
import {
  createAdSchema,
  getAdsSchema,
  updateAdSchema,
} from "../validates/ad.js";
import { AuthRequest } from "../middlewares/auth.js";
import { s3Client, Bucket } from "./upload.controller.js";
import asyncHandler from "../utils/asyncHnadler.js";
import { User, Ad, AdLogs, Transaction } from "../models/associations.js";
import { DeleteObjectsCommand } from "@aws-sdk/client-s3";
import adsFilters from "../utils/adsFilter.js";
import { Order } from "sequelize";
import sanitizeXSS from "../utils/sanitizeXSS.js";

export const getAllAds = asyncHandler(async (req: Request, res: Response) => {
  const { value, error } = getAdsSchema.validate(req.secureQuery);
  if (error) {
    return res.status(400).json({ message: error.details });
  }
  const where = adsFilters(value);
  const { page = 1, limit = 10, order } = value;
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
  const { count, rows } = await Ad.findAndCountAll({
    where,
    include: [{ model: User, as: "user" }],
    limit,
    offset,
    order: orderChoice,
  });

  res.status(200).json({
    totalItems: count,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
    ads: rows,
  });
});

export const getMyAds = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const ads = await Ad.findAll({
      where: { userId: req.user.id },
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ ads });
  }
);

export const getAdBySlug = asyncHandler(async (req: Request, res: Response) => {
  const slug = sanitizeXSS(req.params.slug);
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

export const createAd = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { error, value } = createAdSchema.validate(req.secureBody);
    if (error) {
      return res.status(400).json({ message: error.details[0] });
    }
    let costInCredits = 1;
    if (value.type === "تمليك") costInCredits = 2;
    const ad = await Ad.create({
      ...value,
      userId: req.user.id,
      costInCredits,
    });

    req.user.credits -= costInCredits;
    await req.user.save();

    await AdLogs.create({
      userId: req.user.id,
      adId: ad.id!,
      action: "create",
      description: `Created ad with title: ${ad.title}`,
    });

    await Transaction.create({
      userId: req.user.id,
      adId: ad.id,
      description: "Spent credits for creating ad",
      type: "spend",
      credits: 2,
    });

    res.status(201).json({ ad });
  }
);

export const updateAd = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { adId } = sanitizeXSS(req.params);
    const ad = await Ad.findOne({ where: { id: adId, userId: req.user.id } });
    if (!ad) {
      return res
        .status(404)
        .json({ message: "الإعلان غير موجود أو لا تملك صلاحية التعديل عليه" });
    }
    const { error, value } = updateAdSchema.validate(req.secureBody);
    if (error) {
      return res.status(400).json({ message: error.details });
    }
    await ad.update(value);

    return res.status(200).json({ message: "تم تحديث الإعلان بنجاح" });
  }
);

export const deleteAd = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { adId } = sanitizeXSS(req.params);
    const ad = await Ad.findOne({ where: { id: adId, userId: req.user.id } });
    if (!ad) {
      return res
        .status(404)
        .json({ message: "الإعلان غير موجود أو لا تملك صلاحية الحذف عليه" });
    }
    //delete images from S3
    const keys = ad.images?.map((img) => img.key) || [];
    if (keys.length > 0) {
      await s3Client.send(
        new DeleteObjectsCommand({
          Bucket,
          Delete: { Objects: keys.map((Key) => ({ Key })) },
        })
      );
    }

    ad.images = [];
    ad.isDeleted = true;
    await ad.save();

    return res.status(200).json({ message: "تم حذف الإعلان بنجاح" });
  }
);
