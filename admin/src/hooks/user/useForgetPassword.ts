"use client";
import axiosInstance from "@/axiosInstance/axiosInsatnce";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export default function useForgetPassword() {
  return useMutation({
    mutationKey: ["forget password"],
    mutationFn: async ({ email }: { email: string }) => {
      const response = await axiosInstance.post("/users/forgetPassword", {
        email,
      });
      return response.data?.message;
    },
    onSuccess: (message) => {
      toast.success(
        message || "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني"
      );
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error?.response?.data?.message || "حدث مشكلة ما يرجى محاولة مجددا"
      );
    },
  });
}
