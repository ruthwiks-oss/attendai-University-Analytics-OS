import mongoose, { Schema } from "mongoose";
const schema = new Schema({ predictionId: { type: String, unique: true, required: true }, studentId: { type: String, required: true, index: true }, predictedAttendance: { type: Number, min: 0, max: 100, required: true }, riskLevel: { type: String, enum: ["LOW", "MEDIUM", "HIGH"], required: true, index: true }, generatedDate: { type: Date, required: true, index: true } }, { timestamps: true, collection: "predictions" });
export default mongoose.models.Prediction || mongoose.model("Prediction", schema);
