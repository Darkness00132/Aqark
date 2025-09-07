import SignupForm from "@/components/signupForm";
import { Metadata } from "next";
import { FcGoogle } from "react-icons/fc";

export const metadata: Metadata = {
  title: "تسجيل حساب جديد",
  description:
    "قم بإنشاء حساب جديد على عقارك لتتمكن من الوصول لإعلانات العقارات بسهولة.",
};

export default function Signup() {
  return (
    <div className="flex flex-col mb-5 md:my-2 md:mt-5 items-center mt-5 min-h-screen bg-base-100">
      <div className="card shadow-lg shadow-gray-500 rounded-xl bg-base-300 w-[90%] sm:w-auto">
        <div className="card-body flex flex-col justify-center items-center">
          <SignupForm />
          <p className="divider">او</p>
          <a
            href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
            className="btn btn-wide bg-white text-black border-[#e5e5e5] flex items-center gap-2 shadow hover:shadow-md transition duration-200"
          >
            انشاء حساب باستعمال جوجل
            <FcGoogle size={28} />
          </a>
        </div>
      </div>
    </div>
  );
}
