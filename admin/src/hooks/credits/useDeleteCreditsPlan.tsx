import axiosInstance from "@/axiosInstance/axiosInsatnce";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export default function useDeleteCreditsPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["credits", "delete"],
    mutationFn: async (id: string) => {
      await axiosInstance.delete("/credits/deletePlan/" + id);
    },
    onSuccess: () => {
      toast.warning("plan delete");
      queryClient.invalidateQueries({ queryKey: ["credits"] });
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log(error?.response?.data?.message);
      toast.error(error?.response?.data?.message || "delete failed");
    },
  });
}
