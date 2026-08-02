import mongoose from "mongoose";

const dialogueSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const mockInterviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  role: { type: String, required: true, trim: true },
  company: { type: String, trim: true, default: "" },
  transcript: [dialogueSchema],
  score: { type: Number, required: true, min: 0, max: 100 },
  feedback: { type: String, required: true }, // will hold markdown feedback with strengths, gaps, model answers
}, {
  timestamps: true,
});

export default mongoose.model("MockInterview", mockInterviewSchema);
