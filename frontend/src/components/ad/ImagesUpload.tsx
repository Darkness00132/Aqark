"use client";

import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";
import Image from "next/image";
import { FiUpload, FiX } from "react-icons/fi";
import { useCallback, useEffect, useState } from "react";

type ImageUploadProps = {
  images: File[];
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
};

export default function ImageUpload({ images, setImages }: ImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);

  // Remove an image by index
  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle file drop + compression
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        const options = {
          maxSizeMB: 5,
          maxWidthOrHeight: 800,
          useWebWorker: true,
          fileType: "image/webp",
        };

        const compressedFiles = await Promise.all(
          acceptedFiles.map((file) => imageCompression(file, options))
        );

        setImages((prev) => [...prev, ...compressedFiles]);
      } catch (error) {
        console.error("Error compressing images:", error);
      }
    },
    [setImages]
  );

  // Generate & cleanup preview URLs
  useEffect(() => {
    if (!images.length) {
      setPreviews([]);
      return;
    }

    const urls = images.map((file) => URL.createObjectURL(file));
    setPreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
  });

  return (
    <div className="col-span-1 md:col-span-3">
      {/* Drop area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-secondary bg-base-200"
            : "border-base-300 bg-base-100"
        }`}
      >
        <input {...getInputProps()} />
        <FiUpload className="w-10 h-10 text-gray-400 mb-2" />
        <p className="text-gray-600">
          {isDragActive
            ? "ضع الصور هنا..."
            : "اسحب الصور هنا أو اضغط لاختيارها"}
        </p>
        <p className="text-sm text-gray-400 mt-1">يمكنك اختيار عدة صور</p>
      </div>

      {/* Preview list */}
      {images.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {images.map((file, idx) => {
            const src = previews[idx];
            if (!src) return null;
            return (
              <div
                key={idx}
                className="card bg-base-100 shadow relative rounded-lg overflow-hidden"
              >
                <div className="aspect-[4/3] relative w-full">
                  <Image
                    src={src}
                    alt={file.name || `Uploaded image ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="absolute top-2 right-2 btn btn-sm btn-circle btn-error text-white"
                  aria-label={`Remove ${file.name || "image"}`}
                >
                  <FiX />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
