import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Skill from "@/models/Skill";
import { isRequestAuthorized } from "@/lib/auth";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await dbConnect();
    const skill = await Skill.findById(id);
    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }
    return NextResponse.json(skill);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!isRequestAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();
    const body = await request.json();
    const skill = await Skill.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    
    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    return NextResponse.json(skill);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!isRequestAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();
    const skill = await Skill.findByIdAndDelete(id);

    if (!skill) {
      return NextResponse.json({ error: "Skill not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
