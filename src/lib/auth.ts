import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-replace-in-prod";

export function verifyAdminToken(token: string): boolean {
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}

export function isRequestAuthorized(request: Request | NextRequest): boolean {
  let token: string | undefined;

  // Try to read cookie
  if (request instanceof NextRequest) {
    token = request.cookies.get("admin_token")?.value;
  } else {
    // Normal request
    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
      cookieHeader.split(";").map((c) => c.trim().split("="))
    );
    token = cookies["admin_token"];
  }

  // Fallback to Authorization Header
  if (!token) {
    const authHeader = request.headers.get("authorization") || "";
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }

  if (!token) return false;
  return verifyAdminToken(token);
}
