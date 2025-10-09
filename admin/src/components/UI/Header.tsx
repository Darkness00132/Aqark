"use client";
import Image from "next/image";
import Link from "next/link";
import { FaBell } from "react-icons/fa";
import useProfile from "@/hooks/user/useProfile";

export default function Header() {
  const { data: user } = useProfile();
  return (
    <div className="navbar bg-base-100 shadow-lg rounded-full mt-4 p-4 mx-auto w-[97%]">
      <div className="navbar-start">
        <Link href="/admin" className="flex items-center gap-2">
          <Image src="/favicon.ico" alt="Logo" width={36} height={36} />
          <span className="font-bold text-base sm:text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Aqark Admin
          </span>
        </Link>
      </div>

      <div className="navbar-end gap-2">
        <button className="btn btn-ghost btn-circle hover:bg-primary/10">
          <FaBell className="text-lg sm:text-xl" />
        </button>
        <div className="avatar">
          <div className="w-9 rounded-full ring ring-primary/10">
            <Image
              src={user?.avatar || "/avatar.webp"}
              alt="User"
              width={36}
              height={36}
              className="rounded-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
