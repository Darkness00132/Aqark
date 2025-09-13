import { type Response } from 'express';
import { type AuthRequest } from '../middlewares/auth.js';
import { nanoid } from 'nanoid';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
} from '@aws-sdk/client-s3';
import Ad from '../models/ad.model.js';
import asyncHandler from '../utils/asyncHnadler';
import sharp from 'sharp';
import pMap from 'p-map';

export const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_KEY!,
    secretAccessKey: process.env.AWS_SECRET!,
  },
  region: process.env.AWS_REGION!,
});

export const Bucket = process.env.S3_BUCKET!;

export const uploadAvatar = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ message: 'يرجى ارسال الصورة' });
    }
    const buffer = await sharp(req.file.buffer)
      .resize({
        width: 300,
        height: 300,
        fit: 'contain',
        withoutEnlargement: true,
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      })
      .webp({ quality: 90, effort: 6 })
      .toBuffer();

    const key = `avatars/${nanoid(12)}.webp`;
    await s3Client.send(
      new PutObjectCommand({
        Bucket,
        Key: key,
        Body: buffer,
        ContentType: 'image/webp',
        ACL: 'public-read',
      }),
    );

    if (req.user.avatarKey) {
      try {
        await s3Client.send(
          new DeleteObjectCommand({
            Bucket,
            Key: req.user.avatarKey,
          }),
        );
      } catch (err) {
        console.error('Failed to delete old avatar:', err);
      }
    }

    req.user.avatar = `https://${Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
    req.user.avatarKey = key;
    await req.user.save();

    res.status(200).json({ message: 'تم تحديث الصورة بنجاح' });
  },
);

export const uploadAdImages = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    if (!req.files || (req.files && req.files.length === 0)) {
      return res.status(400).json({ message: 'يرجى ارسال الصور' });
    }

    const { adId } = req.secureBody;
    const ad = await Ad.findOne({ where: { id: adId, userId: req.user.id } });
    if (!ad) {
      return res
        .status(404)
        .json({ message: 'الإعلان غير موجود أو لا تملك صلاحية التعديل عليه' });
    }

    const files = req.files as Express.Multer.File[];

    const bufferimages = await pMap(
      files,
      async (file) => {
        const processedBuffer = await sharp(file.buffer)
          .resize({
            width: 800,
            height: 600,
            fit: 'inside',
            withoutEnlargement: true,
          })
          .webp({ quality: 90, effort: 6 })
          .toBuffer();

        return {
          buffer: processedBuffer,
          key: `adImages/${nanoid(12)}.webp`,
        };
      },
      { concurrency: 5 },
    );

    const uploadedImages = await pMap(
      bufferimages,
      async ({ buffer, key }) => {
        await s3Client.send(
          new PutObjectCommand({
            Bucket,
            Key: key,
            Body: buffer,
            ContentType: 'image/webp',
            ACL: 'public-read',
          }),
        );
        return {
          url: `https://${Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`,
          key,
        };
      },
      { concurrency: 10 },
    );

    // Update DB: add new images
    ad.images = [...(ad.images || []), ...uploadedImages];
    await ad.save();

    return res.status(200).json({ message: 'تم رفع الصور' });
  },
);

export const deleteAdImages = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { keys, adId } = req.secureBody;
    const ad = await Ad.findOne({
      where: { id: adId, userId: req.user.id },
    });
    if (!ad) {
      return res.status(404).json({
        message: 'الإعلان غير موجود أو لا تملك صلاحية التعديل عليه',
      });
    }
    if (!keys || !Array.isArray(keys) || keys.length === 0)
      return res.status(400).json({ message: 'No keys provided' });

    if (keys.length > 0) {
      await s3Client.send(
        new DeleteObjectsCommand({
          Bucket,
          Delete: { Objects: keys.map((Key) => ({ Key })) },
        }),
      );
    }

    // Update DB: remove deleted images
    ad.images = ad.images?.filter(
      (img: { key: string }) => !keys.includes(img.key),
    );
    await ad.save();

    res.status(200).json({ message: 'تم حذف' });
  },
);
