import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { isRequestAuthorized } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    if (!isRequestAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    // Sanitize and generate a unique file name
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${Date.now()}-${sanitizedName}`;
    const filePath = join(uploadsDir, filename);

    await writeFile(filePath, buffer);

    return NextResponse.json({ 
      success: true, 
      url: `/uploads/${filename}` 
    });
  } catch (error: any) {
    console.error("Upload Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
