import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "portfolio-cms-secret-key-change-in-production-2026";
const FALLBACK_ADMIN = { id: "fallback-admin-id", username: "admin", password: "Asim@2026Portfolio" };

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    let dbConnected = false;
    try {
      await dbConnect();
      dbConnected = true;
    } catch {
      console.warn("MongoDB not available. Using fallback authentication.");
    }

    if (dbConnected) {
      // Seed default admin if none exist
      const adminCount = await Admin.countDocuments();
      if (adminCount === 0) {
        const hashedPassword = await bcrypt.hash(FALLBACK_ADMIN.password, 10);
        await Admin.create({
          username: FALLBACK_ADMIN.username,
          password: hashedPassword,
          role: "admin",
        });
        console.log("Seeded default admin user. Username: admin, Password: Asim@2026Portfolio");
      }

      const admin = await Admin.findOne({ username });
      if (!admin) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
      }

      const token = jwt.sign({ id: admin._id, username: admin.username, role: admin.role }, JWT_SECRET, {
        expiresIn: "7d",
      });

      const response = NextResponse.json({ success: true, username: admin.username });
      response.cookies.set({
        name: "admin_token",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return response;
    }

    // Fallback: no MongoDB — use hardcoded credentials
    if (username !== FALLBACK_ADMIN.username || password !== FALLBACK_ADMIN.password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign({ id: FALLBACK_ADMIN.id, username: FALLBACK_ADMIN.username, role: "admin" }, JWT_SECRET, {
      expiresIn: "7d",
    });

    const response = NextResponse.json({ success: true, username: FALLBACK_ADMIN.username });
    response.cookies.set({
      name: "admin_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("Login API Error:", message);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
