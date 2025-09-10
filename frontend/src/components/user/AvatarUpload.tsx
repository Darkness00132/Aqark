import Image from "next/image";
import { FiUploadCloud } from "react-icons/fi";
import { ChangeEvent, useRef } from "react";
import useUploadAvatar from "@/hooks/useUploadAvatar";

export default function AvatarUplaod({
  userAvatar,
}: {
  userAvatar: string | undefined;
}) {
  const avatar = useRef<HTMLInputElement>(null);
  const { mutate, isPending } = useUploadAvatar();

  function handleAvatarUpload(e: ChangeEvent<HTMLInputElement>) {
    const avatar = e.target.files?.[0];
    if (!avatar) return;
    const formData = new FormData();
    formData.append("avatar", avatar);
    mutate(formData);
  }

  return (
    <div
      className="flex flex-col justify-center items-center cursor-pointer relative group hover:opacity-85 transition-opacity"
      onClick={() => avatar.current?.click()}
      aria-disabled={isPending}
    >
      <Image
        src={userAvatar || "/avatar.jpg"}
        alt="user avatar"
        width={250}
        height={250}
        className="object-cover object-center rounded-full"
        priority
      />
      <div className="absolute inset-0 flex justify-center items-center ">
        <FiUploadCloud
          size={50}
          className="opacity-0 group-hover:opacity-85 text-base-100 transition-opacity"
        />
      </div>
      <input
        type="file"
        className="hidden"
        ref={avatar}
        accept="image/*"
        onChange={handleAvatarUpload}
        disabled={isPending}
      />
    </div>
  );
}
