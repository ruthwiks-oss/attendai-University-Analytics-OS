import mongoose, { Schema } from "mongoose";
const schema = new Schema({ attendanceId: { type: String, unique: true, required: true }, studentId: { type: String, required: true, index: true }, classId: { type: String, required: true, index: true }, status: { type: String, enum: ["PRESENT", "ABSENT"], required: true }, date: { type: Date, required: true, index: true } }, { timestamps: true, collection: "attendance" });
schema.index({ studentId: 1, classId: 1 }, { unique: true });
export default mongoose.models.Attendance || mongoose.model("Attendance", schema);
