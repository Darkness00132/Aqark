"use client";
import axiosInstance from "@/axiosInstance/axiosInstance";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface User {
  name: string;
  email: string;
  password: string;
  role: string;
}

export default function useSignup() {
  const router = useRouter();
  return useMutation({
    mutationKey: ["signup"],
    mutationFn: async (data: User) => {
      const response = await axiosInstance.post("/users/signup", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(
        data?.message ||
          "تم إنشاء الحساب! تحقق من بريدك الإلكتروني لتفعيل الحساب"
      );
      router.push("/login");
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.message || "فشل انشاء الحساب يرجى حاولة مجددا"
      );
    },
  });
}
