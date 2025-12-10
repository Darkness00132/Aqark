"use client";

import dynamic from "next/dynamic";
import { FaSearch, FaHome, FaCheckCircle } from "react-icons/fa";

// Lazy-load hero to keep the landing page shell light
const Hero = dynamic(() => import("@/components/UI/Hero"), {
  loading: () => (
    <div className="min-h-[60vh] flex items-center justify-center">
      <span className="loading loading-dots w-20"></span>
    </div>
  ),
  ssr: false,
});

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              لماذا تختار عقارك؟
            </h2>
            <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
              نقدم لك أفضل تجربة للبحث عن العقارات أو عرضها
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <FaSearch className="text-3xl text-primary" />
                </div>
                <h3 className="card-title justify-center">بحث ذكي</h3>
                <p className="text-base-content/70">
                  استخدم أدوات البحث المتقدمة للعثور على العقار المناسب لك
                  بسهولة
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                  <FaHome className="text-3xl text-secondary" />
                </div>
                <h3 className="card-title justify-center">عرض سهل</h3>
                <p className="text-base-content/70">
                  اعرض عقارك بسهولة ووصل مع العملاء المحتملين مباشرة
                </p>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body items-center text-center">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                  <FaCheckCircle className="text-3xl text-accent" />
                </div>
                <h3 className="card-title justify-center">آمن وموثوق</h3>
                <p className="text-base-content/70">
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
