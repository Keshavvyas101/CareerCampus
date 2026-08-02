import { GoogleGenerativeAI } from "@google/generative-ai";
import MockInterview from "../models/MockInterview.js";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 1. Get next question
export const askNextQuestion = async (req, res) => {
  try {
    const { role, company, jobDescription, transcript, totalQuestions } = req.body;

    if (!role || !jobDescription) {
      return res.status(400).json({ message: "Role and Job Description are required." });
    }

    const currentQuestionIndex = (transcript ? transcript.length : 0) + 1;
    let historyText = "";
    if (transcript && transcript.length > 0) {
      historyText = transcript
        .map((t, idx) => `Q${idx + 1}: ${t.question}\nA${idx + 1}: ${t.answer}`)
        .join("\n\n");
    } else {
      historyText = "No history. This is the first question.";
    }

    const prompt = `
You are a professional hiring manager and interviewer conducting a mock interview for the role: "${role}" ${company ? `at the company: "${company}"` : ""}.
Job Description:
${jobDescription}

Here is the interview dialogue history so far:
${historyText}

This is question number ${currentQuestionIndex} out of ${totalQuestions || 5}.
Based on the job description and previous candidate answers, generate the next interview question. If there is dialogue history, make sure to ask a logical follow-up or test their depth. If history is empty, ask a strong opening question relevant to the role.

Rules:
- Output ONLY the question text itself. Do not include any introductory chit-chat, notes, or labels like "Interviewer:" or "Question:".
- Do not repeat questions already asked.
- Ask one question at a time.
`.trim();

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const question = result.response?.text().trim() || "Can you tell me about your background and experience?";

    return res.json({ question });
  } catch (error) {
    console.error("Error generating question:", error);
    return res.status(500).json({ message: "Server error during question generation", error: error.message });
  }
};

// 2. Evaluate completed interview
export const evaluateInterview = async (req, res) => {
  try {
    const { role, company, jobDescription, transcript } = req.body;

    if (!role || !jobDescription || !transcript || transcript.length === 0) {
      return res.status(400).json({ message: "Role, Job Description, and Transcript are required." });
    }

    const transcriptText = transcript
      .map((t, idx) => `Question ${idx + 1}: ${t.question}\nAnswer ${idx + 1}: ${t.answer}`)
      .join("\n\n");

    const prompt = `
You are a professional HR specialist and senior recruiter.
Evaluate the candidate's answers in the following mock interview transcript.
Role: ${role}
Company: ${company || "Target Company"}
Job Description:
${jobDescription}

Interview Transcript:
${transcriptText}

Rules for your response:
1. You MUST start your response with the overall score in this exact format: "Overall Score: XX/100" (replace XX with a grade from 0 to 100 based on alignment with the JD).
2. Below the score, write a detailed evaluation in Markdown. Focus on constructive, professional coaching feedback.
3. Structure the Markdown report exactly as follows:
   - ### Overall Feedback
     A summary of their performance.
   - ### Key Strengths
     Bullet points highlighting what they did well.
   - ### Areas for Improvement
     Bullet points highlighting critical gaps or improvements.
   - ### Detailed Question Analysis
     For each question, show:
     * **Question [Number]**: [Question text]
     * **Your Answer**: [Candidate answer]
     * **Feedback**: [Critique of their response]
     * **Model Answer**: [An example of how an ideal candidate would answer this question]
`.trim();

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    const feedbackText = result.response?.text() || "No feedback generated.";

    // Parse score out of feedback
    const scoreMatch = feedbackText.match(/Overall Score:\s*(\d+)\/100/i);
    const score = scoreMatch ? parseInt(scoreMatch[1], 10) : 70;

    // Save mock interview evaluation to DB
    const newInterview = await MockInterview.create({
      userId: req.user._id,
      role,
      company: company || "",
      transcript,
      score,
      feedback: feedbackText,
    });

    return res.status(201).json(newInterview);
  } catch (error) {
    console.error("Error evaluating interview:", error);
    return res.status(500).json({ message: "Server error during interview evaluation", error: error.message });
  }
};

// 3. Get past interview history
export const getInterviewHistory = async (req, res) => {
  try {
    const history = await MockInterview.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.json(history);
  } catch (error) {
    console.error("Error fetching history:", error);
    return res.status(500).json({ message: "Server error while fetching history" });
  }
};
