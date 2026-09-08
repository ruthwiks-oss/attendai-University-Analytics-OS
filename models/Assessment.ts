import mongoose, { Schema } from "mongoose";
const schema = new Schema({ assessmentId: { type: String, unique: true, required: true }, classId: { type: String, required: true, index: true }, marks: { type: Number, min: 0, required: true }, type: { type: String, required: true }, date: { type: Date, required: true, index: true }, attendanceId: { type: String, index: true } }, { timestamps: true, collection: "assessments" });
export default mongoose.models.Assessment || mongoose.model("Assessment", schema);
