"use client";
import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/axiosInstance/axiosInstance";
import useAuth from "@/store/useAuth";

export default function useProfile() {
  const setLoggedIn = useAuth((state) => state.setLoggedIn);
  const user = useAuth((state) => state.user);
  const isAuth = useAuth((state) => state.isAuth);
  const setProfile = useAuth((state) => state.setProfile);
  return useQuery({
    queryKey: ["profile", isAuth],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get("/users/profile");
        setProfile(response.data.user);
        setLoggedIn();
        return response.data.user;
      } catch (e) {
        throw e;
      }
    },
    enabled: user === null || isAuth,
    retry: false,
  });
}
