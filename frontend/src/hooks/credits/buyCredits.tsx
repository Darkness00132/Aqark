import axiosInstance from "@/axiosInstance/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export default function useBuyCredits() {
  return useMutation({
    mutationKey: ["buyCredits"],
    mutationFn: async (planId: number) => {
      const res = await axiosInstance.post("/credits/createPayment", {
        planId,
      });
      const paymentUrl = res.data.paymentUrl;
      window.location.href = paymentUrl;
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log(error?.response?.data);
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "حدث مشكلة ما يرجى محاولة مجددا"
      );
    },
  });
}
