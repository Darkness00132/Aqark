import axiosInstance from "@/axiosInstance/axiosInstance";
import Image from "next/image";
import { Ad } from "@/store/useAd";
import { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import {
  FaBed,
  FaRulerCombined,
  FaMapMarkerAlt,
  FaWhatsapp,
} from "react-icons/fa";

const getAd = cache(async (slug: string) => {
  try {
    console.log(slug);
    const { data } = await axiosInstance.get(`/ads/${slug}`);
    return data.ad;
  } catch (e) {
    console.log(e);
    return null;
  }
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const param = await params;
  const ad: Ad = await getAd(param.slug);

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
  const param = await params;
  const ad: Ad = await getAd(param.slug);
  if (!ad) {
    notFound();
  }
  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Image Gallery - Takes 2 columns on large screens */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ad.images.map((img, i) => (
              <div
                key={i}
                className={`relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow ${
                  i === 0 ? "md:col-span-2 h-80" : "h-48"
                }`}
              >
                <Image
                  src={img.url || "/placeholder.svg"}
                  alt={`${ad.title} ${i + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Property Information - Takes 1 column on large screens */}
        <div className="space-y-6">
          {/* Title and Location Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight">
              {ad.title}
            </h1>

            <div className="flex items-center text-gray-600 mb-4">
              <FaMapMarkerAlt className="ml-2 text-accent w-4 h-4" />
              <span className="font-medium">
                {ad.city} - {ad.area}
              </span>
            </div>

            <p className="text-gray-700 leading-relaxed mb-4">{ad.address}</p>

            {/* Property Features */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {ad.rooms && (
                <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-xl">
                  <FaBed className="text-primary w-4 h-4" />
                  <span className="text-sm font-medium text-gray-700">
                    {ad.rooms} غرف
                  </span>
                </div>
              )}
              {ad.space && (
                <div className="flex items-center gap-2 p-3 bg-accent/5 rounded-xl">
                  <FaRulerCombined className="text-accent w-4 h-4" />
                  <span className="text-sm font-medium text-gray-700">
                    {ad.space} م²
                  </span>
                </div>
              )}
            </div>

            {/* Property Type Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {ad.type && (
                <span className="px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium">
                  {ad.type}
                </span>
              )}
              {ad.propertyType && (
                <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
                  {ad.propertyType}
                </span>
              )}
            </div>

            {/* Price */}
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-4 mb-6">
              <p className="text-3xl font-bold text-primary mb-1">
                {ad.price.toLocaleString()} جنيه
              </p>
              <p className="text-sm text-gray-600">السعر شامل جميع الرسوم</p>
            </div>

            {/* WhatsApp Contact */}
            {ad.whatsappNumber && (
              <a
                href={`https://wa.me/${ad.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
              >
                <FaWhatsapp className="w-5 h-5" />
                تواصل عبر واتساب
              </a>
            )}
          </div>

          {/* Description Card */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-3">وصف العقار</h3>
            <p className="text-gray-700 leading-relaxed">{ad.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
