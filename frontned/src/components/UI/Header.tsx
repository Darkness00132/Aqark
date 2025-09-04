"use client";
import Link from "next/link";
import Image from "next/image";
import useAuth from "@/store/useAuth";
import useLogout from "@/hooks/useLogout";

export default function Header() {
  const { mutate, isPending } = useLogout();
  const isAuth = useAuth((state) => state.isAuth);
  const user = useAuth((state) => state.user);
  return (
    <header className="navbar bg-base-200 shadow-sm">
      <div className="flex-1">
        <Link href="/" className="btn btn-ghost text-xl">
          {/* <Image priority src="/bg.png" alt="logo" width={35} height={35} /> */}
          <h1 className="font-bold text-2xl">عقارك</h1>
        </Link>
      </div>
      <div className="flex gap-2">
        {isAuth ? (
          <button
            className={`btn btn-ghost ${isPending && "btn-disabled"}`}
            onClick={() => mutate()}
            disabled={isPending}
          >
            تسجيل خروج{" "}
          </button>
        ) : (
          <Link href="/login" className="btn btn-ghost">
            سجل دخول
          </Link>
        )}
        <input
          type="text"
          placeholder="ابحث عن عقارك"
          className="input input-bordered w-24 md:w-auto"
        />
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <Image
                alt="Avatar picture"
                src={user?.avatar || "/avatar.jpg"}
                className="rounded-full"
                priority
                width={35}
                height={35}
              />
            </div>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-200 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link href="/profile" className="justify-between">
                ملف الشخصى
              </Link>
            </li>
            <li>
              <Link href="/setting">الاعدادات</Link>
            </li>
            <li>
              <Link href="/logout">تسجيل خروج</Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
