import { Metadata } from "next";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
import LoginForm from "@/components/loginForm";
import ForgetPasswordModal from "@/components/forgetPasswordModel";
import Link from "next/link";

export const metadata: Metadata = {
  title: "تسجيل الدخول",
  description:
    "قم بتسجيل الدخول إلى حسابك على موقع عقارك للوصول لإعلانات العقارات بسهولة.",
};

export default async function Login() {
  return (
    <div className="flex flex-col mb-5 md:my-2 items-center min-h-screen bg-base-100">
      <div className="card shadow-xl shadow-base-content bg-base-100 rounded-xl w-[70%] grid my-10 grid-cols-1 md:grid-cols-2 overflow-hidden">
        <div className="relative h-64 md:h-auto">
          <Image
            src="/bg.png"
            alt="Hero section"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className=" object-cover object-center"
          />
        </div>
        <div className="card-body flex flex-col justify-center p-8 space-y-4">
          <LoginForm />
          <div className="flex flex-col gap-2 mt-2 text-sm">
            <ForgetPasswordModal />
            <p>
              لا تملك حساب بعد؟{" "}
              <Link
                href="/signup"
                className="text-blue-800 font-bold hover:underline ml-1"
              >
                إنشاء حساب جديد
              </Link>
            </p>
          </div>
        </div>
      </div>
      <a
        href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
        className="btn btn-wide bg-white text-black border-[#e5e5e5] flex items-center gap-2 mb-3"
      >
        سجل دخول باستعمال جوجل
        <FcGoogle size={28} />
      </a>
    </div>
  );
}
