import { connectToDatabase } from "@/lib/mongodb";
import Attendance from "@/models/Attendance";
import { attendanceSchema } from "@/lib/validations/entities";
import { apiError, createDocument, listDocuments } from "@/lib/api/crud";
import { requireEditor } from "@/lib/auth";
export async function GET(request: Request) { try { await connectToDatabase(); return listDocuments(Attendance, request); } catch { return apiError(); } }
	export async function POST(request: Request) {
	try {
		const denied = requireEditor(request);
		if (denied) return denied;
		const body = await request.json();
		if (Array.isArray(body.records)) {
			const records = body.records.map((record: unknown) => attendanceSchema.parse(record));
			await connectToDatabase();
			await Attendance.bulkWrite(records.map((record: { studentId: string; classId: string }) => ({ updateOne: { filter: { studentId: record.studentId, classId: record.classId }, update: { $set: record }, upsert: true } })));
			return Response.json({ success: true, data: { saved: records.length } });
		}
		await connectToDatabase();
		return createDocument(Attendance, request);
	} catch { return apiError(); }
}
