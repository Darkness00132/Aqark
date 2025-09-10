"use client";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import useAuth from "@/store/useAuth";
import axiosInstance from "@/axiosInstance/axiosInstance";

export default function useLogout() {
  const router = useRouter();
  const setLogout = useAuth((state) => state.setLogout);
  return useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      await axiosInstance.delete("/users/logout");
    },
    onSuccess: () => {
      setLogout();
      router.push("/login");
    },
  });
}
