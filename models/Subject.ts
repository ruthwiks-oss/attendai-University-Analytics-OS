import mongoose, { Schema } from "mongoose";
const schema = new Schema({ subjectId: { type: String, unique: true, required: true }, subjectName: { type: String, required: true }, credits: { type: Number, min: 1, required: true }, facultyId: { type: String, required: true, index: true } }, { timestamps: true, collection: "subjects" });
export default mongoose.models.Subject || mongoose.model("Subject", schema);
