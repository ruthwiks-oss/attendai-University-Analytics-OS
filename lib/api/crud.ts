import { NextResponse } from "next/server";
import type { Model } from "mongoose";

export async function listDocuments(model: Model<unknown>, request: Request) {
  const url = new URL(request.url);
  const page = Math.max(1, Number(url.searchParams.get("page") ?? 1));
  const limit = Math.min(100, Math.max(1, Number(url.searchParams.get("limit") ?? 10)));
  const search = url.searchParams.get("search")?.trim();
  const filter = search ? { $or: [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }, { studentId: { $regex: search, $options: "i" } }, { subjectName: { $regex: search, $options: "i" } }, { deptName: { $regex: search, $options: "i" } }] } : {};
  const [data, total] = await Promise.all([model.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean(), model.countDocuments(filter)]);
  return NextResponse.json({ success: true, data, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
}

export async function createDocument(model: Model<unknown>, request: Request) {
  const payload = await request.json();
  const data = await model.create(payload);
  return NextResponse.json({ success: true, data }, { status: 201 });
}

export async function getDocument(model: Model<unknown>, id: string) {
  const data = await model.findOne({ $or: [{ _id: id }, { studentId: id }, { deptId: id }, { facultyId: id }, { subjectId: id }, { classId: id }, { attendanceId: id }, { assessmentId: id }, { predictionId: id }, { alertId: id }] }).lean();
  if (!data) return NextResponse.json({ success: false, error: "Record not found." }, { status: 404 });
  return NextResponse.json({ success: true, data });
}

export async function updateDocument(model: Model<unknown>, id: string, request: Request) {
  const data = await model.findOneAndUpdate({ $or: [{ _id: id }, { studentId: id }, { deptId: id }, { facultyId: id }, { subjectId: id }, { classId: id }, { attendanceId: id }, { assessmentId: id }, { predictionId: id }, { alertId: id }] }, await request.json(), { new: true, runValidators: true }).lean();
  if (!data) return NextResponse.json({ success: false, error: "Record not found." }, { status: 404 });
  return NextResponse.json({ success: true, data });
}

export async function deleteDocument(model: Model<unknown>, id: string) {
  const result = await model.deleteOne({ $or: [{ _id: id }, { studentId: id }, { deptId: id }, { facultyId: id }, { subjectId: id }, { classId: id }, { attendanceId: id }, { assessmentId: id }, { predictionId: id }, { alertId: id }] });
  if (!result.deletedCount) return NextResponse.json({ success: false, error: "Record not found." }, { status: 404 });
  return NextResponse.json({ success: true, data: { deleted: true } });
}

export function apiError() {
  return NextResponse.json({ success: false, error: "Request could not be completed." }, { status: 400 });
}
