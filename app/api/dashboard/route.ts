import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Department from "@/models/Department";
import Student from "@/models/Student";
import Faculty from "@/models/Faculty";
import Subject from "@/models/Subject";
import ClassSession from "@/models/Class";
import Assessment from "@/models/Assessment";
import Prediction from "@/models/Prediction";

export async function GET() {
  try {
    await connectToDatabase();
    const [students, departments, faculty, subjects, classes, assessments, atRisk] = await Promise.all([
      Student.countDocuments(), Department.countDocuments(), Faculty.countDocuments(), Subject.countDocuments(), ClassSession.countDocuments(), Assessment.countDocuments(), Prediction.countDocuments({ riskLevel: { $in: ["HIGH", "MEDIUM"] } }),
    ]);
    return NextResponse.json({ success: true, data: { students, departments, faculty, subjects, classes, assessments, atRisk } });
  } catch {
    return NextResponse.json({ success: false, error: "Dashboard data is temporarily unavailable." }, { status: 503 });
  }
}
