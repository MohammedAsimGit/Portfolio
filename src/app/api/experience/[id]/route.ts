import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Experience from "@/models/Experience";
import { isRequestAuthorized } from "@/lib/auth";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await dbConnect();
    const experience = await Experience.findById(id);
    if (!experience) {
      return NextResponse.json({ error: "Experience not found" }, { status: 404 });
    }
    return NextResponse.json(experience);
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
    const experience = await Experience.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    
    if (!experience) {
      return NextResponse.json({ error: "Experience not found" }, { status: 404 });
    }

    return NextResponse.json(experience);
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
    const experience = await Experience.findByIdAndDelete(id);

    if (!experience) {
      return NextResponse.json({ error: "Experience not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
