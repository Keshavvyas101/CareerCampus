import fs from "fs";
import mammoth from "mammoth";
import pdf from "pdf-parse";
import axios from "axios";
import nlp from "compromise";
import { configDotenv } from "dotenv";

configDotenv();

/* ─────────────── Helpers ─────────────── */

function regexMask(text) {
  return text
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, "[EMAIL]")
    .replace(/\b\d{10}\b/g, "[PHONE]")
    .replace(/\b\d{5,6}\b/g, "[PINCODE]")
    .replace(
      /https?:\/\/(www\.)?(linkedin|github|gitlab|bitbucket|twitter|facebook)\.com\/[^\s)]+/gi,
      "[SOCIAL_LINK]"
    )
    .replace(/https?:\/\/[^\s)]+/gi, "[URL]");
}

function nerMask(text) {
  const doc = nlp(text);
  doc.people().replaceWith("[PERSON]");
  doc.places().replaceWith("[PLACE]");
  doc.organizations().replaceWith("[ORG]");
  doc.match("#Date").replaceWith("[DATE]");
  return doc.text();
}

function guessNameFromFirstLine(text) {
  const firstLine = text.split("\n")[0];
  const match = firstLine.match(/^[A-Z][a-z]+(\s+[A-Z][a-z]+){0,2}$/);
  if (match) return text.replace(match[0], "[NAME]");
  return text;
}

function maskNameSmart(text, knownName = null) {
  const doc = nlp(text);
  doc.people().replaceWith("[NAME]");
  let updated = doc.text();

  if (knownName) {
    updated = updated.replace(new RegExp(knownName, "gi"), "[NAME]");
  } else {
    updated = guessNameFromFirstLine(updated);
  }
  return updated;
}

/* ─────────────── Controller ─────────────── */

export const jdGuidance = async (req, res) => {
  try {
    console.log("📥 Resume analysis request received");

    if (!req.file) {
      return res.status(400).json({ message: "No resume file uploaded." });
    }

    const filePath = req.file.path;
    let resumeText = "";
    const jobDescription =
      req.body.jobDescription || "No job description provided.";

    /* ─── Resume extraction ─── */
    try {
      if (req.file.mimetype === "application/pdf") {
        const buffer = fs.readFileSync(filePath);
        const pdfData = await pdf(buffer);
        resumeText = pdfData.text;
      } else if (
        req.file.mimetype ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
        const result = await mammoth.extractRawText({ path: filePath });
        resumeText = result.value;
      } else if (req.file.mimetype === "text/plain") {
        resumeText = fs.readFileSync(filePath, "utf8");
      } else {
        fs.unlinkSync(filePath);
        return res.status(400).json({ message: "Unsupported file format." });
      }
    } catch (err) {
      fs.unlinkSync(filePath);
      return res.status(500).json({
        message: "Failed to extract resume text.",
        error: err.message,
      });
    }

    /* ─── Mask sensitive info ─── */
    resumeText = regexMask(resumeText);
    resumeText = nerMask(resumeText);
    resumeText = maskNameSmart(resumeText, req.body.knownName || null);

    fs.unlinkSync(filePath);
    console.log("📄 Resume processed & masked");

    /* ─── Prompt ─── */
    const prompt = `
You are a professional resume reviewer.

Given the resume and job description below, provide ATS score of resume based on job description at the top of response short, clear, and actionable feedback.

Rules:
- Use ONLY bullet points
- One sentence per bullet
- Focus on relevance, structure, grammar, and clarity
- Give ATS score out of 100 at the start

Format:
ATS Score: XX/100

Resume:
${resumeText}

Job Description:
${jobDescription}

End of response.
`.trim();

    if (!process.env.OPENROUTER_API_KEY) {
      return res.status(500).json({
        message: "OPENROUTER_API_KEY missing in .env",
      });
    }

    console.log("🧠 Sending request to OpenRouter...");

    /* ─── OpenRouter API Call ─── */
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct", // FREE & STABLE
        messages: [{ role: "user", content: prompt }],
        temperature: 0.4,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173",
          "X-Title": "CareerCompass Resume Review",
        },
        timeout: 30000,
      }
    );

    const feedback =
      response.data?.choices?.[0]?.message?.content ||
      "No feedback generated.";

    console.log("✅ OpenRouter response received");
    return res.json({ feedback });
  } catch (err) {
    console.error("❌ Resume analysis failed:", err);
    return res.status(500).json({
      message: "Unexpected server error",
      error: err.message,
    });
  }
};
