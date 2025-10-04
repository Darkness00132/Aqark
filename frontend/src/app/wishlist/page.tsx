import AdCard from "@/components/ad/AdCard";
import { Ad } from "@/store/useAd";
import { Metadata } from "next";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "",
  description: "",
};

export default async function WishlistPage() {
  try {
    const cookieStore = await cookies();
    const jwt = cookieStore.get("jwt-auth")?.value;

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/ads/wishlist`,
      {
        headers: {
          Cookie: `jwt-auth=${jwt}`,
        },
        cache: "no-store",
      }
    );

    const { wishlist } = await res.json();
    console.log(wishlist);

    if (!wishlist || wishlist.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
          <p className="text-gray-500 text-lg font-medium">
            قائمة المفضلة فارغة.
          </p>
          <p className="text-gray-400 text-sm">أضف بعض العقارات لتظهر هنا ❤️</p>
        </div>
      );
    }

    return (
      <div className="flex-1">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlist.map((ad: Ad) => (
            <AdCard key={ad.slug} ad={ad} />
          ))}
        </div>
      </div>
    );
  } catch (error) {
    console.error("❌ Wishlist fetch error:", error);
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-red-500 font-semibold">
          حدث خطأ أثناء تحميل المفضلة 😢
        </p>
      </div>
    );
  }
}
