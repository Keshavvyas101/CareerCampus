import React, { useState } from "react";
import api from "../services/api";
import { toast } from "react-hot-toast";
import { FiPlay, FiSend, FiAward, FiClock, FiBookOpen } from "react-icons/fi";

export default function InterviewSimulator() {
  // Setup inputs
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [totalQuestions, setTotalQuestions] = useState(5);

  // Active state
  const [stage, setStage] = useState("setup"); // "setup", "interviewing", "evaluating", "result"
  const [transcript, setTranscript] = useState([]); // [{ question, answer }]
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  // Result state
  const [evaluation, setEvaluation] = useState(null); // { score, feedback }

  // 1. Start the interview
  const handleStart = async (e) => {
    e.preventDefault();
    if (!role.trim() || !jobDescription.trim()) {
      toast.error("Please fill in the Role and Job Description.");
      return;
    }

    setLoading(true);
    setStage("interviewing");
    setTranscript([]);
    setCurrentQuestion("");
    setUserAnswer("");

    try {
      const response = await api.post("/interview/next", {
        role,
        company,
        jobDescription,
        transcript: [],
        totalQuestions,
      });
      setCurrentQuestion(response.data.question);
    } catch (err) {
      console.error(err);
      toast.error("Failed to start the interview.");
      setStage("setup");
    } finally {
      setLoading(false);
    }
  };

  // 2. Submit response to the current question
  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!userAnswer.trim()) {
      toast.error("Please enter an answer before submitting.");
      return;
    }

    const updatedTranscript = [...transcript, { question: currentQuestion, answer: userAnswer }];
    setTranscript(updatedTranscript);
    setUserAnswer("");

    if (updatedTranscript.length >= totalQuestions) {
      // End of interview - trigger evaluation
      handleEvaluate(updatedTranscript);
    } else {
      // Get next question
      setLoading(true);
      try {
        const response = await api.post("/interview/next", {
          role,
          company,
          jobDescription,
          transcript: updatedTranscript,
          totalQuestions,
        });
        setCurrentQuestion(response.data.question);
      } catch (err) {
        console.error(err);
        toast.error("Error fetching the next question.");
      } finally {
        setLoading(false);
      }
    }
  };

  // 3. Request evaluation from backend
  const handleEvaluate = async (finalTranscript) => {
    setStage("evaluating");
    setLoading(true);

    try {
      const response = await api.post("/interview/evaluate", {
        role,
        company,
        jobDescription,
        transcript: finalTranscript,
      });
      setEvaluation(response.data);
      setStage("result");
    } catch (err) {
      console.error(err);
      toast.error("Evaluation failed. Please try again.");
      setStage("interviewing");
    } finally {
      setLoading(false);
    }
  };

  // Helper to color-code score
  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  // Helper to split markdown sections into neat UI boxes
  const renderFeedbackSections = (text) => {
    if (!text) return null;

    // Remove the "Overall Score: XX/100" header
    const cleanText = text.replace(/Overall Score:\s*\d+\/100/i, "").trim();

    // Split by headers (e.g. ### Header Name)
    const sections = cleanText.split(/###\s+/);

    return (
      <div className="space-y-6">
        {sections.map((section, idx) => {
          if (!section.trim()) return null;

          const lines = section.split("\n");
          const title = lines[0].trim();
          const content = lines.slice(1).join("\n").trim();

          return (
            <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-blue-50/50 px-5 py-3.5 border-b border-gray-200/60 flex items-center">
                <FiBookOpen className="text-blue-500 mr-2 shrink-0 animate-pulse" />
                <h3 className="font-bold text-gray-800 text-sm md:text-base uppercase tracking-wide">
                  {title}
                </h3>
              </div>
              <div className="p-5 text-gray-700 text-sm md:text-base leading-relaxed whitespace-pre-wrap font-sans">
                {content}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-slate-50 to-indigo-50 p-6 md:p-8">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-blue-900 flex items-center justify-center gap-2">
          <FiAward className="text-indigo-600 animate-bounce" />
          AI Mock Interview Simulator
        </h1>
        <p className="text-gray-600 mt-2 max-w-xl mx-auto text-sm md:text-base">
          Practice dynamic, conversational interviews tailored to your target job description and get immediate grading.
        </p>
      </div>

      {/* Main Container */}
      <div className="max-w-3xl mx-auto">
        
        {/* STAGE: SETUP */}
        {stage === "setup" && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 md:p-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
              <FiPlay className="text-blue-600" />
              Setup Your Interview
            </h2>

            <form onSubmit={handleStart} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Target Role / Job Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Frontend Engineer"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Company Name <span className="text-xs text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Google"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Job Description (JD)
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder="Paste the job description or requirement list here to train the AI interviewer..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none font-sans"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Number of Questions
                </label>
                <select
                  value={totalQuestions}
                  onChange={(e) => setTotalQuestions(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white"
                >
                  <option value={3}>3 Questions (Quick Practice)</option>
                  <option value={5}>5 Questions (Standard Practice)</option>
                  <option value={10}>10 Questions (Complete Interview)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transition transform active:scale-98 disabled:opacity-50 mt-4 flex items-center justify-center gap-2 text-base"
              >
                {loading ? "Generating Starter Question..." : "Start Mock Interview"}
              </button>
            </form>
          </div>
        )}

        {/* STAGE: INTERVIEWING */}
        {stage === "interviewing" && (
          <div className="space-y-6">
            {/* Progress Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 px-5 py-3 flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">
                Interview for: <strong className="text-gray-800">{role}</strong> {company && `at ${company}`}
              </span>
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                <FiClock />
                Q: {transcript.length + 1} / {totalQuestions}
              </span>
            </div>

            {/* Conversation Flow */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 space-y-6">
              {/* Question Bubble */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-md shrink-0 select-none animate-pulse">
                  AI
                </div>
                <div className="flex-1 bg-blue-50/80 rounded-2xl px-5 py-4 border border-blue-100 shadow-sm">
                  <span className="block text-[11px] font-bold text-blue-500 uppercase tracking-wide mb-1">
                    Interviewer
                  </span>
                  <p className="text-gray-800 text-base md:text-lg leading-relaxed font-semibold">
                    {currentQuestion || "Thinking of the next question..."}
                  </p>
                </div>
              </div>

              {/* Loader */}
              {loading && (
                <div className="flex gap-4 items-center pl-14 text-sm text-gray-500">
                  <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-ping" />
                  <span>AI Interviewer is formulating the next question...</span>
                </div>
              )}

              {/* Answer Input */}
              {!loading && (
                <form onSubmit={handleSubmitAnswer} className="space-y-4 pt-4 border-t border-gray-100">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                      Your Response
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="Type your response here. Speak naturally, detail your accomplishments, and hit submit..."
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none font-sans text-base leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2"
                  >
                    <FiSend />
                    {transcript.length + 1 >= totalQuestions ? "Submit & Evaluate Interview" : "Submit Answer"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* STAGE: EVALUATING */}
        {stage === "evaluating" && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center space-y-6">
            <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
              <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-20 animate-ping" />
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg font-bold text-xl">
                Grading
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Generating Interview Performance Report
            </h2>
            <p className="text-gray-500 max-w-md mx-auto text-sm md:text-base">
              Gemini is reviewing your responses, evaluating skill alignment, measuring core competencies, and assembling customized model answers. This takes about 10-15 seconds.
            </p>
          </div>
        )}

        {/* STAGE: RESULT */}
        {stage === "result" && evaluation && (
          <div className="space-y-6">
            {/* Score Summary Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 flex flex-col md:flex-row gap-6 items-center">
              {/* Radial Progress Score */}
              <div className={`w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center shrink-0 ${getScoreColor(evaluation.score)}`}>
                <span className="text-3xl font-extrabold">{evaluation.score}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mt-0.5">Score</span>
              </div>

              <div className="text-center md:text-left space-y-2">
                <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Evaluation Completed
                </span>
                <h2 className="text-2xl font-bold text-gray-800">
                  {role} Interview Performance
                </h2>
                <p className="text-gray-500 text-sm">
                  Feedback based on alignment against the job description.
                </p>
              </div>
            </div>

            {/* Markdown Sections Container */}
            {renderFeedbackSections(evaluation.feedback)}

            {/* Options */}
            <div className="flex gap-4">
              <button
                onClick={() => setStage("setup")}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-xl shadow-md transition text-center"
              >
                Practice Again
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
