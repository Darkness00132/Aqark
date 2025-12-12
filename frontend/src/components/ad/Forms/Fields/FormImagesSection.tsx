"use client";
import { Image } from "lucide-react";
import ImageUpload from "./ImagesUpload";

type DefaultImage = { url: string; key: string };

interface FormImagesSectionProps {
  images: File[];
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
  defaultImages?: Array<{ url: string; key: string }>;
  setDeletedImages?: React.Dispatch<React.SetStateAction<DefaultImage[]>>;
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
        <Image className="text-warning text-2xl" />
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
