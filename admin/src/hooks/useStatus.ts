"use client";
import axiosInstance from "@/axiosInstance/axiosInsatnce";
import { useQuery } from "@tanstack/react-query";

export default function useStatus() {
  return useQuery({
    queryKey: ["status"],
    queryFn: async () => {
      const response = await axiosInstance.get("/status");
      return response.data;
    },
  });
}
