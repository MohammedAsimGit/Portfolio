import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "portfolio-cms-secret-key-change-in-production-2026";
const FALLBACK_ADMIN = { id: "fallback-admin-id", username: "admin", password: "Asim@2026Portfolio" };
const MONGODB_URI = process.env.MONGODB_URI || "";

function isRealMongoURI(uri: string): boolean {
  return uri.length > 0 && !uri.includes("localhost") && !uri.includes("127.0.0.1");
}

function signToken(id: string, username: string): string {
  return jwt.sign({ id, username, role: "admin" }, JWT_SECRET, { expiresIn: "7d" });
}

function setAuthCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: "admin_token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
}

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    // If a real MongoDB URI is configured, use database auth
    if (isRealMongoURI(MONGODB_URI)) {
      const dbConnect = (await import("@/lib/dbConnect")).default;
      const Admin = (await import("@/models/Admin")).default;
      const bcrypt = (await import("bcryptjs")).default;

      let dbConnected = false;
      try {
        await dbConnect();
        dbConnected = true;
      } catch {
        console.warn("MongoDB connection failed despite valid URI. Falling back.");
      }

      if (dbConnected) {
        const adminCount = await Admin.countDocuments();
        if (adminCount === 0) {
          const hashedPassword = await bcrypt.hash(FALLBACK_ADMIN.password, 10);
          await Admin.create({
            username: FALLBACK_ADMIN.username,
            password: hashedPassword,
            role: "admin",
          });
        }

        const admin = await Admin.findOne({ username });
        if (!admin) {
          return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
          return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const token = signToken(admin._id.toString(), admin.username);
        const response = NextResponse.json({ success: true, username: admin.username });
        setAuthCookie(response, token);
        return response;
      }
    }

    // Fallback: no real MongoDB — use hardcoded credentials
    if (username !== FALLBACK_ADMIN.username || password !== FALLBACK_ADMIN.password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = signToken(FALLBACK_ADMIN.id, FALLBACK_ADMIN.username);
    const response = NextResponse.json({ success: true, username: FALLBACK_ADMIN.username });
    setAuthCookie(response, token);
    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("Login API Error:", message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
