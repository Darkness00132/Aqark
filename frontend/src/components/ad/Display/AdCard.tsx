"use client";
import { memo } from "react";
import type { Ad } from "@/store/useAd";
import Image from "next/image";
import Link from "next/link";
import {
  FaBed,
  FaRulerCombined,
  FaMapMarkerAlt,
  FaUser,
  FaStar,
  FaClock,
} from "react-icons/fa";
import formatDateFromNow from "@/lib/formatDateFromNow";

interface AdCardProps {
  ad: Ad;
  mine?: boolean;
  priority?: boolean;
}

function AdCard({ ad, mine = false, priority = false }: AdCardProps) {
  return (
    <div className="group relative w-full max-w-md bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 mx-auto overflow-hidden border border-gray-100 hover:border-blue-200 hover:-translate-y-2">
      {/* Image */}
      <figure className="relative h-[220px] sm:h-[260px] overflow-hidden">
        <Image
          src={ad.images[0]?.url || "/placeholder.svg"}
          alt={ad.title}
          fill
          priority={priority}
          loading={priority ? "eager" : "lazy"}
          className="object-cover object-center w-full h-full transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 400px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10" />

        {/* Type badge */}
        <span className="absolute top-4 right-4 bg-primary text-white text-xs font-semibold px-4 py-2 rounded-full shadow-lg z-20">
          {ad.type}
        </span>
      </figure>

      {/* Content */}
      <Link
        href={`/ads/${mine ? "my-ads/" + ad.id : ad.slug}`}
        className="p-6 space-y-4 block"
      >
        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {ad.title}
        </h2>

        {/* Location */}
        <div className="flex items-center text-gray-600 text-sm">
          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center ml-2">
            <FaMapMarkerAlt className="text-red-600" size={12} />
          </div>
          <span className="font-medium">
            {ad.city} - {ad.area}
          </span>
        </div>

        {/* Features */}
        <div className="flex gap-4">
          {ad.rooms && (
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <FaBed className="text-primary" size={12} />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {ad.rooms} غرف
              </span>
            </div>
          )}
          {ad.space && (
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl">
              <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center">
                <FaRulerCombined className="text-amber-600" size={12} />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {ad.space} م²
              </span>
            </div>
          )}
        </div>

        {/* Address */}
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {ad.address}
        </p>

        {/* User */}
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
            {ad.user.avatar ? (
              <Image
                src={ad.user.avatar}
                alt={ad.user.name}
                width={40}
                height={40}
                className="w-full h-full object-cover"
                sizes="40px"
              />
            ) : (
              <FaUser className="text-gray-400" size={18} />
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{ad.user.name}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <FaStar className="text-yellow-400" size={12} />
              <span className="font-medium text-gray-700">
                {ad.user.avgRating?.toFixed(1) || "0.0"}
              </span>
              <span>({ad.user.totalReviews || 0} تقييم)</span>
            </div>
          </div>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <FaClock className="text-gray-400" size={12} />
          <span>{formatDateFromNow(ad.createdAt)}</span>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-medium">السعر</span>
            <p className="text-2xl font-bold text-primary">
              {ad.price.toLocaleString()} جنيه
            </p>
          </div>
          <button className="bg-primary hover:bg-primary/80 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 hover:scale-105">
            {mine ? "تعديل" : "تفاصيل"}
          </button>
        </div>
      </Link>
    </div>
  );
}

// Memoize to prevent unnecessary re-renders
export default memo(AdCard);
