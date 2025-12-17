import React, {useState} from "react";
import {JobFitUploadCard} from "../components/JobFitUploadCard";
import {JobFitFeedbackCard} from "../components/JobFitFeedbackCard";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export default function JDGuidance() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!file || jobDescription.trim() === "") return;

    try {
      setLoading(true);
      setFeedback(""); // clear previous

      // Simulate backend API call
      const formData = new FormData();
      formData.append("resume", file);
      formData.append("jobDescription", jobDescription);

      const response = await fetch(`${API_BASE_URL}/api/analysis/jd`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setFeedback(data.feedback); // suppose backend returns {feedback: "..."}
    } catch (error) {
      console.error("Error analyzing fit:", error);
      setFeedback("An error occurred while analyzing the fit.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Job Description Guidance
        </h1>
        <p className="text-gray-500">
          Upload your resume and paste a job description to get AI-driven
          insights on how to tailor your application for the best fit.
        </p>
        <hr className="mt-4 border-gray-300" />
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upload + Job Desc */}
        <JobFitUploadCard
          file={file}
          setFile={setFile}
          jobDescription={jobDescription}
          setJobDescription={setJobDescription}
          onAnalyze={handleAnalyze}
          loading={loading}
          setFeedback={setFeedback}
        />
        {/* Feedback */}
        <JobFitFeedbackCard feedback={feedback} loading={loading} />
      </div>
    </div>
  );
}
