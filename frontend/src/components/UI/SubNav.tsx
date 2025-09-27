"use client";

import useAuth from "@/store/useAuth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHeart,
  FaBuilding,
  FaClipboardList,
  FaPlusCircle,
} from "react-icons/fa";

export default function SubNav() {
  const user = useAuth((state) => state.user);
  const pathname = usePathname();

  return (
    <nav className="bg-base-200 border-t overflow-x-scroll sm:overflow-x-hidden border-b border-base-300">
      <ul className="flex sm:justify-center gap-2 sm:gap-6 px-4 py-2">
        {/* عقارات */}
        <li>
          <Link
            href="/ads"
            className={`btn btn-sm sm:btn-md rounded-full gap-2 px-3 transition-colors ${
              pathname === "/ads"
                ? "btn-primary text-white"
                : "btn-ghost hover:bg-base-300"
            }`}
          >
            <FaBuilding className="text-blue-500 text-base sm:text-lg" />
            <span className="whitespace-nowrap">اعلانات العقارات</span>
          </Link>
        </li>

        {/* المالك فقط */}
        {user?.role === "landlord" && (
          <>
            <li>
              <Link
                href="/ads/create"
                className={`btn btn-sm sm:btn-md rounded-full gap-2 px-3 sm:px-5 transition-colors ${
                  pathname === "/ads/create"
                    ? "btn-primary text-white"
                    : "btn-ghost hover:bg-base-300"
                }`}
              >
                <FaPlusCircle className="text-green-500 text-base sm:text-lg" />
                <span className="whitespace-nowrap">انشاء اعلان</span>
              </Link>
            </li>

            <li>
              <Link
                href="/ads/my-ads"
                className={`btn btn-sm sm:btn-md rounded-full gap-2 px-3 sm:px-5 transition-colors ${
                  pathname === "/ads/my-ads"
                    ? "btn-primary text-white"
                    : "btn-ghost hover:bg-base-300"
                }`}
              >
                <FaClipboardList className="text-amber-500 text-base sm:text-lg" />
                <span className="whitespace-nowrap">اعلاناتى</span>
              </Link>
            </li>
          </>
        )}

        {/* المفضلة */}
        <li>
          <Link
            href="/favorites"
            className={`btn btn-sm sm:btn-md rounded-full gap-2 px-3 sm:px-5 transition-colors ${
              pathname === "/favorites"
                ? "btn-primary text-white"
                : "btn-ghost hover:bg-base-300"
            }`}
          >
            <FaHeart className="text-red-500 text-base sm:text-lg" />
            <span className="whitespace-nowrap">مفضل</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
