"use client";
import Link from "next/link";
import Image from "next/image";
import useAuth from "@/store/useAuth";
import useLogout from "@/hooks/user/useLogout";
import {
  FaSearch,
  FaUser,
  FaSignOutAlt,
  FaCoins,
  FaBuilding,
  FaClipboardList,
  FaPlusCircle,
} from "react-icons/fa";
import useProfile from "@/hooks/user/useProfile";

export default function Header() {
  const { mutate, isPending } = useLogout();
  const { data:user } = useProfile();
  const isAuth = useAuth((state) => state.isAuth);

  return (
    <header className="mb-3 sticky top-0 z-50 bg-base-100 shadow-md">
      <nav className="navbar bg-base-100">
        {/* LEFT SECTION - LOGO */}
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

        {/* CENTER SECTION - SEARCH */}
        <div className="navbar-center hidden sm:flex mx-auto w-[20rem]">
          <div className="join w-full max-w-md">
            <input
              type="text"
              placeholder="ابحث عن عقار، منطقة، سعر..."
              className="input input-bordered join-item w-full"
            />
            <button className="btn btn-primary join-item">
              <FaSearch className="text-sm" aria-label="search button" />
            </button>
          </div>
        </div>

        {/* RIGHT SECTION - LINKS / USER MENU */}
        <div className="navbar-end gap-2">
          {!isAuth ? (
            <div className="flex gap-1 sm:gap-2">
              <Link
                href="/user/login"
                className="btn btn-ghost btn-xs sm:btn-sm hover:bg-primary/10 hover:text-primary transition-all duration-300"
              >
                تسجيل الدخول
              </Link>
              <Link
                href="/user/signup"
                className="btn btn-primary btn-xs sm:btn-sm hover:btn-primary/90 transition-all duration-300"
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
                    src={user?.avatar || "/avatar.webp"}
                    width={32}
                    height={32}
                    className="rounded-full w-full h-full object-cover object-center"
                  />
                </div>
              </div>

              {/* DROPDOWN MENU */}
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-2xl z-[9999] mt-3 w-56 p-2 shadow-2xl border border-base-300"
              >
                {/* USER INFO */}
                <li>
                  <span className="flex items-center gap-3 p-2 rounded-xl">
                    <FaCoins className="text-base text-amber-500" />
                    <span className="text-sm">
                      العملات: <strong>{user?.credits}</strong>
                    </span>
                  </span>
                </li>

                <div className="divider my-1"></div>

                {/* NAVIGATION SECTION */}
                <li>
                  <div className="px-3 py-2 text-xs text-base-content/60">
                    التنقل
                  </div>
                </li>
                <li>
                  <Link
                    href="/ads"
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-300"
                  >
                    <FaBuilding className="text-base text-blue-500" />
                    <span className="text-sm">اعلانات العقارات</span>
                  </Link>
                </li>

                {user?.role === "landlord" && (
                  <>
                    <li>
                      <Link
                        href="/ads/create"
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-300"
                      >
                        <FaPlusCircle className="text-base text-green-500" />
                        <span className="text-sm">إنشاء إعلان جديد</span>
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/ads/my-ads"
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-300"
                      >
                        <FaClipboardList className="text-base text-amber-500" />
                        <span className="text-sm">إعلاناتي</span>
                      </Link>
                    </li>
                  </>
                )}

                <div className="divider my-1"></div>

                {/* ACCOUNT SECTION - LAST */}
                <li>
                  <div className="px-3 py-2 text-xs text-base-content/60">
                    الحساب
                  </div>
                </li>
                <li>
                  <Link
                    href="/user/profile"
                    className="flex items-center gap-3 p-2 rounded-xl hover:bg-primary/10 hover:text-primary transition-all duration-300"
                  >
                    <FaUser className="text-base" />
                    <span className="text-sm">الملف الشخصي</span>
                  </Link>
                </li>

                <li>
                  <button
                    className={`flex items-center gap-3 p-2 rounded-xl hover:bg-error/10 hover:text-error transition-all duration-300 w-full text-right ${
                      isPending && "opacity-50 cursor-not-allowed"
                    }`}
                    onClick={() => mutate()}
                    disabled={isPending}
                  >
                    <FaSignOutAlt className="text-base" />
                    <span className="text-sm">
                      {isPending ? "جاري تسجيل الخروج..." : "تسجيل الخروج"}
                    </span>
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
