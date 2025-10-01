"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function GAListener() {
  const pathname = usePathname();
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  useEffect(() => {
    if (!gaId || typeof window.gtag !== "function") return;
    window.gtag("config", gaId, { page_path: pathname });
  }, [pathname, gaId]);

  return null;
}
