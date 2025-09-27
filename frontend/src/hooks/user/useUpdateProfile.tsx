"use client";
import axiosInstance from "@/axiosInstance/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";
import useProfile from "./useProfile";

export default function useUpdateProfile() {
  const { refetch } = useProfile();
  return useMutation({
    mutationKey: ["update profile"],
    mutationFn: async (data: {
      name?: string;
      role?: string;
      password?: string;
      newPassword?: string;
    }) => {
      const response = await axiosInstance.put("/users/profile", data);
      return response.data;
    },
    onSuccess: (data) => {
      refetch();
      toast.success(data?.message || "تم تحديث ملفك الشخصى بنجاح");
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(
        err?.response?.data?.message || "فشل تحديث بياناتك يرجى محاولة مجددا"
      );
    },
  });
}
