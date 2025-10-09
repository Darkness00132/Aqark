"use client";
import { useEffect } from "react";
import useProfile from "@/hooks/user/useProfile";
import { toast } from "sonner";

export default function AuthInitializer({
  status,
  message,
}: {
  status?: string;
  message?: string;
}) {
  const { refetch } = useProfile();

  useEffect(() => {
    if (status === "success") {
      refetch();
      toast.success("تم تسجيل الدخول بنجاح");
    } else if (status === "failed") {
      toast.error("فشل تسجيل الدخول، يرجى المحاولة مجددًا");
    }

    if (message) {
      toast.error(message);
    }
  }, [status, message, refetch]);

  return null;
}
