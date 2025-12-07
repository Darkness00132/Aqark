import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";
import { nanoid } from "nanoid";

interface UploadResult {
  url: string;
  key: string;
}

export class S3Service {
  private s3: S3Client;
  private bucket: string;
  private region: string;

  constructor() {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_KEY!,
        secretAccessKey: process.env.AWS_SECRET!,
      },
    });
    this.bucket = process.env.S3_BUCKET!;
    this.region = process.env.AWS_REGION!;
  }

  // Upload single file to S3
  async uploadOne(
    buffer: Buffer,
    folder: "avatars" | "adImages"
  ): Promise<UploadResult> {
    const key = this.generateKey(folder);

    try {
      await this.s3.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: key,
          Body: buffer,
          ContentType: "image/webp",
        })
      );

      return {
        url: this.getUrl(key),
        key,
      };
    } catch (error) {
      console.error("S3 upload failed:", error);
      throw new Error("فشل رفع الصورة");
    }
  }

  // Upload multiple files to S3
  async uploadMany(
    buffers: Buffer[],
    folder: "avatars" | "adImages"
  ): Promise<UploadResult[]> {
    const uploadPromises = buffers.map((buffer) =>
      this.uploadOne(buffer, folder)
    );

    try {
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error("S3 batch upload failed:", error);
      throw new Error("فشل رفع الصور");
    }
  }

  // Delete single file from S3
  async deleteOne(key: string): Promise<void> {
    try {
      await this.s3.send(
        new DeleteObjectCommand({
          Bucket: this.bucket,
          Key: key,
        })
      );
    } catch (error) {
      console.error(`Failed to delete S3 file ${key}:`, error);
      // Don't throw - deletion failures shouldn't block the flow
    }
  }

  // Delete multiple files from S3
  async deleteMany(keys: string[]): Promise<void> {
    console.log("Deleting S3 keys:", keys);
    if (keys.length === 0) return;

    try {
      await this.s3.send(
        new DeleteObjectsCommand({
          Bucket: this.bucket,
          Delete: {
            Objects: keys.map((Key) => ({ Key })),
            Quiet: true,
          },
        })
      );
    } catch (error) {
      console.error("S3 batch delete failed:", error);
      // Don't throw - deletion failures shouldn't block the flow
    }
  }

  // Generate unique S3 key
  private generateKey(folder: "avatars" | "adImages"): string {
    const id = nanoid(12);
    return `${folder}/${id}.webp`;
  }

  // Get full S3 URL from key
  private getUrl(key: string): string {
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }
}

// Export singleton instance
export const s3Service = new S3Service();
