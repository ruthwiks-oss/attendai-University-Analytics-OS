import mongoose, { Schema } from "mongoose";
const schema = new Schema({ alertId: { type: String, unique: true, required: true }, predictionId: { type: String, required: true, index: true }, alertType: { type: String, required: true }, alertDate: { type: Date, required: true, index: true }, message: { type: String, required: true } }, { timestamps: true, collection: "alerts" });
export default mongoose.models.Alert || mongoose.model("Alert", schema);
