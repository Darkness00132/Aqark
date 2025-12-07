import sharp from "sharp";
import pMap from "p-map";

// Image processing configurations
const IMAGE_CONFIG = {
  avatar: {
    width: 300,
    height: 300,
    quality: 80,
    effort: 6,
  },
  ad: {
    width: 1280,
    quality: 80,
    effort: 4,
  },
};

// File size limits (in bytes)
export const FILE_SIZE_LIMITS = {
  avatar: 5 * 1024 * 1024, // 5MB
  ad: 10 * 1024 * 1024, // 10MB
};

// Allowed MIME types
export const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export class ImageService {
  // Validate file type
  validateFileType(mimetype: string): boolean {
    return ALLOWED_MIME_TYPES.includes(mimetype);
  }

  // Validate file size
  validateFileSize(
    size: number,
    type: "avatar" | "ad"
  ): { valid: boolean; error?: string } {
    const limit = FILE_SIZE_LIMITS[type];
    if (size > limit) {
      const limitMB = limit / (1024 * 1024);
      return {
        valid: false,
        error: `الملف كبير جداً (الحد الأقصى ${limitMB}MB)`,
      };
    }
    return { valid: true };
  }

  // Process avatar image
  async processAvatar(buffer: Buffer): Promise<Buffer> {
    try {
      const config = IMAGE_CONFIG.avatar;

      return await sharp(buffer)
        .resize(config.width, config.height, {
          fit: "cover",
          position: "center",
        })
        .webp({ quality: config.quality, effort: config.effort })
        .toBuffer();
    } catch (error) {
      console.error("Avatar processing failed: ", error);
      throw new Error("فشل معالجة الصورة");
    }
  }

  // Process ad image
  async processAdImage(buffer: Buffer): Promise<Buffer> {
    try {
      const config = IMAGE_CONFIG.ad;

      return await sharp(buffer)
        .resize(config.width, undefined, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .webp({ quality: config.quality, effort: config.effort })
        .toBuffer();
    } catch (error) {
      console.error("Ad image processing failed: ", error);
      throw new Error("فشل معالجة الصورة");
    }
  }

  // Process multiple ad images concurrently
  async processAdImages(files: Express.Multer.File[]): Promise<Buffer[]> {
    try {
      return await pMap(
        files,
        async (file) => this.processAdImage(file.buffer),
        { concurrency: 5 }
      );
    } catch (error) {
      console.error("Batch image processing failed: ", error);
      throw new Error("فشل معالجة الصور");
    }
  }

  // Validate multiple files
  validateFiles(
    files: Express.Multer.File[],
    type: "avatar" | "ad",
    maxCount?: number
  ): { valid: boolean; error?: string } {
    // Check count
    if (maxCount && files.length > maxCount) {
      return {
        valid: false,
        error: `لا يمكن رفع أكثر من ${maxCount} صورة`,
      };
    }

    // Check each file
    for (const file of files) {
      // Validate type
      if (!this.validateFileType(file.mimetype)) {
        return {
          valid: false,
          error: "نوع الملف غير مدعوم (يسمح فقط بـ JPEG, PNG, WebP)",
        };
      }

      // Validate size
      const sizeCheck = this.validateFileSize(file.size, type);
      if (!sizeCheck.valid) {
        return sizeCheck;
      }
    }

    return { valid: true };
  }
}

// Export singleton instance
export const imageService = new ImageService();
