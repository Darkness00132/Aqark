import Link from "next/link";
import {
  Search,
  Home,
  ArrowLeft,
  ArrowRight,
  Shield,
  Zap,
  Users,
} from "lucide-react";

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
                <Search className="text-3xl text-primary" />
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
                <ArrowLeft className="group-hover:translate-x-1 transition-transform" />
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
                <Home className="text-3xl text-secondary" />
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
                <ArrowRight className="group-hover:-translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold text-base-content">آمن وموثوق</h3>
            <p className="text-sm text-base-content/70">جميع العقارات معتمدة</p>
          </div>

          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto">
              <Zap className="w-6 h-6 text-secondary" />
            </div>
            <h3 className="font-semibold text-base-content">سريع وسهل</h3>
            <p className="text-sm text-base-content/70">واجهة بسيطة وسهلة</p>
          </div>

          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto">
              <Users className="w-6 h-6 text-accent" />
            </div>
            <h3 className="font-semibold text-base-content">مجتمع كبير</h3>
            <p className="text-sm text-base-content/70">آلاف المستخدمين</p>
          </div>
        </div>
      </div>
    </div>
  );
}
