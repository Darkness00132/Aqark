import axiosInstance from "@/axiosInstance/axiosInstance";
import { type Ad } from "@/store/useAd";
import { useQuery } from "@tanstack/react-query";

export default function useGetAds(mine: boolean) {
  return useQuery({
    queryKey: ["ads", mine ? "mine" : "all"],
    queryFn: async (): Promise<Array<Ad>> => {
      let url = "/ads/all";
      if (mine) url = "/ads/me";
      const response = await axiosInstance.get(url);
      return response.data.ads;
    },
  });
}
