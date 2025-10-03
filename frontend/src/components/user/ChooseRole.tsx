import Link from "next/link";
import { FaSearch, FaHome, FaArrowLeft, FaArrowRight } from "react-icons/fa";

export default function ChooseRole() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 mt-5">
      <div className="relative z-10 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-base-content mb-4 sm:mb-6">
            اختر دورك
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-base-content/70 max-w-3xl mx-auto px-4">
            اختر الطريقة التي تريد استخدامها في منصة عقارك
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
          {/* User Role */}
          <Link
            href="/user/signup?role=user"
            className="group card bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm shadow-2xl border border-primary/20 hover:border-primary/40 transition-all duration-500 hover:scale-105 hover:shadow-primary/25 rounded-3xl p-8"
          >
            <div className="card-body text-center space-y-6">
              <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mx-auto">
                <FaSearch className="text-3xl text-primary" />
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-base-content">
                  أبحث عن عقار
                </h2>
                <p className="text-lg text-base-content/70 leading-relaxed">
                  ابحث بسهولة عن العقارات المناسبة لك من بين آلاف العقارات
                  المتاحة
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-primary font-semibold group-hover:gap-4 transition-all duration-300">
                <span>ابدأ البحث</span>
                <FaArrowLeft className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Landlord Role */}
          <Link
            href="/user/signup?role=landlord"
            className="group card bg-gradient-to-br from-secondary/10 to-secondary/5 backdrop-blur-sm shadow-2xl border border-secondary/20 hover:border-secondary/40 transition-all duration-500 hover:scale-105 hover:shadow-secondary/25 rounded-3xl p-8"
          >
            <div className="card-body text-center space-y-6">
              <div className="w-20 h-20 bg-secondary/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mx-auto">
                <FaHome className="text-3xl text-secondary" />
              </div>

              <div className="space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-base-content">
                  صاحب عقار
                </h2>
                <p className="text-lg text-base-content/70 leading-relaxed">
                  اعرض عقارك ووصل مع العملاء المحتملين بسهولة وأمان
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-secondary font-semibold group-hover:gap-4 transition-all duration-300">
                <span>ابدأ العرض</span>
                <FaArrowRight className="group-hover:-translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
              <svg
                className="w-6 h-6 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-base-content">آمن وموثوق</h3>
            <p className="text-sm text-base-content/70">جميع العقارات معتمدة</p>
          </div>

          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto">
              <svg
                className="w-6 h-6 text-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-base-content">سريع وسهل</h3>
            <p className="text-sm text-base-content/70">واجهة بسيطة وسهلة</p>
          </div>

          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto">
              <svg
                className="w-6 h-6 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="font-semibold text-base-content">مجتمع كبير</h3>
            <p className="text-sm text-base-content/70">آلاف المستخدمين</p>
          </div>
        </div>
      </div>
    </div>
  );
}
