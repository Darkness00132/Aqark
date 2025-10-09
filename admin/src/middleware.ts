import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("jwt-auth")?.value;
  const { pathname } = req.nextUrl;

  // ✅ If user is logged in and visits /login → redirect to home
  if (pathname.startsWith("/login") && token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // ✅ Allow public/static routes
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.match(/\.(png|jpg|jpeg|svg|css|js|ico|webp|gif)$/)
  ) {
    return NextResponse.next();
  }

  // ✅ Protect all other pages: redirect to /login if not logged in
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// ✅ Apply to all routes except Next.js internals
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
