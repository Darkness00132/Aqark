// app/sitemap.ts
import { CITIES_WITH_AREAS } from "@/lib/data";

const escapeXml = (str: string) =>
  str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export default async function sitemap() {
  const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ads/sitemap`)
    .then((res) => res.json())
    .catch(() => ({ ads: [] }));

  const ads = data.ads || [];

  const urls = [
    "https://aqark.vercel.app",
    "https://aqark.vercel.app/about",
    "https://aqark.vercel.app/contact",
    "https://aqark.vercel.app/ads",
    ...ads.map(({ slug }: { slug: string }) => `/ads/${slug}`),
    ...Object.entries(CITIES_WITH_AREAS).flatMap(([city, areas]) => [
      `/ads?city=${city}`,
      ...areas.map((area: string) => `/ads?city=${city}&area=${area}`),
    ]),
  ];

  return urls.map((url) => ({
    url: escapeXml(url),
    lastModified: new Date(),
  }));
}
