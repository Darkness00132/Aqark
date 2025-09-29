import axiosInstance from "@/axiosInstance/axiosInstance";
import { NextResponse } from "next/server";
import type { Ad } from "@/store/useAd";
import { CITIES_WITH_AREAS } from "@/lib/data";

// Escape XML special characters
const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export async function GET() {
  try {
    const { data } = await axiosInstance.get("/ads/all");
    const ads: Ad[] = data.ads || [];

    // Static pages
    const staticUrls = [
      { loc: "/", changefreq: "daily", priority: 1.0 },
      { loc: "/ads", changefreq: "daily", priority: 0.9 },
      { loc: "/ads/my-ads", changefreq: "weekly", priority: 0.7 },
      { loc: "/ads/create", changefreq: "monthly", priority: 0.5 },
    ];

    // Dynamic ad URLs
    const adUrls = ads.map((ad) => ({
      loc: `/ads/${ad.slug}`,
      changefreq: "weekly",
      priority: 0.8,
    }));

    // City & area filter pages
    const filterUrls = Object.entries(CITIES_WITH_AREAS).flatMap(
      ([city, areas]) => [
        {
          loc: `/ads?city=${encodeURIComponent(city)}`,
          changefreq: "weekly",
          priority: 0.7,
        },
        ...areas.map((area) => ({
          loc: `/ads?city=${encodeURIComponent(city)}&area=${encodeURIComponent(
            area
          )}`,
          changefreq: "weekly",
          priority: 0.6,
        })),
      ]
    );

    const allUrls = [...staticUrls, ...adUrls, ...filterUrls];

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    ({ loc, changefreq, priority }) => `
  <url>
    <loc>https://aqark.vercel.app${escapeXml(loc)}</loc>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join("")}
</urlset>`;

    return new NextResponse(sitemapXml, {
      headers: { "Content-Type": "text/xml" },
    });
  } catch (err) {
    console.error("Sitemap generation failed:", err);
    return new NextResponse("Error generating sitemap", { status: 500 });
  }
}
