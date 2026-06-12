import { NextResponse } from "next/server";
import { isRequestAuthorized, getTokenFromRequest, getAdminFromToken } from "@/lib/auth";

const MONGODB_URI = process.env.MONGODB_URI || "";

function isRealMongoURI(uri: string): boolean {
  return uri.length > 0 && !uri.includes("localhost") && !uri.includes("127.0.0.1");
}

export async function POST(request: Request) {
  try {
    if (!isRequestAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = getAdminFromToken(token);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "Current and new password are required" }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "New password must be at least 6 characters" }, { status: 400 });
    }

    if (!isRealMongoURI(MONGODB_URI)) {
      return NextResponse.json({ error: "Database is not configured. Set MONGODB_URI in Vercel environment variables to enable password changes." }, { status: 503 });
    }

    const dbConnect = (await import("@/lib/dbConnect")).default;
    const Admin = (await import("@/models/Admin")).default;
    const bcrypt = (await import("bcryptjs")).default;

    await dbConnect();

    const adminDoc = await Admin.findById(admin.id);
    if (!adminDoc) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(currentPassword, adminDoc.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    adminDoc.password = hashedPassword;
    await adminDoc.save();

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
