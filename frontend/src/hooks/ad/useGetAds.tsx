"use client";
import axiosInstance from "@/axiosInstance/axiosInstance";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import useAd, { Ad } from "@/store/useAd";

export default function useGetAds(mine: boolean, page: number) {
  const filters = useAd((state) => state.filters);

  // Serialize filters to avoid object reference issues
  const filterKey = JSON.stringify(filters);

  return useQuery({
    queryKey: ["ads", mine ? "mine" : "all", filterKey, page],
    queryFn: async (): Promise<{
      ads: Array<Ad>;
      totalPages: number;
      currentPage: number;
    }> => {
      const url = mine ? "/ads/me" : "/ads/all";

      const params = new URLSearchParams({ page: String(page) });

      // Only add non-empty filters
      for (const [k, v] of Object.entries(filters)) {
        if (v !== undefined && v !== "" && v !== null) {
          params.append(k, String(v));
        }
      }

      const response = await axiosInstance.get(`${url}?${params.toString()}`);
      return response.data;
    },

    staleTime: 5 * 60_000, // 5 minutes

    // CRITICAL: Use keepPreviousData instead of placeholderData
    placeholderData: keepPreviousData,

    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
