export default function validateAdImageUpdate(
  currentImages: Array<{ key: string }> = [],
  deletedImages: Array<{ key: string }> = [],
  newFiles: Express.Multer.File[] = []
): string | undefined {
  const deleteCount = deletedImages.length;
  const newCount = newFiles.length;

  const remainingImages = currentImages.length - deleteCount;
  const totalAfterUpdate = remainingImages + newCount;

  // يجب أن يظل على الأقل صورة واحدة
  if (totalAfterUpdate < 1) {
    return "يجب أن يحتوي الإعلان على صورة واحدة على الأقل";
  }

  // الحد الأقصى 5 صور
  if (totalAfterUpdate > 5) {
    return "لا يمكن إضافة أكثر من 5 صور للإعلان";
  }

  return undefined;
}
