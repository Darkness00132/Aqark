import axiosInstance from "@/axiosInstance/axiosInstance";
import useAd, { type Ad } from "@/store/useAd";
import { useQuery } from "@tanstack/react-query";

export default function useGetAds(mine: boolean) {
  const filters = useAd((state) => state.filters);
  return useQuery({
    queryKey: ["ads", mine ? "mine" : "all", filters],
    queryFn: async (): Promise<Array<Ad>> => {
      let url = mine ? "/ads/me" : "/ads/all";

      if (Object.keys(filters).length > 0) {
        const params = new URLSearchParams(
          Object.entries(filters).reduce<Record<string, string>>(
            (acc, [k, v]) => {
              if (v !== undefined) acc[k] = String(v);
              return acc;
            },
            {}
          )
        ).toString();

        url += `?${params}`;
      }

      const response = await axiosInstance.get(url);
      return response.data.ads;
    },
  });
}
