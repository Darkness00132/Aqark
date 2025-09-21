// app/sitemap.xml/route.ts
import axiosInstance from "@/axiosInstance/axiosInstance";
import { NextResponse } from "next/server";
import { type Ad } from "@/store/useAd";
import { CITIES_WITH_AREAS } from "@/lib/data"; // your city/area data

export async function GET() {
  try {
    const response = await axiosInstance.get("/ads/all");
    const ads: Ad[] = response.data.ads;

    // Static pages
    const urls = [
      { loc: "https://yourwebsite.com/", changefreq: "daily", priority: 1.0 },
      {
        loc: "https://yourwebsite.com/ads",
        changefreq: "daily",
        priority: 0.9,
      },
      {
        loc: "https://yourwebsite.com/ads/my-ads",
        changefreq: "weekly",
        priority: 0.7,
      },
      {
        loc: "https://yourwebsite.com/ads/create",
        changefreq: "monthly",
        priority: 0.5,
      },
    ];

    // Dynamic ads
    const adUrls = ads.map((ad) => ({
      loc: `https://yourwebsite.com/ads/${ad.slug}`,
      changefreq: "weekly",
      priority: 0.8,
    }));

    // Dynamic city/area filter pages
    const filterUrls = Object.entries(CITIES_WITH_AREAS).flatMap(
      ([city, areas]) => {
        // city page
        const cityPage = {
          loc: `https://yourwebsite.com/ads?city=${encodeURIComponent(city)}`,
          changefreq: "weekly",
          priority: 0.7,
        };

        // area pages
        const areaPages = areas.map((area) => ({
          loc: `https://yourwebsite.com/ads?city=${encodeURIComponent(
            city
          )}&area=${encodeURIComponent(area)}`,
          changefreq: "weekly",
          priority: 0.6,
        }));

        return [cityPage, ...areaPages];
      }
    );

    const allUrls = [...urls, ...adUrls, ...filterUrls];

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls
    .map(
      ({ loc, changefreq, priority }) => `
  <url>
    <loc>${loc}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
    )
    .join("")}
</urlset>`;

    return new NextResponse(sitemapXml, {
      headers: { "Content-Type": "text/xml" },
    });
  } catch (error) {
    console.error("Sitemap generation failed:", error);
    return new NextResponse("Error generating sitemap", { status: 500 });
  }
}
