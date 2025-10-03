import axiosInstance from "@/axiosInstance/axiosInstance";
import Image from "next/image";
import type { Ad } from "@/store/useAd";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  FaBed,
  FaRulerCombined,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaStar,
  FaClock,
  FaPhone,
} from "react-icons/fa";
import Link from "next/link";
import AdImagesSwiper from "@/components/ad/AdImagesSwiper";
import formatDateFromNow from "@/lib/formatDateFromNow";

type CachedAd = {
  data: Ad;
  expire: number;
};

const adCache = new Map<string, CachedAd>();
const CACHE_DURATION = 5 * 60 * 1000;

async function getAd(slug: string): Promise<Ad | null> {
  const now = Date.now();

  if (adCache.has(slug)) {
    const cached = adCache.get(slug)!;
    if (cached.expire > now) {
      return cached.data;
    }
    adCache.delete(slug);
  }

  try {
    const { data } = await axiosInstance.get(`/ads/${slug}`);
    const ad: Ad = data.ad;
    adCache.set(slug, { data: ad, expire: now + CACHE_DURATION });
    return ad;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const param = await params;
  const ad = await getAd(param.slug);

  if (!ad) {
    return {
      title: "العقار غير موجود",
      description: "لم يتم العثور على العقار المطلوب.",
    };
  }

  return {
    title: ad.title,
    description: ad.address,
    openGraph: {
      title: ad.title,
      description: ad.address,
      type: "website",
      url: `https://aqark.vercel.app/ads/${ad.slug}`,
      images: ad.images.map((img) => ({
        url: img.url,
        width: 800,
        height: 600,
        alt: ad.title,
      })),
    },
    twitter: {
      card: "summary_large_image",
      title: ad.title,
      description: ad.address,
      images: ad.images,
    },
  };
}

export default async function AdSlug({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const ad = await getAd(slug);

  if (!ad) {
    notFound();
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="rounded-3xl overflow-hidden shadow-2xl mb-8 relative group">
          <AdImagesSwiper images={ad.images} alt={ad.title} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-gray-200/50">
              <div className="flex flex-wrap gap-2 mb-4">
                {ad.type && (
                  <span className="px-4 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-xs font-semibold shadow-md">
                    {ad.type}
                  </span>
                )}
                {ad.propertyType && (
                  <span className="px-4 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full text-xs font-semibold shadow-md">
                    {ad.propertyType}
                  </span>
                )}
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                {ad.title}
              </h1>

              <div className="flex items-center text-gray-600 mb-6 gap-2">
                <div className="p-2 bg-red-50 rounded-lg">
                  <FaMapMarkerAlt className="text-red-500 w-4 h-4" />
                </div>
                <span className="font-medium text-base">
                  {ad.city} - {ad.area}
                </span>
              </div>

              <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-2xl p-6 mb-6 shadow-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                <div className="relative z-10">
                  <p className="text-white/90 text-sm font-medium mb-1">
                    السعر
                  </p>
                  <p className="text-4xl lg:text-5xl font-bold text-white">
                    {ad.price.toLocaleString()}
                    <span className="text-xl font-medium mr-2">جنيه</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {ad.rooms && (
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200/50 hover:shadow-md transition">
                    <div className="p-3 bg-blue-500 rounded-xl">
                      <FaBed className="text-white w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">الغرف</p>
                      <p className="text-lg font-bold text-gray-900">
                        {ad.rooms}
                      </p>
                    </div>
                  </div>
                )}
                {ad.space && (
                  <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl border border-yellow-200/50 hover:shadow-md transition">
                    <div className="p-3 bg-yellow-400 rounded-xl">
                      <FaRulerCombined className="text-white w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">
                        المساحة
                      </p>
                      <p className="text-lg font-bold text-gray-900">
                        {ad.space} م²
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <p className="text-gray-600 leading-relaxed mb-6 text-base">
                {ad.address}
              </p>

              {/* أزرار التواصل */}
              {ad.whatsappNumber && (
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={`https://wa.me/${ad.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl hover:from-green-600 hover:to-green-700 transition shadow-lg hover:shadow-xl font-semibold"
                  >
                    <FaWhatsapp className="w-6 h-6" />
                    تواصل عبر واتساب
                  </a>
                  <button className="sm:w-auto px-6 py-4 bg-white border-2 border-gray-300 text-gray-700 rounded-2xl hover:border-gray-400 hover:bg-gray-50 transition font-semibold flex items-center justify-center gap-2">
                    <FaPhone className="w-5 h-5" />
                    اتصل الآن
                  </button>
                </div>
              )}
            </div>

            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-lg border border-gray-200/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                <h3 className="text-2xl font-bold text-gray-900">وصف العقار</h3>
              </div>
              <p className="text-gray-700 leading-relaxed text-base whitespace-pre-line">
                {ad.description}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-200/50 sticky top-6">
              <div className="text-center mb-6">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full animate-pulse"></div>
                  <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
                    <Image
                      src={ad.user.avatar || "/avatar.webp"}
                      alt={ad.user.name}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-1">
                  {ad.user.name}
                </h4>
                <p className="text-sm text-gray-500 font-medium">المعلن</p>
              </div>

              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-2xl p-4 mb-4">
                <div className="flex items-center justify-center gap-2">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(ad.user.avgRating || 0)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {ad.user.avgRating?.toFixed(1) || "0.0"}
                  </span>
                </div>
                <p className="text-xs text-gray-600 text-center mt-1">
                  ({ad.user.totalReviews || 0} تقييم)
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-6 bg-gray-50 rounded-xl p-3">
                <FaClock className="text-gray-400" size={16} />
                <span className="font-medium">
                  نُشر {formatDateFromNow(ad.createdAt)}
                </span>
              </div>

              <Link
                href={`/user/${ad.user.slug}`}
                className="block w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center rounded-2xl hover:from-blue-700 hover:to-blue-800 transition shadow-lg hover:shadow-xl font-semibold"
              >
                عرض صفحة المعلن
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
