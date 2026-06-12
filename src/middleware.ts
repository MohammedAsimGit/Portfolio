import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-replace-in-prod";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect all /admin routes except /admin/login
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const token = request.cookies.get("admin_token")?.value;

    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }

    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      const response = NextResponse.redirect(url);
      response.cookies.delete("admin_token");
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
