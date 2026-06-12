import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Resume from "@/models/Resume";
import { isRequestAuthorized } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();
    const resume = await Resume.findOne().sort({ createdAt: -1 });
    return NextResponse.json(resume || { pdfUrl: "" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!isRequestAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { pdfUrl } = await request.json();
    
    if (!pdfUrl) {
      return NextResponse.json({ error: "pdfUrl is required" }, { status: 400 });
    }

    // Delete existing resumes
    await Resume.deleteMany({});
    
    const resume = await Resume.create({ pdfUrl });
    return NextResponse.json(resume, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
