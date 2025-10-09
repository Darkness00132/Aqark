import Hero from "@/components/UI/Hero";
import { FaSearch, FaHome, FaCheckCircle } from "react-icons/fa";

export default async function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <div className="py-12 sm:py-16 lg:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-base-content mb-3 sm:mb-4">
              لماذا تختار عقارك؟
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-base-content/70 max-w-2xl mx-auto px-2">
              نقدم لك أفضل تجربة للبحث عن العقارات أو عرضها
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-base-300">
              <div className="card-body text-center p-4 sm:p-6 lg:p-8">
                <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                  <FaSearch className="text-2xl sm:text-3xl text-primary" />
                </div>
                <h3 className="card-title justify-center text-lg sm:text-xl lg:text-2xl mb-3 sm:mb-4">
                  بحث ذكي
                </h3>
                <p className="text-sm sm:text-base text-base-content/70 leading-relaxed">
                  استخدم أدوات البحث المتقدمة للعثور على العقار المناسب لك
                  بسهولة
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-base-300">
              <div className="card-body text-center p-4 sm:p-6 lg:p-8">
                <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-secondary/10 rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                  <FaHome className="text-2xl sm:text-3xl text-secondary" />
                </div>
                <h3 className="card-title justify-center text-lg sm:text-xl lg:text-2xl mb-3 sm:mb-4">
                  عرض سهل
                </h3>
                <p className="text-sm sm:text-base text-base-content/70 leading-relaxed">
                  اعرض عقارك بسهولة ووصل مع العملاء المحتملين مباشرة
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-base-300 sm:col-span-2 lg:col-span-1">
              <div className="card-body text-center p-4 sm:p-6 lg:p-8">
                <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-accent/10 rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                  <FaCheckCircle className="text-2xl sm:text-3xl text-accent" />
                </div>
                <h3 className="card-title justify-center text-lg sm:text-xl lg:text-2xl mb-3 sm:mb-4">
                  آمن وموثوق
                </h3>
                <p className="text-sm sm:text-base text-base-content/70 leading-relaxed">
                  جميع بيانات محمية بكامل و دفع مؤمن و ابلاغ عن اى شخض يخالف
                  القواعد
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
