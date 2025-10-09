import axiosInstance from "@/axiosInstance/axiosInstance";
import { Ad } from "@/store/useAd";
import { useQuery } from "@tanstack/react-query";

export default function useGetAdById(id: string) {
  return useQuery({
    queryKey: ["ads/me", id],
    queryFn: async () => {
      const response = await axiosInstance.get("/ads/me/" + id);
      const ad: Ad = response.data.ad;
      return ad;
    },
    enabled: !!id,
    staleTime: 10 * 60_000,
  });
}
