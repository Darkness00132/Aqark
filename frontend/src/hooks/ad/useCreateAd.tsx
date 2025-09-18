import axiosInstance from "@/axiosInstance/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/router";
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
        return undefined;
      }
      const formData = new FormData();
      images.forEach((img) => formData.append("images", img));
      const response = await axiosInstance.post("/upload/adImages", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const adPayload = { ...data, images: response.data.images };
      const response2 = await axiosInstance.post("/ads/create", adPayload);
      return response2.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "تم نشر الاعلان");
      router.push(`/ads/my-ads`);
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log(error?.response?.data?.message);
      toast.error(
        error?.response?.data?.message || "حدث مشكلة ما يرجى محاولة مجددا"
      );
    },
  });
}
