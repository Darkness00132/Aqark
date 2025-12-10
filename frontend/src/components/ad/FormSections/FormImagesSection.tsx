"use client";

import { MdImage } from "react-icons/md";
import ImageUpload from "../ImagesUpload";

interface FormImagesSectionProps {
  images: File[];
  setImages: (images: File[]) => void;
  defaultImages?: Array<{ url: string; key: string }>;
  setDeletedImages?: (images: Array<{ url: string; key: string }>) => void;
}

export default function FormImagesSection({
  images,
  setImages,
  defaultImages,
  setDeletedImages,
}: FormImagesSectionProps) {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <MdImage className="text-warning text-2xl" />
        صور العقار
      </h3>
      <ImageUpload
        images={images}
        setImages={setImages}
        defaultImages={defaultImages}
        setDeletedImages={setDeletedImages}
      />
    </div>
  );
}

