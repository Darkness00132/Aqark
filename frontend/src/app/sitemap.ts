import { MetadataRoute } from "next";

const baseUrl = "https://aqark.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return [
    {
      url: `${baseUrl}/sitemaps/static.xml`,
      lastModified: new Date().toISOString(),
    },
    {
      url: `${baseUrl}/sitemaps/ads/sitemap.xml`,
      lastModified: new Date().toISOString(),
    },
  ];
}
