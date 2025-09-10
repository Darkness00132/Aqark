import { Metadata } from "next";
import { FcGoogle } from "react-icons/fc";
import LoginForm from "@/components/user/loginForm";
import ForgetPasswordModal from "@/components/user/forgetPasswordModel";
import Link from "next/link";

export const metadata: Metadata = {
  title: "تسجيل الدخول",
  description:
    "قم بتسجيل الدخول إلى حسابك على موقع عقارك للوصول لإعلانات العقارات بسهولة.",
};

export default async function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-sm sm:max-w-md">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-base-content mb-2">
            مرحباً بعودتك
          </h1>
          <p className="text-sm sm:text-base text-base-content/70">
            سجل دخولك للوصول إلى حسابك
          </p>
        </div>

        {/* Login Card */}
        <div className="card bg-base-100/80 backdrop-blur-sm shadow-2xl border border-base-300 rounded-2xl sm:rounded-3xl overflow-hidden">
          <div className="card-body p-4 sm:p-6 lg:p-8">
            <LoginForm />

            <div className="divider text-base-content/50">أو</div>

            {/* Google Login */}
            <a
              href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google`}
              className="btn btn-outline btn-sm sm:btn-md lg:btn-lg w-full rounded-2xl border-base-300 hover:bg-base-200 hover:border-primary/50 transition-all duration-300 group"
            >
              <FcGoogle
                size={20}
                className="group-hover:scale-110 transition-transform"
              />
              <span className="text-xs sm:text-sm lg:text-base">
                تسجيل الدخول بـ Google
              </span>
            </a>

            {/* Footer Links */}
            <div className="text-center space-y-4 mt-6">
              <ForgetPasswordModal />
              <div className="text-sm">
                لا تملك حساب بعد؟{" "}
                <Link
                  href="/signup"
                  className="text-primary font-bold hover:text-primary/80 transition-colors hover:underline"
                >
                  إنشاء حساب جديد
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
