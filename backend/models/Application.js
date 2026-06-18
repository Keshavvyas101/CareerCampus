import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  company: { type: String, required: true, trim: true },
  role: { type: String, required: true, trim: true },
  status: {
    type: String,
    required: true,
    enum: ["Applied", "Interview", "Rejected", "Offer"],
    default: "Applied"
  },
  notes: { type: String, default: "Nothing", trim: true },
  dateApplied: { type: Date, required: true }
}, {
  timestamps: true,
});

export default mongoose.model("Application", applicationSchema);
