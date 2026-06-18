import fs from "fs";
import mammoth from "mammoth";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Initialize Gemini SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const jdGuidance = async (req, res) => {
  let filePath = null;
  try {
    console.log("📥 Resume analysis request received (Gemini Native)");

    if (!req.file) {
      return res.status(400).json({ message: "No resume file uploaded." });
    }

    filePath = req.file.path;
    let resumeText = "";
    const jobDescription = req.body.jobDescription || "";

    const isGeneralReview = !jobDescription || jobDescription.trim() === "" || jobDescription === "No job description provided.";
    let prompt = "";

    if (isGeneralReview) {
      prompt = `
You are a professional resume reviewer and career coach.
Evaluate the uploaded resume's overall quality, formatting, clarity, and strength of descriptions.

Rules:
- You MUST provide an ATS Score out of 100 at the very start in this format: "ATS Score: XX/100" (e.g., ATS Score: 85/100)
- Below the score, provide short, clear, actionable feedback points as bullet points
- Use ONLY bullet points for the feedback points
- One sentence per bullet

Format:
ATS Score: XX/100
- First feedback point
- Second feedback point
- Third feedback point
`;
    } else {
      prompt = `
You are a professional ATS (Applicant Tracking System) reviewer and recruiter.
Evaluate the uploaded resume against the provided job description. Measure key alignment, missing skills, keyword matching, and qualifications.

Rules:
- You MUST provide an ATS Score out of 100 at the very start in this format: "ATS Score: XX/100" (e.g., ATS Score: 72/100)
- Below the score, provide short, clear, actionable feedback points as bullet points on keywords, missing skills, and fit gaps
- Use ONLY bullet points for the feedback points
- One sentence per bullet

Job Description:
${jobDescription}

Format:
ATS Score: XX/100
- First feedback point
- Second feedback point
- Third feedback point
`;
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    let result;

    if (req.file.mimetype === "application/pdf") {
      // Use Gemini native PDF understanding by passing inlineData
      const pdfBuffer = await fs.promises.readFile(filePath);
      const pdfPart = {
        inlineData: {
          data: pdfBuffer.toString("base64"),
          mimeType: "application/pdf",
        },
      };
      result = await model.generateContent([pdfPart, prompt]);
    } else {
      // For DOCX or text/plain, extract text and pass it in the prompt
      if (
        req.file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const docxResult = await mammoth.extractRawText({ path: filePath });
        resumeText = docxResult.value;
      } else if (req.file.mimetype === "text/plain") {
        resumeText = await fs.promises.readFile(filePath, "utf8");
      } else {
        if (fs.existsSync(filePath)) {
          await fs.promises.unlink(filePath);
        }
        filePath = null;
        return res.status(400).json({ message: "Unsupported file format." });
      }

      const promptWithResume = `
${prompt}

Resume Text:
${resumeText}
`.trim();
      result = await model.generateContent(promptWithResume);
    }

    // Safely delete the uploaded file immediately after calling Gemini
    if (filePath && fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      filePath = null;
    }

    const feedback = result.response?.text() || "No feedback generated.";
    console.log("✅ Gemini response received successfully");

    return res.json({ feedback });
  } catch (err) {
    console.error("❌ Resume analysis failed:", err);

    if (filePath && fs.existsSync(filePath)) {
      try {
        await fs.promises.unlink(filePath);
      } catch (unlinkErr) {
        console.error("Failed to delete file on error:", unlinkErr);
      }
    }

    return res.status(500).json({
      message: "Unexpected server error during analysis",
      error: err.message,
    });
  }
};