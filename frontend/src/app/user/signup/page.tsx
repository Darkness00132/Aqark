import ChooseRole from "@/components/user/ChooseRole";
import SignupForm from "@/components/user/signupForm";
import { Metadata } from "next";
import { LogIn } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "تسجيل حساب جديد",
  description:
    "قم بإنشاء حساب جديد على عقارك لتتمكن من الوصول لإعلانات العقارات بسهولة.",
};

export default async function Signup({
  searchParams,
}: {
  searchParams: Promise<{ role: string }>;
}) {
  const params = await searchParams;
  const role = params.role;

  return (
    <div className="min-h-screen">
      {!role ? (
        <ChooseRole />
      ) : (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="relative z-10 w-full max-w-sm sm:max-w-md">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-base-content mb-2">
                إنشاء حساب جديد
              </h1>
              <p className="text-lg sm:text-xl text-base-content/70">
                {role === "user"
                  ? "ابدأ رحلتك للبحث عن العقار المثالي"
                  : "اعرض عقارك ووصل مع العملاء المحتملين"}
              </p>
            </div>

            {/* Signup Card */}
            <div className="card bg-base-100/80 backdrop-blur-sm shadow-2xl border border-base-300 rounded-2xl sm:rounded-3xl overflow-hidden">
              <div className="card-body p-4 sm:p-6 lg:p-8">
                <SignupForm role={role} />

                <div className="divider text-base-content/50">أو</div>

                {/* Google Signup */}
                <a
                  href={`${process.env.NEXT_PUBLIC_API_URL}/api/auth/google?mode=signup&&role=${role}`}
                  className="btn btn-outline lg:btn-lg w-full rounded-lg border-base-300 hover:bg-base-200 hover:border-primary/50 transition-all duration-300 group"
                >
                  <LogIn
                    size={20}
                    className="group-hover:scale-110 transition-transform"
                  />
                  <span>إنشاء حساب بـ Google</span>
                </a>

                {/* Footer Links */}
                <div className="text-center mt-6">
                  <div className="text-sm">
                    لديك حساب بالفعل؟{" "}
                    <Link
                      href="/user/login"
                      className="text-primary font-bold hover:text-primary/80 transition-colors hover:underline"
                    >
                      تسجيل الدخول
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
