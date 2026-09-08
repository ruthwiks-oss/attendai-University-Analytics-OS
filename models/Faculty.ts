import mongoose, { Schema } from "mongoose";
const schema = new Schema({ facultyId: { type: String, unique: true, required: true }, name: { type: String, required: true }, email: { type: String, unique: true, required: true }, designation: { type: String, required: true }, phone: String }, { timestamps: true, collection: "faculty" });
export default mongoose.models.Faculty || mongoose.model("Faculty", schema);
