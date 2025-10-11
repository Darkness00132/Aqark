"use client";
import axiosInstance from "@/axiosInstance/axiosInsatnce";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export default function useCreateCreditsPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["credits", "create"],
    mutationFn: async (plan: {
      credits: number;
      price: number;
      discount?: number;
      bonus?: number;
    }) => {
      axiosInstance.post("/credits/createPlan", plan);
    },
    onSuccess: () => {
      toast.success("plan created");
      queryClient.invalidateQueries({ queryKey: ["credits"] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log(error?.response?.data?.message);
      toast.error(error?.response?.data?.message);
    },
  });
}
