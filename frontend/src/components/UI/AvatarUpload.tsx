import Image from "next/image";
import { FiUploadCloud } from "react-icons/fi";
import { ChangeEvent, useRef } from "react";

export default function AvatarUplaod({ user }: { user: any }) {
  const avatar = useRef<HTMLInputElement>(null);

  function handleAvatarUpload(e: ChangeEvent<HTMLInputElement>) {
    const avatar = e.target.files?.[0];
    if (!avatar) return;
  }
  return (
    <div
      className="cursor-pointer relative group hover:opacity-75 transition-opacity"
      onClick={() => avatar.current?.click()}
    >
      <Image
        src={user?.avatar || "/avatar.jpg"}
        alt="user avatar"
        width={250}
        height={250}
        className="object-cover object-center rounded-full"
      />
      <div className="absolute inset-0 flex justify-center items-center ">
        <FiUploadCloud
          size={50}
          className="opacity-0 group-hover:opacity-75 transition-opacity"
        />
      </div>
      <input
        type="file"
        className="hidden"
        ref={avatar}
        accept="image/*"
        onChange={handleAvatarUpload}
      />
    </div>
  );
}
