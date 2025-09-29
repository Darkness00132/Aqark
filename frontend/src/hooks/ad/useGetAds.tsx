"use client";
import axiosInstance from "@/axiosInstance/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import useAd, { Ad } from "@/store/useAd";

export default function useGetAds(mine: boolean, page: number) {
  const filters = useAd((state) => state.filters);
  return useQuery({
    queryKey: ["ads", mine ? "mine" : "all", filters, page],
    queryFn: async (): Promise<{
      ads: Array<Ad>;
      totalPages: number;
      currentPage: number;
    }> => {
      let url = mine ? "/ads/me" : "/ads/all";

      const paramsObj: Record<string, string> = { page: String(page) };

      for (const [k, v] of Object.entries(filters)) {
        if (v !== undefined) paramsObj[k] = String(v);
      }

      const params = new URLSearchParams(paramsObj).toString();
      url += `?${params}`;

      const response = await axiosInstance.get(url);
      return response.data;
    },
  });
}
