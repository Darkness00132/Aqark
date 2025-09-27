import { Metadata } from "next";
import ProfileForm from "@/components/user/profileForm";

export const metadata: Metadata = {
  title: "الملف الشخصى",
  description: "",
};

export default function Profile() {
  return (
    <div className="card bg-base-100/60 rounded-2xl shadow-xl flex flex-col justify-center my-5 mx-auto w-[80%] max-w-4xl p-6 sm:p-10 border border-base-300">
      <h1 className="text-3xl text-center font-bold mb-5 text-base-content">
        الملف الشخصى
      </h1>
      <div className="min-h-screen flex flex-col items-center">
        <ProfileForm />
      </div>
    </div>
  );
}
