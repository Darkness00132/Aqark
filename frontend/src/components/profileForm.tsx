"use client";
import useAuth from "@/store/useAuth";
import AvatarUplaod from "./UI/AvatarUpload";

export default function ProfileForm() {
  const user = useAuth((state) => state.user);

  return (
    <div className="mt-5">
      <AvatarUplaod user={user} />
    </div>
  );
}
