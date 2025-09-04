import axiosInstance from "@/axiosInstance/axiosInstance";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function useResetPassword() {
  const router = useRouter();
  return useMutation({
    mutationKey: ["reset password"],
    mutationFn: async (data: {
      password: string;
      resetPasswordToken: string;
    }) => {
      const response = await axiosInstance.post("/users/resetPassword", data);
      return response.data?.message;
    },
    onSuccess: (message) => {
      toast.success(message || "تم اعادة تعين الباسورد");
      router.push("/login");
    },
    onError: (error: AxiosError<{ message: string }>) =>
      toast.error(
        error?.response?.data?.message || "حدث خطا ما يرجى محاولة مجددا لاحقا"
      ),
  });
}
