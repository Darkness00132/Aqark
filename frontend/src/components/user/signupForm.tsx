"use client";
import Link from "next/link";
import useSignup from "@/hooks/useSignup";
import useAuth from "@/store/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/lib/zodSchemas";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SignupForm({ role }: { role: string }) {
  const router = useRouter();
  const isAuth = useAuth((state) => state.isAuth);

  useEffect(() => {
    if (isAuth) {
      router.push("/");
    }
  }, [isAuth, router]);

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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1">
      <h2 className="text-2xl font-bold mb-2">انشئ حساب جديد!</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-2">
        قم بإنشاء حسابك للوصول إلى جميع ميزات الموقع والاستمتاع بتجربة رائعة.
      </p>

      <fieldset className="fieldset w-full">
        <legend className="fieldset-legend">ما هو اسمك ؟</legend>
        <input
          type="text"
          className={`input ${errors.name && "input-error"} w-full`}
          placeholder="اكتب هنا"
          {...register("name")}
        />
        {errors.password && (
          <p className="text-error">{errors.name?.message}</p>
        )}
      </fieldset>

      <fieldset className="fieldset w-full">
        <legend className="fieldset-legend">ايميل خاص بك</legend>
        <input
          type="email"
          className={`input ${errors.email && "input-error"} w-full`}
          placeholder="example@gmail.com"
          {...register("email")}
        />
        {errors.email && <p className="text-error">{errors.email.message}</p>}
      </fieldset>

      <fieldset className="fieldset w-full">
        <legend className="fieldset-legend">انشاء كلمة سر قوية</legend>
        <input
          type="password"
          className={`input ${errors.password && "input-error"} w-full`}
          placeholder="••••••••"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-error">{errors.password.message}</p>
        )}
      </fieldset>

      <button
        className={`btn btn-primary btn-wide mt-4 ${
          isPending && "btn-disabled"
        } self-center`}
        disabled={isPending}
      >
        انشاء حساب
      </button>

      <div className="flex flex-col gap-2 mt-2 text-sm">
        <p>
          لديك حساب بالفعل؟{" "}
          <Link
            href="/login"
            className="text-blue-800 font-bold hover:underline ml-1"
          >
            سجل دخول هنا
          </Link>
        </p>
      </div>
    </form>
  );
}
