"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/zodSchemas";

import { z } from "zod";
import useLogin from "@/hooks/useLogin";
import useAuth from "@/store/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function LoginForm() {
  const router = useRouter();
  const isAuth = useAuth((state) => state.isAuth);

  useEffect(() => {
    if (isAuth) {
      router.push("/");
    }
  }, [isAuth, router]);

  const { mutate, isPending } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
  });

  function onSubmit(data: z.infer<typeof loginSchema>) {
    mutate(data);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-2xl font-bold mb-2">مرحباً بك مرة أخرى!</h2>
      <p className="text-gray-600 mb-4">
        قم بتسجيل الدخول للوصول إلى حسابك واستمتع بتجربة رائعة.
      </p>

      <fieldset className="fieldset">
        <legend className="fieldset-legend">ايميل خاص بك</legend>
        <input
          type="email"
          className={`input ${errors.email && "input-error"}`}
          placeholder="example@gmail.com"
          {...register("email")}
        />
        {errors.email && <p className="text-error">{errors.email.message}</p>}
      </fieldset>
      <fieldset className="fieldset">
        <legend className="fieldset-legend">كلمة السر</legend>
        <input
          type="password"
          className={`input ${errors.password && "input-error"}`}
          placeholder="••••••••"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-error">{errors.password.message}</p>
        )}
      </fieldset>

      <button
        className={`btn btn-secondary btn-wide mt-4 ${
          isPending && "btn-disabled"
        }`}
        disabled={isPending}
      >
        {isPending ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
      </button>
    </form>
  );
}
