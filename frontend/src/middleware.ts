import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("jwt-auth")?.value;
  const { pathname } = req.nextUrl;

  // ✅ Allow Next.js internals and static files
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.match(/\.(png|jpg|jpeg|svg|css|js|ico|webp|gif)$/)
  ) {
    return NextResponse.next();
  }

  // ✅ If logged in and tries to access /login or /signup → redirect to home
  if (token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// ✅ Apply to all routes except Next.js internals
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
