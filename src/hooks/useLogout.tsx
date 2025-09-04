"use client";
import { useMutation } from "@tanstack/react-query";
import useAuth from "@/store/useAuth";
import axiosInstance from "@/axiosInstance/axiosInstance";

export default function useLogout() {
  const setLogout = useAuth((state) => state.setLogout);
  return useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      setLogout();
      await axiosInstance.delete("/users/logout");
    },
    onSuccess: () => {
      if (typeof window !== "undefined") window.location.href = "/login";
    },
    onError: (error) => console.log(error),
  });
}
