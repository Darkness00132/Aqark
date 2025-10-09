"use client";
import useLogout from "@/hooks/user/useLogout";
import Link from "next/link";
import {
  FaBars,
  FaTachometerAlt,
  FaBuilding,
  FaUsers,
  FaMoneyBill,
  FaCoins,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

export default function Sidebar({
  open,
  setOpen,
  pathname,
}: {
  open: boolean;
  pathname: string;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const links = [
    { href: "/", label: "Dashboard", icon: <FaTachometerAlt /> },
    { href: "/ads", label: "Ads", icon: <FaBuilding /> },
    { href: "/users", label: "Users", icon: <FaUsers /> },
    { href: "/transactions", label: "Transactions", icon: <FaMoneyBill /> },
    { href: "/credits", label: "Credits", icon: <FaCoins /> },
    { href: "/statistics", label: "Analytics", icon: <FaChartBar /> },
    { href: "/settings", label: "Settings", icon: <FaCog /> },
  ];
  const { mutate, isPending } = useLogout();
  return (
    <aside
      className={`fixed top-0 left-0 h-screen bg-[#f8f9fa] border-r border-gray-200 flex flex-col z-40 transition-all duration-300 ease-in-out
        ${open ? "w-56 sm:w-64" : "w-20"}
      `}
    >
      {/* Toggle Button */}
      <div className="flex items-center justify-center p-3 border-b border-gray-200">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className={`btn btn-primary btn-circle p-1 transition-transform duration-300 hover:scale-110 ${
            open ? "rotate-180" : ""
          }`}
        >
          <FaBars className="text-lg text-white" />
        </button>
      </div>

      {/* Navigation */}
      <ul className="flex-1 flex flex-col gap-2 p-2">
        {links.map(({ href, label, icon }) => {
          const active = pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                data-tip={!open ? label : undefined}
                className={`group flex items-center gap-4 rounded-lg px-4 py-3 transition-all duration-200 w-full
                  ${
                    active
                      ? "bg-primary text-white font-semibold shadow-md"
                      : "hover:bg-primary/10 hover:text-primary text-neutral/80"
                  }
                  ${
                    !open
                      ? "justify-center tooltip tooltip-right w-auto px-0"
                      : "justify-start"
                  }
                `}
              >
                <span
                  className={`text-2xl transition-transform duration-300 group-hover:scale-110 ${
                    active ? "text-white" : "text-gray-600"
                  }`}
                >
                  {icon}
                </span>
                <span
                  className={`text-sm font-medium tracking-wide transition-all duration-200 ${
                    active ? "text-white" : "text-gray-700"
                  } ${
                    !open
                      ? "opacity-0 w-0 overflow-hidden"
                      : "opacity-100 w-auto"
                  }`}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          className={`btn btn-error flex items-center gap-3 rounded-lg transition-all w-full
            ${
              !open
                ? "justify-center tooltip tooltip-right w-auto px-0"
                : "justify-start"
            }
          `}
          onClick={() => mutate()}
          disabled={isPending}
          data-tip={!open ? "Logout" : undefined}
        >
          <FaSignOutAlt className="text-2xl text-white" />
          {open && (
            <span className="text-sm font-semibold text-white">Logout</span>
          )}
        </button>
      </div>
    </aside>
  );
}
