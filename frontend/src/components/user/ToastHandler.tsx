"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export default function ToastHandler({
  status,
  message,
}: {
  status?: string;
  message?: string;
}) {
  useEffect(() => {
    if (status) {
      toast.error("فشل تسجيل الدخول");
    }
    if (status && message) {
      toast.error(message);
    }
  }, [status, message]);

  return null;
}
