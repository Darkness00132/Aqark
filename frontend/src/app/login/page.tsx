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
    <div className="flex flex-col items-center justify-center min-h-screen max-w-screen bg-base-100">
      <div className="card shadow-lg shadow-gray-500 bg-base-300 rounded-xl w-[90%] sm:w-auto">
        <div className="card-body flex flex-col space-y-2">
          <LoginForm />
          <div className="flex flex-col gap-2 text-sm">
            <ForgetPasswordModal />
            <div>
              لا تملك حساب بعد ؟{" "}
              <Link
                href="/signup"
                className="text-blue-800 font-bold hover:underline ml-1"
              >
                <span>إنشاء حساب جديد</span>
              </Link>
            </div>
          </div>
          <p className="divider">او</p>
          <a
            href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
            className="btn btn-wide self-center bg-white text-black border-[#e5e5e5] flex items-center gap-2 mb-3"
          >
            سجل دخول باستعمال جوجل
            <FcGoogle size={28} />
          </a>
        </div>
      </div>
    </div>
  );
}
