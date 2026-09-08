import mongoose, { Schema } from "mongoose";
const schema = new Schema({ name: { type: String, required: true }, username: { type: String, unique: true, sparse: true }, email: { type: String, unique: true, required: true }, passwordHash: { type: String, required: true }, role: { type: String, enum: ["ADMIN", "FACULTY", "STUDENT"], required: true }, linkedStudentId: String, linkedFacultyId: String }, { timestamps: true, collection: "users" });
export default mongoose.models.User || mongoose.model("User", schema);
