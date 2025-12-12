"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/validation/userValidates";
import { AlertCircle } from "lucide-react";
import useLogin from "@/hooks/user/useLogin";

export default function LoginForm() {
  const { mutate, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  function onSubmit(data: z.infer<typeof loginSchema>) {
    mutate(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Email Field */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">البريد الإلكتروني</span>
        </label>
        <input
          type="email"
          placeholder="example@gmail.com"
          className={`input input-bordered mt-2 w-full rounded-lg bg-base-100 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 ${
            errors.email && "input-error border-error"
          }`}
          {...register("email")}
        />
        {errors.email && (
          <label className="label mt-2">
            <span className="label-text-alt text-error flex items-center gap-1">
              <AlertCircle />
              {errors.email.message}
            </span>
          </label>
        )}
      </div>

      {/* Password Field */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">كلمة المرور</span>
        </label>
        <input
          type="password"
          placeholder="••••••••"
          className={`input mt-2 input-bordered w-full rounded-lg bg-base-100 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 ${
            errors.password && "input-error border-error"
          }`}
          {...register("password")}
        />
        {errors.password && (
          <label className="label mt-2">
            <span className="label-text-alt text-error flex items-center gap-1">
              <AlertCircle />
              {errors.password.message}
            </span>
          </label>
        )}
      </div>

      {/* Submit Button */}
      <div className="form-control mt-6">
        <button
          className={`btn btn-primary btn-lg w-full rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 ${
            isPending && "loading"
          }`}
          disabled={isPending}
        >
          {isPending ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
        </button>
      </div>
    </form>
  );
}
