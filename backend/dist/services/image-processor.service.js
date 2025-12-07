// services/image-processor.service.js
import sharp from "sharp";
import { nanoid } from "nanoid";
export class ImageProcessor {
    static async processAvatar(buffer) {
        return await sharp(buffer)
            .resize({
            width: 300,
            height: 300,
            fit: "contain",
            withoutEnlargement: true,
            background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
            .webp({ quality: 80, effort: 6 })
            .toBuffer();
    }
    static async processAdImage(buffer) {
        return await sharp(buffer)
            .resize({ width: 1280, withoutEnlargement: true })
            .webp({ quality: 80, effort: 4 })
            .toBuffer();
    }
    static generateAvatarKey() {
        return `avatars/${nanoid(12)}.webp`;
    }
    static generateAdImageKey() {
        return `adImages/${nanoid(12)}.webp`;
    }
}
//# sourceMappingURL=image-processor.service.js.map