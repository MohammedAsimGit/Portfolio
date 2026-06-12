import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Experience from "@/models/Experience";
import { isRequestAuthorized } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();
    const experience = await Experience.find({}).sort({ startDate: -1 });
    return NextResponse.json(experience);
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
    const experience = await Experience.create(body);
    return NextResponse.json(experience, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
