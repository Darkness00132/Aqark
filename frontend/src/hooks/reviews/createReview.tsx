import axiosInstance from "@/axiosInstance/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export default function useCreateReview() {
  return useMutation({
    mutationFn: async ({
      slug,
      rating,
      comment,
    }: {
      slug: string;
      rating: number;
      comment?: string;
    }) => {
      if (rating === 0) {
        throw new Error("الرجاء اختيار تقييم النجوم");
      }
      const response = await axiosInstance.post(`/reviews/${slug}`, {
        rating,
        comment,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("تم إنشاء المراجعة بنجاح");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      const message =
        error?.response?.data?.message ||
        error.message ||
        "حدث خطأ أثناء إنشاء المراجعة";
      toast.error(message);
    },
  });
}
