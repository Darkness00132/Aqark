import { Request, Response } from 'express';
import { createAdSchema, getAdsSchema, updateAdSchema } from '../validates/ad';
import { AuthRequest } from '../middlewares/auth';
import { s3Client, Bucket } from './upload.controller';
import asyncHandler from '../utils/asyncHnadler';
import User from '../models/user.model';
import Ad from '../models/ad.model';
import { DeleteObjectsCommand } from '@aws-sdk/client-s3';
import adsFilters from '../utils/adsFilter';

export const getAllAds = asyncHandler(async (req: Request, res: Response) => {
  const { value, error } = getAdsSchema.validate(req.secureQuery);
  if (error) {
    return res.status(400).json({ message: error.details });
  }
  const where = adsFilters(value);
  const { page = 1, limit = 10 } = value;
  const offset = (page - 1) * limit;
  const ads = await Ad.findAll({
    where,
    include: [{ model: User, as: 'user' }],
    limit,
    offset,
  });

  res.status(200).json({ ads });
});

export const getAdById = asyncHandler(async (req: Request, res: Response) => {
  const ad = await Ad.findOne({
    where: { publicId: req.params.publicId },
    include: [{ model: User, as: 'user' }],
  });
  if (!ad) {
    return res.status(404).json({ message: 'لم يتم العثور على الإعلان' });
  }
  res.status(200).json({ ad });
});

export const createAd = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { error, value } = createAdSchema.validate(req.secureBody);
    if (error) {
      return res.status(400).json({ message: error.details });
    }
    const ad = await Ad.create({ ...value, userId: req.user.id });
    res.status(201).json({ ad });
  },
);

export const updateAd = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { adId } = req.secureBody;
    const ad = await Ad.findOne({ where: { id: adId, userId: req.user.id } });
    if (!ad) {
      return res
        .status(404)
        .json({ message: 'الإعلان غير موجود أو لا تملك صلاحية التعديل عليه' });
    }
    const { error, value } = updateAdSchema.validate(req.secureBody);
    if (error) {
      return res.status(400).json({ message: error.details });
    }
    await ad.update(value);

    return res.status(200).json({ message: 'تم تحديث الإعلان بنجاح' });
  },
);

export const deleteAd = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { adId } = req.secureBody;
    const ad = await Ad.findOne({ where: { id: adId, userId: req.user.id } });
    if (!ad) {
      return res
        .status(404)
        .json({ message: 'الإعلان غير موجود أو لا تملك صلاحية الحذف عليه' });
    }
    //delete images from s3
    const keys = ad.images?.map((img) => img.key) || [];
    if (keys.length > 0) {
      await s3Client.send(
        new DeleteObjectsCommand({
          Bucket,
          Delete: { Objects: keys.map((Key) => ({ Key })) },
        }),
      );
    }

    await ad.destroy();
    return res.status(200).json({ message: 'تم حذف الإعلان بنجاح' });
  },
);
