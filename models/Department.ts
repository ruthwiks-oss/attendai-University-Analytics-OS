import mongoose, { Schema } from "mongoose";
const schema = new Schema({ deptId: { type: String, unique: true, required: true }, deptName: { type: String, required: true }, hodName: { type: String, required: true }, office: { type: String, required: true } }, { timestamps: true, collection: "departments" });
export default mongoose.models.Department || mongoose.model("Department", schema);
