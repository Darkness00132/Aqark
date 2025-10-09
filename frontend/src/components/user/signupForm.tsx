"use client";
import useSignup from "@/hooks/user/useSignup";
import { z } from "zod";
import { FaExclamationCircle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/lib/userValidates";

export default function SignupForm({ role }: { role: string }) {
  const { mutate, isPending } = useSignup();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
  });

  function onSubmit(data: z.infer<typeof signupSchema>) {
    mutate({ ...data, role });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name Field */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">الاسم الكامل</span>
        </label>
        <input
          type="text"
          placeholder="اكتب اسمك الكامل"
          className={`input input-bordered w-full rounded-lg mt-2 bg-base-100 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 ${
            errors.name && "input-error border-error"
          }`}
          {...register("name")}
        />
        {errors.name && (
          <label className="label mt-2">
            <span className="label-text-alt text-error flex items-center gap-1">
              <FaExclamationCircle />
              {errors.name.message}
            </span>
          </label>
        )}
      </div>

      {/* Email Field */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">البريد الإلكتروني</span>
        </label>
        <input
          type="email"
          placeholder="example@gmail.com"
          className={`input input-bordered w-full rounded-lg mt-2 bg-base-100 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 ${
            errors.email && "input-error border-error"
          }`}
          {...register("email")}
        />
        {errors.email && (
          <label className="label mt-2">
            <span className="label-text-alt text-error flex items-center gap-1">
              <FaExclamationCircle />
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
          className={`input input-bordered w-full rounded-lg mt-2 bg-base-100 border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 ${
            errors.password && "input-error border-error"
          }`}
          {...register("password")}
        />
        {errors.password && (
          <label className="label mt-2">
            <span className="label-text-alt text-error flex items-center gap-1">
              <FaExclamationCircle />
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
          {isPending ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
        </button>
      </div>
    </form>
  );
}
