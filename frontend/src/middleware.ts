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

  // ✅ Auth pages that logged-in users shouldn't access
  const authPages = ["/login", "/signup", "/user/login", "/user/signup"];
  const isAuthPage = authPages.some((page) => pathname.startsWith(page));

  // ✅ If logged in and tries to access auth pages → redirect to home
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // ✅ Allow all other routes
  return NextResponse.next();
}

// ✅ Apply to all routes except Next.js internals
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
