import mongoose, { Schema } from "mongoose";
const schema = new Schema({ classId: { type: String, unique: true, required: true }, date: { type: Date, required: true, index: true }, time: { type: String, required: true }, roomNo: { type: String, required: true }, subjectId: { type: String, required: true, index: true } }, { timestamps: true, collection: "classes" });
export default mongoose.models.ClassSession || mongoose.model("ClassSession", schema);
