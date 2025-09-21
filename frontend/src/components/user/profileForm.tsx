"use client";
import z from "zod";
import useAuth from "@/store/useAuth";
import AvatarUplaod from "./AvatarUpload";
import useUpdateProfile from "@/hooks/useUpdateProfile";
import { useEffect, useState } from "react";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileSchema } from "@/lib/userValidates";
import { FaEdit, FaTimes, FaSave } from "react-icons/fa";

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

  const [editProfile, setEditProfile] = useState(false);

  function onSubmit(data: UpdateProfileForm) {
    const payload: Partial<UpdateProfileForm> = {};

    if (data.name !== user?.name) {
      payload.name = data.name;
    }
    if (data.role !== user?.role) {
      payload.role = data.role;
    }
    if (data.password && data.newPassword) {
      payload.password = data.password;
      payload.newPassword = data.newPassword;
    }

    if (Object.keys(payload).length > 0) {
      mutate(payload);
    }

    setEditProfile(false);
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-center items-center w-full gap-4 mt-5"
      >
        <AvatarUplaod userAvatar={user?.avatar} />
        {/* Name */}
        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend text-lg">الاسم</legend>
          <input
            type="text"
            className="input input-bordered text-lg w-full"
            placeholder="اكتب هنا"
            disabled={!editProfile}
            {...register("name")}
          />
        </fieldset>
        {errors?.name && (
          <p className="text-error self-start">{errors.name.message}</p>
        )}

        {/* Role */}
        <fieldset className="fieldset w-full">
          <legend className="fieldset-legend text-lg">الدور</legend>
          <select
            className="select select-bordered w-full"
            disabled={!editProfile}
            {...register("role")}
          >
            <option value="user">تبحث عن عقار</option>
            <option value="landlord">تعرض العقارات</option>
          </select>
        </fieldset>
        {errors?.role && (
          <p className="text-error self-start">{errors.role.message}</p>
        )}

        {/* Divider */}
        <div className="divider"></div>
        <h2 className="text-start self-start">تغيير الباسور</h2>
        {/* Password Section (Optional) */}
        <fieldset className="fieldset w-full flex flex-col gap-3">
          <input
            type="password"
            className="input input-bordered w-full"
            placeholder="كلمة المرور الحالية"
            disabled={!editProfile}
            {...register("password")}
          />
          {errors?.password && (
            <p className="text-error">{errors.password.message}</p>
          )}

          <input
            type="password"
            className="input input-bordered w-full"
            placeholder="كلمة المرور الجديدة"
            disabled={!editProfile}
            {...register("newPassword")}
          />
          {errors?.newPassword && (
            <p className="text-error">{errors.newPassword.message}</p>
          )}
        </fieldset>

        {/* Action Buttons */}
        <div className="mt-10 flex gap-3">
          {!editProfile ? (
            <button
              type="button"
              className="btn btn-secondary flex items-center gap-2"
              onClick={() => setEditProfile(true)}
            >
              <FaEdit /> تعديل البيانات
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-error flex items-center gap-2"
              onClick={() => setEditProfile(false)}
            >
              <FaTimes /> تجاهل التغييرات
            </button>
          )}
          <button
            className={`btn btn-primary flex items-center gap-2 ${
              isPending && "btn-disabled"
            }`}
            disabled={isPending || !editProfile}
          >
            <FaSave /> حفظ التغييرات
          </button>
        </div>
      </form>
    </>
  );
}
