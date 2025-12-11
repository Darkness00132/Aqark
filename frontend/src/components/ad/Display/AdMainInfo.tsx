import {
  FaBed,
  FaRulerCombined,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaPhone,
} from "react-icons/fa";
import type { Ad } from "@/store/useAd";

export default function AdMainInfo({ ad }: { ad: Ad }) {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-gray-200/50">
      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {ad.type && (
          <span className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-xs font-semibold shadow-md">
            {ad.type}
          </span>
        )}
        {ad.propertyType && (
          <span className="px-4 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full text-xs font-semibold shadow-md">
            {ad.propertyType}
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
        {ad.title}
      </h1>

      {/* Location */}
      <div className="flex items-center text-gray-600 mb-6 gap-2">
        <div className="p-2 bg-red-50 rounded-lg">
          <FaMapMarkerAlt className="text-red-500 w-4 h-4" />
        </div>
        <span className="font-medium text-base">
          {ad.city} - {ad.area}
        </span>
      </div>

      {/* Price */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl p-6 mb-6 shadow-xl">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
        <div className="relative z-10">
          <p className="text-white/90 text-sm font-medium mb-1">السعر</p>
          <p className="text-4xl lg:text-5xl font-bold text-white">
            {ad.price.toLocaleString()}
            <span className="text-xl font-medium mr-2">جنيه</span>
          </p>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {ad.rooms && (
          <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200/50">
            <div className="p-3 bg-blue-500 rounded-xl">
              <FaBed className="text-white w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">الغرف</p>
              <p className="text-lg font-bold text-gray-900">{ad.rooms}</p>
            </div>
          </div>
        )}
        {ad.space && (
          <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl border border-yellow-200/50">
            <div className="p-3 bg-yellow-400 rounded-xl">
              <FaRulerCombined className="text-white w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">المساحة</p>
              <p className="text-lg font-bold text-gray-900">{ad.space} م²</p>
            </div>
          </div>
        )}
      </div>

      {/* Address */}
      <p className="text-gray-600 leading-relaxed mb-6 text-base">
        {ad.address}
      </p>

      {/* Contact Buttons */}
      {ad.whatsappNumber && (
        <div className="flex flex-col sm:flex-row gap-3">
          <a
            href={`https://wa.me/${ad.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition shadow-lg font-semibold"
          >
            <FaWhatsapp className="w-6 h-6" />
            تواصل عبر واتساب
          </a>
          <button className="sm:w-auto px-6 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-2xl hover:border-gray-400 hover:bg-gray-50 transition font-semibold flex items-center justify-center gap-2">
            <FaPhone className="w-5 h-5" />
            اتصل الآن
          </button>
        </div>
      )}
    </div>
  );
}
