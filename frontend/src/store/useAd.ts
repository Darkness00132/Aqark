import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type User = {
  publicId?: string;
  name: string;
  avatar?: string;
  avgRating?: number;
  totalReviews?: number;
};

export interface Ad {
  id: string;
  user: User;
  title: string;
  city: string;
  area: string;
  rooms: number;
  space: number;
  propertyType: string;
  type: string;
  address: string;
  description: string;
  price: number;
  slug: string;
  whatsappNumber: string;
  images: Array<{ url: string; key?: string }>;
}

export interface AdFilters {
  city?: string;
  area?: string;
  propertyType?: string;
  type?: "تمليك" | "إيجار" | undefined | "";
  rooms?: number;
  space?: number;
  minPrice?: number;
  maxPrice?: number;
  orderBy?: string;
}

interface AdState {
  filters: AdFilters;
  setFilters(filters: AdFilters): void;
}

const useAd = create(
  persist<AdState>(
    (set) => ({
      filters: {},
      setFilters: (filters) => {
        set({ filters });
      },
    }),
    {
      name: "ad-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAd;
