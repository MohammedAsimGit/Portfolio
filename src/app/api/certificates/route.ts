import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Certificate from "@/models/Certificate";
import { isRequestAuthorized } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();
    const certificates = await Certificate.find({}).sort({ date: -1, createdAt: -1 });
    return NextResponse.json(certificates);
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
    const body = await request.json();
    const certificate = await Certificate.create(body);
    return NextResponse.json(certificate, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
