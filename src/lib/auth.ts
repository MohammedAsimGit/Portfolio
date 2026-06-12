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

export function getTokenFromRequest(request: Request | NextRequest): string | undefined {
  if (request instanceof NextRequest) {
    return request.cookies.get("admin_token")?.value;
  }
  const cookieHeader = request.headers.get("cookie") || "";
  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((c) => c.trim().split("="))
  );
  return cookies["admin_token"];
}

export function getAdminFromToken(token: string): { id: string; username: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; username: string };
    return decoded;
  } catch {
    return null;
  }
}

export function isRequestAuthorized(request: Request | NextRequest): boolean {
  let token = getTokenFromRequest(request);

  if (!token) {
    const authHeader = request.headers.get("authorization") || "";
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    }
  }

  if (!token) return false;
  return verifyAdminToken(token);
}
