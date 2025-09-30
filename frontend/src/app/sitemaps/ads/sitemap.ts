import { MetadataRoute } from "next";

const baseUrl = "https://www.aqark.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/ads/sitemap`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) return [];

  const data = await res.json();
  const total = data.total || 0;
  const chunkSize = 50000;
  const chunks = Math.ceil(total / chunkSize);

  if (chunks <= 1) {
    return data.ads.map(
      ({ slug, updatedAt }: { slug: string; updatedAt: string }) => ({
        url: `${baseUrl}/ads/${encodeURIComponent(slug)}`,
        lastModified: updatedAt
          ? new Date(updatedAt).toISOString()
          : new Date().toISOString(),
        changeFrequency: "weekly",
        priority: 0.7,
      })
    );
  }

  // If more than 1 chunk, reference sitemap parts
  return Array.from({ length: chunks }).map((_, i) => ({
    url: `${baseUrl}/ads/sitemap-${i + 1}.xml`,
    lastModified: new Date().toISOString(),
    changeFrequency: "daily",
    priority: 1,
  }));
}
