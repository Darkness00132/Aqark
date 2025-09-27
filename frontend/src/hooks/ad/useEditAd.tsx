import axiosInstance from "@/axiosInstance/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

type EditAdVariables = {
  id: string;
  data: Record<string, string | number | undefined>;
  deletedImages: Array<{ url: string; key: string }>;
  images: File[];
};

export default function useEditAd() {
  return useMutation({
    mutationKey: ["edit-ad"],
    mutationFn: async ({
      id,
      data,
      deletedImages,
      images,
    }: EditAdVariables) => {
      if (deletedImages.length > 0 || images.length > 0) {
        console.log("1");
        const formData = new FormData();
        formData.append("deletedImages", JSON.stringify(deletedImages));

        images.forEach((file) => {
          formData.append("images", file);
        });

        await axiosInstance.put(`/upload/adImages/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (Object.keys(data).length > 0) {
        console.log("2");
        await axiosInstance.put("/ads/" + id, data);
      }
    },
    onSuccess: async () => {
      toast.success("تم تعديل الإعلان");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log("Edit Ad Error:  ", error?.response?.data?.message);
      toast.error(
        error?.response?.data?.message || "حدث مشكلة ما يرجى محاولة مجددا"
      );
    },
  });
}
