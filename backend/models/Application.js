import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  userId: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  company: String,
  role: String,
  status: String,
  notes: { type: String, default:  "Nothing"},
  dateApplied: Date
});

export default mongoose.model("Application", applicationSchema);
