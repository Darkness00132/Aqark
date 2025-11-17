"use client";
import useAuth from "@/store/useAuth";
import Link from "next/link";
import { FaHome, FaSearch, FaShieldAlt, FaUsers } from "react-icons/fa";

export default function Hero() {
  const user = useAuth((state) => state.user);
  return (
    <div className="hero min-h-screen relative overflow-hidden">
      <div className="hero-content text-center relative z-10 px-4">
        <div className="max-w-6xl w-full">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl font-black text-base-content mb-4 sm:mb-6 leading-tight">
            مرحباً بك في
            <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              عقارك
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-base-content/80 max-w-4xl mx-auto leading-relaxed mb-8 sm:mb-12 px-2">
            اعثر على جميع العقارات وإعلاناتهم في مكان واحد بسهولة وسرعة. وفر
            وقتك وتواصل مباشرة مع اصحاب العقارات.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-12 sm:mb-16 max-w-2xl mx-auto">
            {user?.role !== "landlord" ? (
              <Link
                href="/ads"
                className="btn btn-primary btn-sm sm:btn-md lg:btn-lg px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 text-sm sm:text-base lg:text-lg font-bold shadow-2xl hover:shadow-primary/25 transition-all duration-300 hover:scale-105 w-full sm:w-auto"
              >
                <FaSearch className="mr-1 sm:mr-2" />
                ابحث عن عقار
              </Link>
            ) : (
              <Link
                href="/ads/create"
                className="btn btn-secondary btn-sm sm:btn-md lg:btn-lg px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 text-sm sm:text-base lg:text-lg font-bold shadow-2xl hover:shadow-secondary/25 transition-all duration-300 hover:scale-105 w-full sm:w-auto"
              >
                <FaHome className="mr-1 sm:mr-2" />
                اعرض عقارك
              </Link>
            )}
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
                10+
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
                5+
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
  );
}
