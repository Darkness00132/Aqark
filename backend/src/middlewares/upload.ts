import multer from "multer";

export const upload = ({ type }: { type: "avatar" | "ad" }) =>
  multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: type === "avatar" ? 2 * 1024 * 1024 : 5 * 1024 * 1024, // 2MB for avatars, 5MB for ads
      files: type === "avatar" ? 1 : 5, // Max 1 file for avatars, 5 files for ads
    },
  });
