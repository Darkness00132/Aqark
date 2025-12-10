"use client";

import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AdEditSchema } from "@/validation/adValidates";
import { Ad } from "@/store/useAd";

import useEditAd from "@/hooks/ad/useEditAd";
import FormTitleSection from "./Fields/FormTitleSection";
import FormLocationSection from "./Fields/FormLocationSection";
import FormPropertyDetailsSection from "./Fields/FormPropertyDetailsSection";
import FormAdditionalDetailsSection from "./Fields/FormAdditionalDetailsSection";
import FormContactSection from "./Fields/FormContactSection";
import FormImagesSection from "./Fields/FormImagesSection";

const ROOM_BASED_PROPERTIES = ["شقة", "فيلا", "منزل"];

export default function AdEditForm({ ad }: { ad: Ad }) {
  const [images, setImages] = useState<File[]>([]);
  const [deletedImages, setDeletedImages] = useState<
    Array<{ url: string; key: string }>
  >([]);

  type EditForm = z.infer<typeof AdEditSchema>;

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors, dirtyFields },
  } = useForm<EditForm>({
    resolver: zodResolver(AdEditSchema),
    defaultValues: {
      ...ad,
      rooms: ad.rooms ?? undefined,
      space: ad.space ?? undefined,
    },
  });

  const selectedCity = watch("city");
  const selectedArea = watch("area");
  const selectedPropertyType = watch("propertyType");
  const showRoomsInput = ROOM_BASED_PROPERTIES.includes(
    selectedPropertyType || ""
  );

  const { mutate, isPending } = useEditAd();

  const onSubmit = (data: EditForm) => {
    const updatedAd: Record<string, string | number | undefined> = {};
    for (const key of Object.keys(dirtyFields)) {
      if (key in data) {
        const propertyKey = key as keyof typeof data;
        updatedAd[propertyKey] = data[propertyKey];
      }
    }
    mutate({ data: updatedAd, images, deletedImages, id: ad.id });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <FormTitleSection register={register} errors={errors} />

        <div className="divider"></div>

        <FormLocationSection
          control={control}
          selectedCity={selectedCity}
          selectedArea={selectedArea}
          errors={errors}
        />

        <div className="divider"></div>

        <FormPropertyDetailsSection
          register={register}
          errors={errors}
          showRoomsInput={showRoomsInput}
        />

        <div className="divider"></div>

        <FormAdditionalDetailsSection register={register} errors={errors} />

        <div className="divider"></div>

        <FormContactSection control={control} errors={errors} />

        <div className="divider"></div>

        <FormImagesSection
          images={images}
          setImages={setImages}
          defaultImages={ad.images}
          setDeletedImages={setDeletedImages}
        />

        {/* Submit Button */}
        <button
          type="submit"
          className="btn btn-primary btn-lg w-full"
          disabled={isPending}
        >
          {isPending ? (
            <span>
              <span className="loading loading-spinner"></span>
              جارٍ تعديل الإعلان...
            </span>
          ) : (
            <span>تعديل الإعلان</span>
          )}
        </button>
      </form>
    </div>
  );
}
