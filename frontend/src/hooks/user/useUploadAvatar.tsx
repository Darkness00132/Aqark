"use client";
import axiosInstance from "@/axiosInstance/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import useProfile from "./useProfile";
import { toast } from "sonner";
import { AxiosError } from "axios";

export default function useUploadAvatar() {
  const { refetch } = useProfile();
  return useMutation({
    mutationKey: ["update avatar"],
    mutationFn: async (formData: FormData) => {
      const response = await axiosInstance.put("/users/profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: async (data) => {
      toast.success(data?.message || "تم تغيرر الصورة");
      refetch();
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(
        err?.response?.data?.message || "فشل تحديث بياناتك يرجى محاولة مجددا"
      );
    },
  });
}
