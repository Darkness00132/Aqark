import SignupForm from "@/components/signupForm";
import { Metadata } from "next";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";

export const metadata: Metadata = {
  title: "تسجيل حساب جديد",
  description:
    "قم بإنشاء حساب جديد على عقارك لتتمكن من الوصول لإعلانات العقارات بسهولة.",
};

export default function Signup() {
  return (
    <div className="flex flex-col mb-5 md:my-2 md:mt-5 items-center min-h-screen bg-base-100">
      <div className="card shadow-xl shadow-base-content rounded-xl w-[70%] bg-base-100 grid my-4 grid-cols-1 md:grid-cols-2">
        <div className="relative h-64 md:h-auto">
          <Image
            src="/bg.png"
            alt="Hero section"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            fetchPriority="high"
            priority
            className="object-cover object-center rounded-r-xl"
          />
        </div>
        <SignupForm />
      </div>

      <div className="w-[70%] flex justify-center">
        <a
          href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
          className="btn btn-wide bg-white text-black border-[#e5e5e5] flex items-center gap-2 shadow hover:shadow-md transition duration-200"
        >
          انشاء حساب باستعمال جوجل
          <FcGoogle size={28} />
        </a>
      </div>
    </div>
  );
}
