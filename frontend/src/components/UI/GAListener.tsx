"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function GAListener() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window.gtag !== "function") return;
    window.gtag("config", "G-XXXXXXXXXX", { page_path: pathname });
  }, [pathname]);

  return null;
}
