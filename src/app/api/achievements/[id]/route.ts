import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Achievement from "@/models/Achievement";
import { isRequestAuthorized } from "@/lib/auth";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await dbConnect();
    const achievement = await Achievement.findById(id);
    if (!achievement) {
      return NextResponse.json({ error: "Achievement not found" }, { status: 404 });
    }
    return NextResponse.json(achievement);
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
    const achievement = await Achievement.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    
    if (!achievement) {
      return NextResponse.json({ error: "Achievement not found" }, { status: 404 });
    }

    return NextResponse.json(achievement);
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
    const achievement = await Achievement.findByIdAndDelete(id);

    if (!achievement) {
      return NextResponse.json({ error: "Achievement not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
