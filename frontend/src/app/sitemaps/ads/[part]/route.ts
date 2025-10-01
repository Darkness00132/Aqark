import { NextResponse } from "next/server";

const BASE_URL = "https://aqark.vercel.app";
const API_TIMEOUT = 10000; // 10 seconds
const CACHE_MAX_AGE = 3600; // 1 hour
const CACHE_STALE_WHILE_REVALIDATE = 7200; // 2 hours

interface Ad {
  slug: string;
  updatedAt?: string;
}

interface RouteContext {
  params: Promise<{ part: string }>;
}

export const dynamic = "force-dynamic";

/**
 * Validates the part parameter
 */
function validatePart(part: string): { valid: boolean; error?: string } {
  if (!part) {
    return { valid: false, error: "Missing part parameter" };
  }

  if (!/^\d+$/.test(part)) {
    return { valid: false, error: "Part must be a positive integer" };
  }

  const partNum = parseInt(part, 10);
  if (partNum < 0 || partNum > 10000) {
    return { valid: false, error: "Part must be between 0 and 10000" };
  }

  return { valid: true };
}

/**
 * Fetches ads from backend API with timeout
 */
async function fetchAdsFromBackend(part: string): Promise<Ad[]> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

  try {
    const apiUrl = process.env.API_URL;

    if (!apiUrl) {
      throw new Error("API_URL environment variable is not configured");
    }

    const res = await fetch(
      `${apiUrl}/api/ads/sitemap?part=${encodeURIComponent(part)}`,
      {
        cache: "no-store",
        signal: controller.signal,
        headers: {
          Accept: "application/json",
        },
      }
    );

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Backend responded with status ${res.status}`);
    }

    const data = await res.json();
    return data.ads || [];
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Generates sitemap XML from ads array
 */
function generateSitemapXML(ads: Ad[]): string {
  const urlEntries = ads
    .map((ad) => {
      const lastmod = ad.updatedAt
        ? new Date(ad.updatedAt).toISOString()
        : new Date().toISOString();

      return `  <url>
    <loc>${BASE_URL}/ads/${encodeURIComponent(ad.slug)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;
}

/**
 * GET handler for sitemap route
 */
export async function GET(request: Request, context: RouteContext) {
  try {
    const { part } = await context.params;

    // Validate part parameter
    const validation = validatePart(part);
    if (!validation.valid) {
      return new NextResponse(validation.error, { status: 400 });
    }

    // Fetch ads from backend
    const ads = await fetchAdsFromBackend(part);

    // Handle empty results
    if (ads.length === 0) {
      return new NextResponse(generateSitemapXML([]), {
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
          "Cache-Control": `public, s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate=${CACHE_STALE_WHILE_REVALIDATE}`,
        },
      });
    }

    // Generate and return sitemap
    const xml = generateSitemapXML(ads);

    return new NextResponse(xml, {
      status: 200,
      headers: {
        "Content-Type": "application/xml; charset=utf-8",
        "Cache-Control": `public, s-maxage=${CACHE_MAX_AGE}, stale-while-revalidate=${CACHE_STALE_WHILE_REVALIDATE}`,
        "X-Robots-Tag": "noindex", // Optional: prevent indexing of sitemap itself
      },
    });
  } catch (error) {
    // Handle specific error types
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        console.error(`[Sitemap] Request timeout for part: ${context.params}`);
        return new NextResponse("Backend request timeout", { status: 504 });
      }

      if (error.message.includes("API_URL")) {
        console.error("[Sitemap] Configuration error:", error.message);
        return new NextResponse("Service configuration error", { status: 500 });
      }

      if (error.message.includes("Backend responded")) {
        console.error("[Sitemap] Backend error:", error.message);
        return new NextResponse("Failed to fetch ads from backend", {
          status: 502,
        });
      }
    }

    // Generic error handler
    console.error("[Sitemap] Unexpected error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
