import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Message from "@/models/Message";
import { isRequestAuthorized } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    if (!isRequestAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const messages = await Message.find({}).sort({ createdAt: -1 });
    return NextResponse.json(messages);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const message = await Message.create({
      name: body.name,
      email: body.email,
      subject: body.subject,
      message: body.message,
      isRead: false,
    });
    return NextResponse.json(message, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
