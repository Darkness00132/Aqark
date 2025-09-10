import AuthInitializer from "@/components/UI/AuthInitializer";
import Link from "next/link";
import {
  FaSearch,
  FaHome,
  FaShieldAlt,
  FaUsers,
  FaClock,
  FaCheckCircle,
} from "react-icons/fa";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ login?: string }>;
}) {
  const params = await searchParams;
  return (
    <div className="min-h-screen">
      <AuthInitializer login={params.login} />

      {/* Hero Section */}
      <div className="hero min-h-screen relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent rounded-full blur-3xl"></div>
        </div>

        <div className="hero-content text-center relative z-10 px-4">
          <div className="max-w-6xl w-full">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black text-base-content mb-4 sm:mb-6 leading-tight">
              مرحباً بك في
              <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                عقارك
              </span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-base-content/80 max-w-4xl mx-auto leading-relaxed mb-8 sm:mb-12 px-2">
              منصة العقارات الأولى في مصر - اعثر على العقار المثالي أو اعرض
              عقارك بسهولة وأمان
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-12 sm:mb-16 max-w-2xl mx-auto">
              <Link
                href="/signup?role=user"
                className="btn btn-primary btn-sm sm:btn-md lg:btn-lg px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 text-sm sm:text-base lg:text-lg font-bold shadow-2xl hover:shadow-primary/25 transition-all duration-300 hover:scale-105 w-full sm:w-auto"
              >
                <FaSearch className="mr-1 sm:mr-2" />
                ابحث عن عقار
              </Link>

              <Link
                href="/signup?role=landlord"
                className="btn btn-secondary btn-sm sm:btn-md lg:btn-lg px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 text-sm sm:text-base lg:text-lg font-bold shadow-2xl hover:shadow-secondary/25 transition-all duration-300 hover:scale-105 w-full sm:w-auto"
              >
                <FaHome className="mr-1 sm:mr-2" />
                اعرض عقارك
              </Link>
            </div>

            {/* Stats Section */}
            <div className="stats stats-vertical sm:stats-horizontal shadow-2xl bg-base-100/80 backdrop-blur-sm border border-base-300 w-full max-w-4xl mx-auto">
              <div className="stat">
                <div className="stat-figure text-primary">
                  <FaHome className="text-2xl sm:text-3xl lg:text-4xl" />
                </div>
                <div className="stat-title text-xs sm:text-sm">
                  العقارات المتاحة
                </div>
                <div className="stat-value text-primary text-lg sm:text-xl lg:text-2xl">
                  1000+
                </div>
              </div>

              <div className="stat">
                <div className="stat-figure text-secondary">
                  <FaUsers className="text-2xl sm:text-3xl lg:text-4xl" />
                </div>
                <div className="stat-title text-xs sm:text-sm">
                  أصحاب العقارات
                </div>
                <div className="stat-value text-secondary text-lg sm:text-xl lg:text-2xl">
                  500+
                </div>
              </div>

              <div className="stat">
                <div className="stat-figure text-accent">
                  <FaShieldAlt className="text-2xl sm:text-3xl lg:text-4xl" />
                </div>
                <div className="stat-title text-xs sm:text-sm">معدل الرضا</div>
                <div className="stat-value text-accent text-lg sm:text-xl lg:text-2xl">
                  95%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                  جميع العقارات معتمدة ومتحقق منها لضمان أفضل تجربة
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
