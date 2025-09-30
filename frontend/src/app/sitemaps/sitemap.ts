import { MetadataRoute } from "next";
import { CITIES_WITH_AREAS } from "@/lib/data";

const baseUrl = "https://aqark.vercel.app";

// escape XML special characters
function escapeXml(url: string) {
  return url.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/ads`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/favorite`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.5,
    },
  ];

  const cityUrls: MetadataRoute.Sitemap = [];
  const areaUrls: MetadataRoute.Sitemap = [];

  for (const city of Object.keys(CITIES_WITH_AREAS)) {
    cityUrls.push({
      url: escapeXml(`${baseUrl}/ads?city=${encodeURIComponent(city)}`),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    });

    const areas = CITIES_WITH_AREAS[city];
    for (const area of areas) {
      areaUrls.push({
        url: escapeXml(
          `${baseUrl}/ads?city=${encodeURIComponent(
            city
          )}&area=${encodeURIComponent(area)}`
        ),
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.6,
      });
    }
  }

  return [...staticUrls, ...cityUrls, ...areaUrls];
}
