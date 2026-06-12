import { NextResponse } from "next/server";
import { isRequestAuthorized } from "@/lib/auth";

export async function GET(request: Request) {
  const authorized = isRequestAuthorized(request);
  return NextResponse.json({ authenticated: authorized });
}
