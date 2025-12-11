import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Ad } from "@/store/useAd";
import AdContent from "@/components/ad/Display/AdContent";
import AdSkeleton from "@/components/ad/Display/AdSkeleton";

export const revalidate = 300;
export const dynamicParams = true;

async function getAd(slug: string): Promise<Ad | null> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/ads/${slug}`,
      {
        signal: controller.signal,
        next: { revalidate: 300 },
      }
    );

    clearTimeout(timeoutId);

    if (!res.ok) return null;
    return (await res.json()).ad;
  } catch (e) {
    console.error("Error fetching ad:", e);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ad = await getAd(slug);

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
      images: ad.images.slice(0, 1).map((img) => ({
        // Only first image for OG
        url: img.url,
        width: 800,
        height: 600,
        alt: ad.title,
      })),
    },
  };
}

export default async function AdSlug({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <Suspense fallback={<AdSkeleton />}>
      <AdContentWrapper slug={slug} />
    </Suspense>
  );
}

async function AdContentWrapper({ slug }: { slug: string }) {
  const ad = await getAd(slug);

  if (!ad) {
    notFound();
  }

  return <AdContent ad={ad} />;
}
