import axiosInstance from "@/axiosInstance/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type EditAdVariables = {
  id: string;
  data: Record<string, string | number | undefined>;
  deletedImages: Array<{ url: string; key: string }>;
  images: File[];
};

export default function useEditAd() {
  const router = useRouter();
  return useMutation({
    mutationKey: ["edit-ad"],
    mutationFn: async ({
      id,
      data,
      deletedImages,
      images,
    }: EditAdVariables) => {
      const formData = new FormData();

      formData.append("deletedImages", JSON.stringify(deletedImages));

      if (images.length > 0) {
        images.forEach((file) => {
          formData.append("images", file);
        });
      }

      if (Object.keys(data).length > 0) {
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            formData.append(key, String(value));
          }
        });
      }

      for (const pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      await axiosInstance.put(`/ads/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: async () => {
      toast.success("تم تعديل الإعلان");
      router.push("/ads/my-ads");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error?.response?.data?.message || "حدث مشكلة ما يرجى محاولة مجددا"
      );
    },
  });
}
