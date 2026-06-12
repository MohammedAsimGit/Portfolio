import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Message from "@/models/Message";
import { isRequestAuthorized } from "@/lib/auth";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    if (!isRequestAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();
    const body = await request.json();
    const message = await Message.findByIdAndUpdate(id, { isRead: body.isRead }, { new: true });
    
    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json(message);
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
    const message = await Message.findByIdAndDelete(id);

    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
