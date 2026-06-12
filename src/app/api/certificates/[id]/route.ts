import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Certificate from "@/models/Certificate";
import { isRequestAuthorized } from "@/lib/auth";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await dbConnect();
    const certificate = await Certificate.findById(id);
    if (!certificate) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }
    return NextResponse.json(certificate);
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
    const certificate = await Certificate.findByIdAndUpdate(id, body, { new: true, runValidators: true });
    
    if (!certificate) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    return NextResponse.json(certificate);
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
    const certificate = await Certificate.findByIdAndDelete(id);

    if (!certificate) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
