import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Setting from "@/models/Setting";
import { isRequestAuthorized } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();
    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create({
        aboutBio: "",
        careerObjective: "",
        githubUrl: "",
        linkedinUrl: "",
      });
    }
    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    if (!isRequestAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();

    let settings = await Setting.findOne();
    if (!settings) {
      settings = await Setting.create(body);
    } else {
      settings = await Setting.findByIdAndUpdate(settings._id, body, {
        new: true,
        runValidators: true,
      });
    }

    return NextResponse.json(settings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
