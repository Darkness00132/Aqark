"use client";
import { useQuery } from "@tanstack/react-query";
import useAuth from "@/store/useAuth";
import axiosInstance from "@/axiosInstance/axiosInsatnce";

export default function useProfile() {
  const setLoggedIn = useAuth((state) => state.setLoggedIn);
  const setProfile = useAuth((state) => state.setProfile);
  const isAuth = useAuth((state) => state.isAuth);

  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/users/profile/me");
      setProfile(data.user);
      setLoggedIn();
      return data.user;
    },
    enabled: isAuth,
    retry: false,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
