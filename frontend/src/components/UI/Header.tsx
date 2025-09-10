"use client";
import Link from "next/link";
import Image from "next/image";
import useAuth from "@/store/useAuth";
import useLogout from "@/hooks/useLogout";
import { FaSearch, FaUser, FaSignOutAlt, FaHome } from "react-icons/fa";

export default function Header() {
  const { mutate, isPending } = useLogout();
  const isAuth = useAuth((state) => state.isAuth);
  const user = useAuth((state) => state.user);

  return (
    <div className="navbar bg-base-100/90 shadow-lg sticky top-0 z-50">
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost text-xl hover:opacity-80">
          <Image
            priority
            src="/favicon.ico"
            alt="logo"
            width={50}
            height={50}
            className="w-8 h-8 sm:w-10 sm:h-10"
          />
          <span className="font-extrabold text-xl sm:text-2xl lg:text-3xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Aqark
          </span>
        </Link>
      </div>

      <div className="navbar-center hidden sm:flex w-1/3">
        <div className="join w-full">
          <input
            type="text"
            placeholder="ابحث عن عقار، منطقة، سعر..."
            className="input join-item w-full"
          />
          <button className="btn join-item rounded-l-lg">
            <FaSearch className="text-sm" />
          </button>
        </div>
      </div>

      <div className="navbar-end">
        {!isAuth ? (
          <div className="flex gap-1 sm:gap-2">
            <Link
              href="/login"
              className="btn btn-ghost btn-xs sm:btn-md hover:bg-primary/10 hover:text-primary transition-all duration-300 text-xs sm:text-sm"
            >
              تسجيل الدخول
            </Link>
            <Link
              href="/signup"
              className="btn btn-primary btn-xs sm:btn-md hover:btn-primary/90 transition-all duration-300 text-xs sm:text-sm"
            >
              إنشاء حساب
            </Link>
          </div>
        ) : (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar hover:bg-primary/10 transition-all duration-300"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all duration-300">
                <Image
                  alt="Avatar"
                  src={user?.avatar || "/avatar.jpg"}
                  width={32}
                  height={32}
                  className="rounded-full w-full h-full object-cover sm:w-10 sm:h-10"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-2xl z-[9999] mt-3 w-56 p-2 shadow-2xl border border-base-300"
            >
              <li>
                <Link
                  href="/profile"
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-300"
                >
                  <FaUser className="text-lg" />
                  ملفي الشخصي
                </Link>
              </li>

              <li>
                <button
                  className={`flex items-center gap-3 p-3 rounded-xl hover:bg-error/10 hover:text-error transition-all duration-300 w-full text-right ${
                    isPending && "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={() => mutate()}
                  disabled={isPending}
                >
                  <FaSignOutAlt className="text-lg" />
                  {isPending ? "جاري تسجيل الخروج..." : "تسجيل الخروج"}
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
