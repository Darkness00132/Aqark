"use client";
import axiosInstance from "@/axiosInstance/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function useCreateAd() {
  const router = useRouter();
  return useMutation({
    mutationKey: ["create ad"],
    mutationFn: async ({
      images,
      data,
    }: {
      images: File[];
      data: Record<string, string | number>;
    }) => {
      if (images.length === 0) {
        toast.error("يجب رفع صورة واحدة على الاقل");
        throw new Error("يجب رفع صورة واحدة على الاقل");
      }

      const formData = new FormData();
      images.forEach((img) => formData.append("images", img));
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          formData.append(key, String(value));
        }
      });

      const response = await axiosInstance.post("/ads/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data;
    },
    onSuccess: () => {
      toast.success("تم نشر الاعلان");
      router.push(`/ads/my-ads`);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log(error?.response?.data?.message);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "حدث مشكلة ما يرجى محاولة مجددا"
      );
    },
  });
}
