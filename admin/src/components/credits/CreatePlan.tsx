"use client";

import z from "zod";
import { makeCreditsSchema } from "@/lib/creditsValidate";
import { zodResolver } from "@hookform/resolvers/zod";
import { FaCoins, FaGift, FaPlus, FaTag, FaPercent } from "react-icons/fa";
import { useForm } from "react-hook-form";
import useCreateCreditsPlan from "@/hooks/credits/useCreateCreditsPlan";

export default function CreatePlanForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof makeCreditsSchema>>({
    resolver: zodResolver(makeCreditsSchema),
  });

  const { mutate } = useCreateCreditsPlan();

  function onSubmit(plan: z.infer<typeof makeCreditsSchema>) {
    mutate(plan);
    reset();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-base-100 rounded-xl p-6 border border-base-300 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary p-3 rounded-full">
            <FaPlus className="text-lg" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Create New Plan</h2>
            <p className="text-sm opacity-70">
              Add a new credit package for users
            </p>
          </div>
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        {/* Credits */}
        <div>
          <label className="text-sm font-semibold mb-1 flex items-center gap-2">
            <FaCoins className="text-primary" />
            Credits
          </label>
          <input
            type="number"
            {...register("credits", { valueAsNumber: true })}
            className={`input input-bordered w-full ${
              errors.credits ? "input-error" : ""
            }`}
            placeholder="Enter credit amount"
          />
          {errors.credits && (
            <p className="text-error text-xs mt-1">{errors.credits.message}</p>
          )}
        </div>

        {/* Price */}
        <div>
          <label className="text-sm font-semibold mb-1 flex items-center gap-2">
            <FaTag className="text-secondary" />
            Price (EGP)
          </label>
          <input
            type="number"
            {...register("price", { valueAsNumber: true })}
            className={`input input-bordered w-full ${
              errors.price ? "input-error" : ""
            }`}
            placeholder="Enter price in EGP"
          />
          {errors.price && (
            <p className="text-error text-xs mt-1">{errors.price.message}</p>
          )}
        </div>

        {/* Bonus */}
        <div>
          <label className="text-sm font-semibold mb-1 flex items-center gap-2">
            <FaGift className="text-accent" />
            Bonus Credits
            <span className="text-xs text-gray-500 font-normal">
              (Optional)
            </span>
          </label>
          <input
            type="number"
            {...register("bonus", {
              setValueAs: (v) => (v === "" ? undefined : Number(v)),
            })}
            className={`input input-bordered w-full ${
              errors.bonus ? "input-error" : ""
            }`}
            placeholder="Enter bonus amount"
          />
          {errors.bonus && (
            <p className="text-error text-xs mt-1">{errors.bonus.message}</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary gap-2"
        >
          <FaPlus />
          {isSubmitting ? "Creating..." : "Create Plan"}
        </button>
      </div>
    </form>
  );
}
