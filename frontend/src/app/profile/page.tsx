import { Metadata } from "next";
import ProfileForm from "@/components/user/profileForm";

export const metadata: Metadata = {
  title: "الملف الشخصى",
  description: "",
};

export default function Profile() {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <ProfileForm />
    </div>
  );
}
