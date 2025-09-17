"use client";
import { type Ad } from "@/store/useAd";
import Image from "next/image";
import { FaBed, FaRulerCombined, FaMapMarkerAlt } from "react-icons/fa";

export default function AdCard({ ad }: { ad: Ad }) {
  return (
    <div className="card w-full max-w-md bg-base-100 border rounded-2xl shadow-sm hover:shadow-md transition mx-auto overflow-hidden">
      {/* Image */}
      <figure className="relative">
        <Image
          src={ad.images[0]}
          alt={ad.title}
          className="w-full h-[220px] object-cover"
          width={800}
          height={600}
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <span className="absolute top-3 right-3 bg-primary text-white text-xs px-3 py-1 rounded-full">
          {ad.type}
        </span>
      </figure>

      {/* Body */}
      <div className="card-body p-5 space-y-3">
        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-800">{ad.title}</h2>

        {/* Location */}
        <p className="flex items-center text-gray-500 text-sm">
          <FaMapMarkerAlt className="ml-2 text-gray-400" />
          {ad.city} - {ad.area}
        </p>

        {/* Info */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {ad.rooms && (
            <span className="flex items-center gap-1">
              <FaBed className="text-gray-400" /> {ad.rooms} غرف
            </span>
          )}
          {ad.space && (
            <span className="flex items-center gap-1">
              <FaRulerCombined className="text-gray-400" /> {ad.space} م²
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2">{ad.address}</p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2">
          <p className="flex items-center text-lg font-bold text-primary">
            {ad.price.toLocaleString()} جنيه
          </p>
          <a
            href={`/ads/${encodeURIComponent(ad.title)}`}
            className="btn btn-sm btn-primary rounded-lg"
          >
            تفاصيل
          </a>
        </div>
      </div>
    </div>
  );
}
