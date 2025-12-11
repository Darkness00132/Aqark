"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdfiltersSchema } from "@/validation/adValidates";
import type { z } from "zod";
import useAd from "@/store/useAd";
import FilterButton from "./FilterButton";
import FilterDrawerHeader from "./FilterDrawerHeader";
import LocationFilter from "./LocationFilter";
import PropertyDetailsFilter from "./PropertyDetailsFilter";
import PriceFilter from "./PriceFilter";
import SortFilter from "./SortFilter";
import FilterDrawerFooter from "./FilterDrawerFooter";

type AdFiltersForm = z.infer<typeof AdfiltersSchema>;

export default function AdFilters() {
  const setFilters = useAd((state) => state.setFilters);
  const filters = useAd((state) => state.filters);
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<AdFiltersForm>({
    resolver: zodResolver(
      AdfiltersSchema.transform((data) =>
        Object.fromEntries(
          Object.entries(data).map(([k, v]) => [k, v === "" ? undefined : v])
        )
      )
    ),
    defaultValues: filters,
  });

  const selectedCity = watch("city");

  const customSelectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      borderRadius: "0.5rem",
      borderColor: state.isFocused ? "#10b981" : "#e2e8f0",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(16, 185, 129, 0.1)" : "none",
      "&:hover": {
        borderColor: "#10b981",
      },
      minHeight: "2.75rem",
      padding: "0 0.25rem",
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#10b981"
        : state.isFocused
        ? "#f0fdf4"
        : "white",
      color: state.isSelected ? "white" : "#334155",
      "&:active": {
        backgroundColor: "#10b981",
      },
    }),
    placeholder: (base: any) => ({
      ...base,
      color: "#94a3b8",
    }),
  };

  const onSubmit = (data: AdFiltersForm) => {
    setFilters(data);
    const drawerCheckbox = document.getElementById(
      "filter-drawer"
    ) as HTMLInputElement;
    if (drawerCheckbox) drawerCheckbox.checked = false;
  };

  return (
    <>
      <FilterButton />

      {/* Drawer structure */}
      <div className="drawer drawer-end fixed inset-0 pointer-events-none z-[9999]">
        <input id="filter-drawer" type="checkbox" className="drawer-toggle" />

        {/* Overlay */}
        <div className="drawer-side pointer-events-auto">
          <label htmlFor="filter-drawer" className="drawer-overlay"></label>

          {/* Drawer content */}
          <div className="w-96 h-full bg-gradient-to-b from-base-100 to-base-200 flex flex-col shadow-2xl">
            <FilterDrawerHeader />

            {/* Form Content */}
            <form
              className="flex-1 overflow-y-auto p-6 space-y-5"
              onSubmit={handleSubmit(onSubmit)}
            >
              <LocationFilter
                control={control}
                errors={errors}
                selectedCity={selectedCity}
                customSelectStyles={customSelectStyles}
              />

              <PropertyDetailsFilter register={register} errors={errors} />

              <PriceFilter register={register} errors={errors} />

              <SortFilter register={register} />
            </form>

            <FilterDrawerFooter
              reset={reset}
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
            />
          </div>
        </div>
      </div>
    </>
  );
}
