"use client";
import axiosInstance from "@/axiosInstance/axiosInsatnce";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

interface User {
  email: string;
  password: string;
}

export default function useLogin() {
  const router = useRouter();

  return useMutation({
    mutationKey: ["login"],
    mutationFn: async ({ email, password }: User) => {
      const response = await axiosInstance.post("/users/login", {
        email,
        enteredPassword: password,
      });
      const user = response.data.user;

      if (!["admin", "superAdmin", "owner"].includes(user.role)) {
        throw new Error("You do not have admin access");
      }

      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data?.message || "Welcome back, Admin");
      router.push("/login?status=success");
    },
    onError: (error: AxiosError<{ message: string }>) => {
      toast.error(
        error?.response?.data?.message ||
          (error as Error).message ||
          "Login failed, please try again"
      );
    },
  });
}
