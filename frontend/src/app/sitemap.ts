import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/ads/sitemap`)
    .then((res) => res.json())
    .catch(() => ({ ads: [] }));
  const ads = data.ads || [];
  console.log(ads);

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
    ...ads.map(({ slug }: { slug: string }) => ({
      url: `https://aqark.vercel.app/ads/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    })),
  ];
}
