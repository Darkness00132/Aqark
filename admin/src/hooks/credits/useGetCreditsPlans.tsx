"use client";
import axiosInstance from "@/axiosInstance/axiosInsatnce";
import { useQuery } from "@tanstack/react-query";

export default function useGetCreditsPlans() {
  return useQuery({
    queryKey: ["credits", "getPlans"],
    queryFn: async () => {
      const response = await axiosInstance.get("/credits/plans");
      return response.data.plans;
    },
  });
}
