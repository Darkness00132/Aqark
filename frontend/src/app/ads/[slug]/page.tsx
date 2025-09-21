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
  FaUser,
  FaStar,
} from "react-icons/fa";
import Link from "next/link";

const adCache = new Map<string, Ad>();
async function getAd(slug: string): Promise<Ad | null> {
  if (adCache.has(slug)) {
    return adCache.get(slug)!;
  }
  try {
    const { data } = await axiosInstance.get(`/ads/${slug}`);
    adCache.set(slug, data.ad);
    return data.ad;
  } catch {
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
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8">
      {/* صور العقار */}
      <div className="rounded-2xl overflow-hidden shadow-md">
        <Image
          src={ad.images[0]?.url || "/placeholder.svg"}
          alt={ad.title}
          width={1200}
          height={600}
          className="object-cover w-full h-[350px] md:h-[450px]"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* تفاصيل العقار */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow border border-gray-100">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {ad.title}
            </h1>

            <div className="flex items-center text-gray-600 mb-4">
              <FaMapMarkerAlt className="ml-2 text-accent w-4 h-4" />
              <span className="font-medium">
                {ad.city} - {ad.area}
              </span>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">{ad.address}</p>

            {/* الخصائص */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
              {ad.rooms && (
                <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-xl">
                  <FaBed className="text-primary w-5 h-5" />
                  <span className="text-sm font-medium text-gray-700">
                    {ad.rooms} غرف
                  </span>
                </div>
              )}
              {ad.space && (
                <div className="flex items-center gap-2 p-3 bg-accent/5 rounded-xl">
                  <FaRulerCombined className="text-accent w-5 h-5" />
                  <span className="text-sm font-medium text-gray-700">
                    {ad.space} م²
                  </span>
                </div>
              )}
              {ad.type && (
                <span className="p-3 bg-secondary/10 text-secondary rounded-xl text-sm font-medium flex items-center justify-center">
                  {ad.type}
                </span>
              )}
              {ad.propertyType && (
                <span className="p-3 bg-primary/10 text-primary rounded-xl text-sm font-medium flex items-center justify-center">
                  {ad.propertyType}
                </span>
              )}
            </div>

            {/* السعر */}
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-4 mb-6">
              <p className="text-3xl font-bold text-primary mb-1">
                {ad.price.toLocaleString()} جنيه
              </p>
              <p className="text-sm text-gray-600">السعر شامل جميع الرسوم</p>
            </div>

            {/* واتساب */}
            {ad.whatsappNumber && (
              <a
                href={`https://wa.me/${ad.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition shadow"
              >
                <FaWhatsapp className="w-5 h-5" />
                تواصل عبر واتساب
              </a>
            )}
          </div>

          {/* الوصف */}
          <div className="bg-white rounded-2xl p-6 shadow border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-3">وصف العقار</h3>
            <p className="text-gray-700 leading-relaxed">{ad.description}</p>
          </div>
        </div>

        {/* بيانات المعلن */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow border border-gray-100 text-center">
            <div className="w-20 h-20 rounded-full overflow-hidden mx-auto bg-gray-200 flex items-center justify-center mb-3">
              {ad.user.avatar ? (
                <Image
                  src={ad.user.avatar}
                  alt={ad.user.name}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              ) : (
                <FaUser className="text-gray-400" size={32} />
              )}
            </div>
            <h4 className="font-medium text-gray-900">{ad.user.name}</h4>
            <p className="text-sm text-gray-500">المعلن</p>

            {/* التقييم */}
            <div className="flex items-center justify-center gap-1 text-sm text-gray-600 mt-2">
              <FaStar className="text-yellow-400" size={14} />
              <span className="font-medium">
                {ad.user.avgRating?.toFixed(1) || "0.0"}
              </span>
              <span>({ad.user.totalReviews || 0} تقييم)</span>
            </div>

            {/* زر الملف الشخصي */}
            <Link
              href={`/users/${ad.user.publicId}`}
              className="mt-4 inline-block w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              عرض صفحة المعلن
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
