import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Prediction from "@/models/Prediction";
import Student from "@/models/Student";
import Attendance from "@/models/Attendance";
import { predictAttendance } from "@/lib/ai/attendancePrediction";
import { apiError, listDocuments } from "@/lib/api/crud";
import { requireEditor } from "@/lib/auth";
export async function GET(request: Request) { try { await connectToDatabase(); return listDocuments(Prediction, request); } catch { return apiError(); } }
export async function POST(request: Request) {
	try {
		const denied = requireEditor(request);
		if (denied) return denied;
		await connectToDatabase();
		const students = await Student.find({}).lean();
		const attendance = await Attendance.find({}).lean();
		const byStudent = new Map<string, typeof attendance>();
		attendance.forEach((record) => byStudent.set(record.studentId, [...(byStudent.get(record.studentId) ?? []), record]));
		const predictions = students.map((student) => {
			const records = byStudent.get(student.studentId) ?? [];
			const attendedClasses = records.filter((record) => record.status === "PRESENT").length;
			const missedClasses = records.length - attendedClasses;
			const currentAttendance = records.length ? (attendedClasses / records.length) * 100 : 75;
			const result = predictAttendance({ currentAttendance, recentTrend: attendedClasses - missedClasses, attendedClasses, missedClasses });
			return { predictionId: `PRED-${student.studentId}`, studentId: student.studentId, ...result, generatedDate: new Date() };
		});
		await Prediction.bulkWrite(predictions.map((prediction) => ({ updateOne: { filter: { predictionId: prediction.predictionId }, update: { $set: prediction }, upsert: true } })));
		return NextResponse.json({ success: true, data: { generated: predictions.length, predictions } });
	} catch { return apiError(); }
}
