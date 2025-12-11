import Image from "next/image";
import Link from "next/link";
import { FaStar, FaClock } from "react-icons/fa";
import formatDateFromNow from "@/lib/formatDateFromNow";

interface AdUserSidebarProps {
  user: any;
  createdAt: string;
}

export default function AdUserSidebar({ user, createdAt }: AdUserSidebarProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200/50 sticky top-6">
        {/* User Avatar */}
        <div className="text-center mb-6">
          <div className="relative w-24 h-24 mx-auto mb-4">
            <Image
              src={user.avatar || "/avatar.webp"}
              alt={user.name}
              width={96}
              height={96}
              className="rounded-full object-cover border-4 border-white shadow-lg"
              loading="lazy"
            />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{user.name}</h3>
          <p className="text-sm text-gray-500 font-medium">المعلن</p>
        </div>

        {/* Rating */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-4 mb-4">
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(user.avgRating || 0)
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-lg font-bold text-gray-900">
              {user.avgRating?.toFixed(1) || "0.0"}
            </span>
          </div>
          <p className="text-xs text-gray-600 text-center mt-1">
            ({user.totalReviews || 0} تقييم)
          </p>
        </div>

        {/* Created Date */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-6 bg-gray-50 rounded-xl p-3">
          <FaClock className="text-gray-400" size={16} />
          <span className="font-medium">
            نُشر {formatDateFromNow(createdAt)}
          </span>
        </div>

        {/* View Profile Button */}
        <Link
          href={`/user/${user.slug}`}
          className="block w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center rounded-2xl hover:from-blue-700 hover:to-blue-800 transition shadow-lg font-semibold"
        >
          عرض صفحة المعلن
        </Link>
      </div>
    </div>
  );
}
