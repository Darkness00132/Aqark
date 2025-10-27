import { Metadata } from "next";
import { FcGoogle } from "react-icons/fc";
import LoginForm from "@/components/user/loginForm";
import ForgetPasswordModal from "@/components/user/forgetPasswordModel";
import Link from "next/link";
import { toast } from "sonner";

export const metadata: Metadata = {
  title: "تسجيل الدخول",
  description:
    "قم بتسجيل الدخول إلى حسابك على موقع عقارك للوصول لإعلانات العقارات بسهولة.",
};

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; message?: string }>;
}) {
  const { status, message } = await searchParams;
  if (status) {
    toast.error("فشل تسجيل الدخول");
  }
  if (status && message) {
    toast.error(message);
  }
  return (
    <>
      <div className="min-h-screen flex items-center justify-center p-4">
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
                href={`${process.env.NEXT_PUBLIC_API_URL}/auth/google?mode=login`}
                className="btn btn-outline lg:btn-lg w-full rounded-lg border-base-300 hover:bg-base-200 hover:border-primary/50 transition-all duration-300 group"
              >
                <FcGoogle
                  size={20}
                  className="group-hover:scale-110 transition-transform"
                />
                <span>تسجيل الدخول بـ Google</span>
              </a>

              {/* Footer Links */}
              <div className="text-center space-y-4 mt-6">
                <ForgetPasswordModal />
                <div className="text-sm">
                  لا تملك حساب بعد؟{" "}
                  <Link
                    href="/user/signup"
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
    </>
  );
}
