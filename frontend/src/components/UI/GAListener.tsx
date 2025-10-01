"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { sendGAEvent } from "@next/third-parties/google";

export default function GAListener() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) {
      console.warn("GAListener: pathname is undefined.");
      return;
    }

    try {
      sendGAEvent("event", "page_view", { page_path: pathname });
      console.log(`GAListener: Pageview sent for ${pathname}`);
    } catch (error) {
      console.error("GAListener: Failed to send GA event", error);
    }
  }, [pathname]);

  return null;
}
