import { MetadataRoute } from "next";
import { CITIES_WITH_AREAS } from "@/lib/data";

// Escape XML special characters
const escapeXml = (str: string) =>
  str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch ads from your API
  const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ads/sitemap`)
    .then((res) => res.json())
    .catch(() => ({ ads: [] }));

  const ads = data.ads || [];

  // Generate city + area URLs
  const cityAndAreaUrls = Object.entries(CITIES_WITH_AREAS).flatMap(
    ([city, areas]) => {
      const cityUrl = {
        url: escapeXml(
          `https://aqark.vercel.app/ads?city=${encodeURIComponent(city)}`
        ),
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.85,
      };

      const areaUrls = areas.map((area: string) => ({
        url: escapeXml(
          `https://aqark.vercel.app/ads?city=${encodeURIComponent(
            city
          )}&area=${encodeURIComponent(area)}`
        ),
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

    // Ads detail pages
    ...ads.map(({ slug }: { slug: string }) => ({
      url: escapeXml(
        `https://aqark.vercel.app/ads/${encodeURIComponent(slug)}`
      ),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    })),

    // City + area pages
    ...cityAndAreaUrls,
  ];
}
