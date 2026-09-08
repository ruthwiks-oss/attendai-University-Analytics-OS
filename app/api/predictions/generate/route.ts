import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Attendance from "@/models/Attendance";
import Prediction from "@/models/Prediction";
import Student from "@/models/Student";
import { predictAttendance } from "@/lib/ai/attendancePrediction";

export async function POST() {
  try {
    await connectToDatabase();
    const students = await Student.find({}).select({ studentId: 1 }).lean();
    const records = await Attendance.find({}).lean();
    const now = new Date();
    const predictions = students.map((student) => {
      const history = records.filter((record) => record.studentId === student.studentId);
      const attendedClasses = history.filter((record) => record.status === "PRESENT").length;
      const missedClasses = history.filter((record) => record.status === "ABSENT").length;
      const volume = attendedClasses + missedClasses;
      const currentAttendance = volume ? (attendedClasses / volume) * 100 : 0;
      const result = predictAttendance({ currentAttendance, recentTrend: 0, attendedClasses, missedClasses });
      return { updateOne: { filter: { studentId: student.studentId }, update: { $set: { predictionId: `PRED-${student.studentId}`, studentId: student.studentId, ...result, generatedDate: now } }, upsert: true } };
    });
    if (predictions.length) await Prediction.bulkWrite(predictions);
    return NextResponse.json({ success: true, data: { generated: predictions.length, generatedDate: now } });
  } catch {
    return NextResponse.json({ success: false, error: "Predictions require a connected MongoDB database." }, { status: 503 });
  }
}