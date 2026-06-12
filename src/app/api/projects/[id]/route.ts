import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Project from "@/models/Project";
import { isRequestAuthorized } from "@/lib/auth";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await dbConnect();
    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json(project);
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
    const project = await Project.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
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
    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
