import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Attendance from "@/models/Attendance";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectToDatabase();
    const records = await Attendance.find({ studentId: id }).sort({ date: -1 }).lean();
    return NextResponse.json({ success: true, data: records });
  } catch {
    return NextResponse.json({ success: false, error: "Attendance data is temporarily unavailable." }, { status: 503 });
  }
}