import { MetadataRoute } from "next";
import { CITIES_WITH_AREAS } from "@/lib/data";

const BASE_URL = "https://aqark.vercel.app";

const escapeXml = (str: string) =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  type SitemapItem = {
    url: string;
    lastModified?: string | Date;
    changeFrequency?: "daily" | "weekly" | "monthly";
    priority?: number;
  };

  // Static pages
  const staticUrls: SitemapItem[] = [
    {
      url: escapeXml(BASE_URL),
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: escapeXml(`${BASE_URL}/about`),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: escapeXml(`${BASE_URL}/contact`),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: escapeXml(`${BASE_URL}/ads`),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  // City + area pages
  const cityAndAreaUrls: SitemapItem[] = Object.entries(
    CITIES_WITH_AREAS
  ).flatMap(([city, areas]) => {
    const cityUrl: SitemapItem = {
      url: escapeXml(`${BASE_URL}/ads?city=${encodeURIComponent(city)}`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.85,
    };

    const areaUrls: SitemapItem[] = areas.map((area) => ({
      url: escapeXml(
        `${BASE_URL}/ads?city=${encodeURIComponent(
          city
        )}&area=${encodeURIComponent(area)}`
      ),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    return [cityUrl, ...areaUrls];
  });

  return [...staticUrls, ...cityAndAreaUrls];
}
