"use client";
import axiosInstance from "@/axiosInstance/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import useAuth from "@/store/useAuth";

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
      return response.data;
    },
    onSuccess: (data) => {
      setLoggedIn();
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
