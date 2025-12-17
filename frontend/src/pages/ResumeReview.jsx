import React, { useState } from "react";
import { UploadCard } from "../components/UploadCard";
import { FeedbackCard } from "../components/FeedbackCard";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export default function ResumeReview() {
  const [file, setFile] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setFeedback(""); // Clear previous feedback

      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", "Frontend Developer with React and Node.js");
      // 👆 Add default JD (or later make it dynamic via a text area input)

      const response = await fetch(`${API_BASE_URL}/api/analysis/jd`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Server error");
      }

      setFeedback(data.feedback || "No feedback received.");
    } catch (error) {
      console.error("Error analyzing resume:", error);
      setFeedback("An error occurred while analyzing the resume.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          AI Resume Review
        </h1>
        <p className="text-gray-500">
          Upload your resume to get AI-powered feedback on strengths,
          improvements, and key skills to highlight.
        </p>
        <hr className="mt-4 border-gray-300" />
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        <UploadCard
          file={file}
          setFile={setFile}
          onAnalyze={handleAnalyze}
          loading={loading}
          setFeedback={setFeedback}
        />
        <FeedbackCard file={file} loading={loading} feedback={feedback} />
      </div>
    </div>
  );
}
