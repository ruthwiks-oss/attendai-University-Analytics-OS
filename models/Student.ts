import mongoose, { Schema } from "mongoose";
const schema = new Schema({ studentId: { type: String, unique: true, required: true }, name: { type: String, required: true }, email: { type: String, unique: true, required: true }, phone: String, dob: Date, semester: Number, section: String, deptId: { type: String, required: true, index: true } }, { timestamps: true, collection: "students" });
export default mongoose.models.Student || mongoose.model("Student", schema);
