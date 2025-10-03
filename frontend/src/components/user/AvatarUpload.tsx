"use client";

import Image from "next/image";
import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";
import { FiUploadCloud } from "react-icons/fi";
import useUploadAvatar from "@/hooks/user/useUploadAvatar";

export default function AvatarUpload({ userAvatar }: { userAvatar?: string }) {
  const { mutate, isPending } = useUploadAvatar();

  async function handleDrop(acceptedFiles: File[]) {
    if (!acceptedFiles?.[0]) return;

    try {
      // compress image
      const compressed = await imageCompression(acceptedFiles[0], {
        maxSizeMB: 5,
        maxWidthOrHeight: 500,
        useWebWorker: true,
      });

      // prepare form data
      const formData = new FormData();
      formData.append("avatar", compressed);

      mutate(formData);
    } catch (error) {
      console.error("Avatar upload failed:", error);
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`flex flex-col justify-center items-center cursor-pointer relative group transition-opacity rounded-full w-[250px] h-[250px] ${
        isDragActive ? "ring-2 ring-primary opacity-90" : "hover:opacity-85"
      }`}
    >
      <Image
        src={userAvatar || "/avatar.webp"}
        alt="user avatar"
        fill
        sizes="250px"
        className="object-cover object-center rounded-full"
        priority
      />

      {/* Overlay icon */}
      <div className="absolute inset-0 flex justify-center items-center">
        <FiUploadCloud
          size={50}
          className="opacity-0 group-hover:opacity-85 text-base-100 transition-opacity"
        />
      </div>

      <input {...getInputProps()} disabled={isPending} />
    </div>
  );
}
