import { MetadataRoute } from "next";
import { CITIES_WITH_AREAS } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ads/sitemap`)
    .then((res) => res.json())
    .catch(() => ({ ads: [] }));

  const ads = data.ads || [];

  // generate city + area pages
  const cityAndAreaUrls = Object.entries(CITIES_WITH_AREAS).flatMap(
    ([city, areas]) => {
      const cityUrl = {
        url: `https://aqark.vercel.app/ads?city=${encodeURIComponent(city)}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.85,
      };

      const areaUrls = areas.map((area: string) => ({
        url: `https://aqark.vercel.app/ads?city=${encodeURIComponent(
          city
        )}&area=${encodeURIComponent(area)}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      }));

      return [cityUrl, ...areaUrls];
    }
  );

  return [
    {
      url: "https://aqark.vercel.app",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://aqark.vercel.app/about",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://aqark.vercel.app/contact",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: "https://aqark.vercel.app/ads",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },

    // ads detail pages
    ...ads.map(({ slug }: { slug: string }) => ({
      url: `https://aqark.vercel.app/ads/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    })),

    // city + area pages
    ...cityAndAreaUrls,
  ];
}
