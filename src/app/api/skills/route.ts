import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Skill from "@/models/Skill";
import { isRequestAuthorized } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();
    const skills = await Skill.find({}).sort({ category: 1, level: -1 });
    return NextResponse.json(skills);
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
    const skill = await Skill.create(body);
    return NextResponse.json(skill, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
