import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Achievement from "@/models/Achievement";
import { isRequestAuthorized } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();
    const achievements = await Achievement.find({}).sort({ date: -1 });
    return NextResponse.json(achievements);
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
    const achievement = await Achievement.create(body);
    return NextResponse.json(achievement, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
