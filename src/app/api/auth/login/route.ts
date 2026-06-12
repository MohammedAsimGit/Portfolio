import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Admin from "@/models/Admin";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key-replace-in-prod";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    // Seed default admin if none exist
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      await Admin.create({
        username: "admin",
        password: hashedPassword,
        role: "admin",
      });
      console.log("Seeded default admin user. Username: admin, Password: admin123");
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Generate JWT
    const token = jwt.sign({ id: admin._id, username: admin.username, role: admin.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    const response = NextResponse.json({ success: true, username: admin.username });
    
    // Set HTTP-only cookie
    response.cookies.set({
      name: "admin_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
