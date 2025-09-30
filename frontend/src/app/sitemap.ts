import { MetadataRoute } from "next";
import { CITIES_WITH_AREAS } from "@/lib/data";

// Escape XML special characters
const escapeXml = (str: string) =>
  str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const BASE_URL = "https://aqark.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch ads from your API
  const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ads/sitemap`)
    .then((res) => res.json())
    .catch(() => ({ ads: [] }));

  const ads = data.ads || [];

  // Generate absolute city + area URLs
  const cityAndAreaUrls = Object.entries(CITIES_WITH_AREAS).flatMap(
    ([city, areas]) => {
      const fullCityUrl = `${BASE_URL}/ads?city=${encodeURIComponent(city)}`;
      const cityUrl = {
        url: escapeXml(fullCityUrl),
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.85,
      };

      const areaUrls = areas.map((area: string) => {
        const fullAreaUrl = `${BASE_URL}/ads?city=${encodeURIComponent(
          city
        )}&area=${encodeURIComponent(area)}`;
        return {
          url: escapeXml(fullAreaUrl),
          lastModified: new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        };
      });

      return [cityUrl, ...areaUrls];
    }
  );

  // Check size (optional: log warning if too large)
  const totalUrls = 4 + ads.length + cityAndAreaUrls.length; // 4 static pages
  if (totalUrls > 40000) {
    console.warn(
      `Sitemap has ${totalUrls} URLs - consider splitting into multiple sitemaps.`
    );
  }

  return [
    {
      url: escapeXml(BASE_URL),
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
    {
      url: escapeXml(`${BASE_URL}/about`),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: escapeXml(`${BASE_URL}/contact`),
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    {
      url: escapeXml(`${BASE_URL}/ads`),
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    },

    // Ads detail pages (absolute URLs)
    ...ads.map(({ slug }: { slug: string }) => ({
      url: escapeXml(`${BASE_URL}/ads/${encodeURIComponent(slug)}`),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),

    // City + area pages
    ...cityAndAreaUrls,
  ];
}
