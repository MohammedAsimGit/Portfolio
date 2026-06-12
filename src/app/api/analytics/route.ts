import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Visitor from "@/models/Visitor";
import Project from "@/models/Project";
import Certificate from "@/models/Certificate";
import Skill from "@/models/Skill";
import Message from "@/models/Message";
import { isRequestAuthorized } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    if (!isRequestAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // 1. Get counts
    const totalProjects = await Project.countDocuments();
    const totalCertificates = await Certificate.countDocuments();
    const totalSkills = await Skill.countDocuments();
    const totalMessages = await Message.countDocuments();
    
    // 2. Get visitor analytics
    const totalVisitors = await Visitor.countDocuments();
    
    // Group visitors by day (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyVisitors = await Visitor.aggregate([
      { $match: { date: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Format daily visitors as { date: string, count: number }[]
    const formattedDaily = dailyVisitors.map((item) => ({
      date: item._id,
      count: item.count,
    }));

    // Recent activities (mocked or combined from latest additions)
    const recentProjects = await Project.find({}).sort({ createdAt: -1 }).limit(3);
    const recentMessages = await Message.find({}).sort({ createdAt: -1 }).limit(3);

    const recentActivity = [
      ...recentProjects.map((p) => ({
        type: "project",
        title: `Project Added: ${p.title}`,
        time: p.createdAt,
      })),
      ...recentMessages.map((m) => ({
        type: "message",
        title: `New Message from ${m.name}`,
        time: m.createdAt,
      })),
    ].sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 5);

    return NextResponse.json({
      totalProjects,
      totalCertificates,
      totalSkills,
      totalMessages,
      totalVisitors,
      dailyVisitors: formattedDaily,
      recentActivity,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const ip = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "127.0.0.1";
    const body = await request.json().catch(() => ({}));
    const page = body.page || "portfolio";

    const visitor = await Visitor.create({ ip, page, date: new Date() });
    return NextResponse.json({ success: true, id: visitor._id });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
