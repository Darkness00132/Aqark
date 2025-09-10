"use client";
import z from "zod";
import useAuth from "@/store/useAuth";
import AvatarUplaod from "./AvatarUpload";
import { useEffect, useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileSchema } from "@/lib/zodSchemas";
import useUpdateProfile from "@/hooks/useUpdateProfile";

type UpdateProfileForm = z.infer<typeof updateProfileSchema>;

export default function ProfileForm() {
  const { mutate, isPending } = useUpdateProfile();
  const user = useAuth((state) => state.user);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProfileForm>({
    resolver: zodResolver(
      updateProfileSchema
    ) as unknown as Resolver<UpdateProfileForm>,
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        role: user.role === "landlord" ? "landlord" : "user",
      });
    }
  }, [user, reset]);

  const [editInputs, setEditInputs] = useState({
    name: false,
    role: false,
    password: false,
  });

  function onSubmit(data: UpdateProfileForm) {
    mutate(data);
    setEditInputs({
      name: false,
      role: false,
      password: false,
    });
  }

  return (
    <>
      <AvatarUplaod userAvatar={user?.avatar} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-center items-center w-full gap-2 mt-5"
      >
        {/* Name */}
        <fieldset className="fieldset w-full flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <legend className="fieldset-legend text-lg">الاسم</legend>
          <input
            type="text"
            className="input text-lg flex-1"
            placeholder="اكتب هنا"
            disabled={!editInputs.name}
            {...register("name")}
          />
          <button
            className={`btn btn-primary sm:btn-sm`}
            onClick={() =>
              setEditInputs((prev) => ({
                ...prev,
                name: !prev.name,
              }))
            }
            type="button"
          >
            تعديل
          </button>
        </fieldset>
        {errors?.name && (
          <p className="text-error self-start">{errors.name.message}</p>
        )}

        {/* Role */}
        <fieldset className="fieldset w-full flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <legend className="fieldset-legend text-lg">الدور</legend>
          <select
            className="select w-full"
            disabled={!editInputs.role}
            {...register("role")}
          >
            <option value="user">تبحث عن عقار</option>
            <option value="landlord">تعرض العقارات</option>
          </select>
          <button
            className={`btn btn-primary sm:btn-sm`}
            onClick={() =>
              setEditInputs((prev) => ({
                ...prev,
                role: !prev.role,
              }))
            }
            type="button"
          >
            تعديل
          </button>
        </fieldset>
        {errors?.role && (
          <p className="text-error self-start">{errors.role.message}</p>
        )}
        {/* Password */}
        <fieldset className="fieldset w-full flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <legend className="fieldset-legend text-lg">
            {editInputs.password ? "كلمة المرور الحالية" : "نغيير كلمة المرور"}
          </legend>
          <input
            type="password"
            className="input flex-1"
            placeholder="••••••••"
            disabled={!editInputs.password}
            {...register("password")}
          />
          <button
            className={`btn btn-primary sm:btn-sm`}
            onClick={() =>
              setEditInputs((prev) => ({
                ...prev,
                password: !prev.password,
              }))
            }
            type="button"
          >
            تغيير
          </button>
        </fieldset>
        {errors?.password && (
          <p className="text-error self-start">{errors.password.message}</p>
        )}
        {editInputs.password && (
          <fieldset className="fieldset w-full self-start flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <legend className="fieldset-legend text-lg">
              كلمة المرور الجديدة
            </legend>
            <input
              type="password"
              className="input flex-1"
              placeholder="••••••••"
              {...register("newPassword")}
            />
          </fieldset>
        )}
        {errors?.newPassword && (
          <p className="text-error self-start">{errors.newPassword.message}</p>
        )}
        <button
          className={`mt-10 btn btn-primary ${
            ((!editInputs.name && !editInputs.role && !editInputs.password) ||
              isPending) &&
            "btn-disabled"
          }`}
          disabled={
            (!editInputs.name && !editInputs.role && !editInputs.password) ||
            isPending
          }
        >
          حفظ التغييرات
        </button>
      </form>
    </>
  );
}
