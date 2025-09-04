"use client";
import { useMutation } from "@tanstack/react-query";
import useAuth from "@/store/useAuth";
import axiosInstance from "@/axiosInstance/axiosInstance";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

interface User {
  email: string;
  password: string;
}

export default function useLogin() {
  const router = useRouter();
  const setLoggedIn = useAuth((state) => state.setLoggedIn);

  return useMutation({
    mutationKey: ["login"],
    mutationFn: async ({ email, password }: User) => {
      const response = await axiosInstance.post("/users/login", {
        email,
        enteredPassword: password,
      });
      setLoggedIn();
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "تم تسجيل دخول مرحبًا بك");
      router.push("/");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error?.response?.data?.message || "فشل تسجيل الدخول يرجى محاولة مجددا "
      );
    },
  });
}
