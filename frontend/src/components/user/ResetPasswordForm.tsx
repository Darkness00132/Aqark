"use client";
import useResetPassword from "@/hooks/useResetPassword";
import { z } from "zod";
import { resetPasswordSchema } from "@/lib/zodSchemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export default function ResetPasswordForm({
  resetPasswordToken,
}: {
  resetPasswordToken: string | undefined;
}) {
  const { mutate, isPending } = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
  });

  function onSubmit(data: z.infer<typeof resetPasswordSchema>) {
    mutate(data);
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
      <input
        type="password"
        placeholder="كلمة المرور الجديدة"
        className={`input ${errors.password && "input-error"}`}
        {...register("password")}
      />
      {errors.password && (
        <p className="text-error">{errors.password.message}</p>
      )}
      <input
        type="hidden"
        value={resetPasswordToken}
        {...register("resetPasswordToken")}
      />
      <button
        type="submit"
        className={`btn btn-secondary ${isPending && "btn-disabled"}`}
        disabled={isPending}
      >
        إعادة تعيين
      </button>
    </form>
  );
}
