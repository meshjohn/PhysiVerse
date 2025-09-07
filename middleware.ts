import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);

  // ✅ 1. Catch OAuth errors like access_denied
  if (url.pathname.startsWith("/api/auth/callback/") && url.searchParams.has("error")) {
    const error = url.searchParams.get("error");
    return NextResponse.redirect(new URL(`/error?error=${error}`, request.url));
  }

  // ✅ 2. Protect /admin routes
  if (url.pathname.startsWith("/admin")) {
    const sessionCookie = getSessionCookie(request);
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/api/auth/callback/:path*", // 👈 for OAuth error handling
    "/admin/:path*",             // 👈 for admin auth
  ],
};
