import { NextResponse } from "next/server";

const baseUrl = "https://aqark.vercel.app";

export async function GET(
  req: Request,
  { params }: { params: { part: string } }
) {
  const part = params.part || 1;

  // Fetch ads for this part (paginated)
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/ads/sitemap?part=${part}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return new NextResponse("Failed to fetch ads", { status: res.status });
  }

  const data = await res.json();
  const ads: { slug: string; updatedAt?: string }[] = data.ads || [];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ads
  .map(
    (ad) => `
  <url>
    <loc>${baseUrl}/ads/${encodeURIComponent(ad.slug)}</loc>
    <lastmod>${
      ad.updatedAt
        ? new Date(ad.updatedAt).toISOString()
        : new Date().toISOString()
    }</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`
  )
  .join("")}
</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
