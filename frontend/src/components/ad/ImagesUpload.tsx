"use client";

import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";
import Image from "next/image";
import { FiUpload, FiX } from "react-icons/fi";
import { useCallback, useState } from "react";

type DefaultImage = { url: string; key: string };

type ImageUploadProps = {
  images: File[];
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
  defaultImages?: DefaultImage[];
  setDeletedImages?: React.Dispatch<React.SetStateAction<DefaultImage[]>>;
};

export default function ImageUpload({
  setImages,
  defaultImages = [],
  setDeletedImages,
}: ImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [localDefaults, setLocalDefaults] =
    useState<DefaultImage[]>(defaultImages);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        const compressedFiles = await Promise.all(
          acceptedFiles.map((file) =>
            imageCompression(file, {
              maxSizeMB: 5,
              maxWidthOrHeight: 1280,
              useWebWorker: true,
            })
          )
        );

        // Add new files to state
        setImages((prev) => [...prev, ...compressedFiles]);

        const urls = compressedFiles.map((file) => URL.createObjectURL(file));
        setPreviews((prev) => [...prev, ...urls]);
      } catch (error) {
        console.error("Error compressing images:", error);
      }
    },
    [setImages]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
  });

  const removeImage = (type: "default" | "new", index: number) => {
    if (type === "default" && setDeletedImages) {
      setDeletedImages((prev) => [...prev, localDefaults[index]]);
      setLocalDefaults((prev) => prev.filter((_, i) => i !== index));
    } else {
      setImages((prev) => prev.filter((_, i) => i !== index));
      URL.revokeObjectURL(previews[index]);
      setPreviews((prev) => prev.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="col-span-1 md:col-span-3">
      {/* Dropzone */}
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
        <p>
          {isDragActive
            ? "ضع الصور هنا..."
            : "اسحب الصور هنا أو اضغط لاختيارها"}
        </p>
      </div>

      {/* Default images */}
      {localDefaults.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {localDefaults.map((img, idx) => (
            <div
              key={img.key || idx}
              className="card bg-base-100 shadow relative rounded-lg overflow-hidden"
            >
              <div className="aspect-[4/3] relative w-full">
                <Image
                  src={img.url}
                  alt={`Image ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw,
         (max-width: 1024px) 50vw,
         33vw"
                />
              </div>
              <button
                type="button"
                onClick={() => removeImage("default", idx)}
                className="absolute top-2 right-2 btn btn-sm btn-circle btn-error text-white"
              >
                <FiX />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Uploaded images */}
      {previews.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
          {previews.map((url, idx) => (
            <div
              key={idx}
              className="card bg-base-100 shadow relative rounded-lg overflow-hidden"
            >
              <div className="aspect-[4/3] relative w-full">
                <Image
                  src={url}
                  alt={`Uploaded ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <button
                type="button"
                onClick={() => removeImage("new", idx)}
                className="absolute top-2 right-2 btn btn-sm btn-circle btn-error text-white"
              >
                <FiX />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
