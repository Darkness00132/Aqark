"use client";
import axiosInstance from "@/axiosInstance/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

interface User {
  email: string;
  password: string;
}

export default function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationKey: ["login"],
    mutationFn: async ({ email, password }: User) => {
      const response = await axiosInstance.post("/users/login", {
        email,
        enteredPassword: password,
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "تم تسجيل دخول مرحبًا بك");
      router.push("/?login=success");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error?.response?.data?.message || "فشل تسجيل الدخول يرجى محاولة مجددا "
      );
    },
  });
}
