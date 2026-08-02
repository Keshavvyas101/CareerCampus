import React, { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-hot-toast";
import { FiCalendar, FiAward, FiBookOpen, FiArrowLeft, FiGrid } from "react-icons/fi";

export default function InterviewHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInterview, setSelectedInterview] = useState(null);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const response = await api.get("/interview/history");
      setHistory(response.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load interview history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  // Custom parser to split markdown sections into visual blocks
  const renderFeedbackSections = (text) => {
    if (!text) return null;

    // Remove overall score line
    const cleanText = text.replace(/Overall Score:\s*\d+\/100/i, "").trim();
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
              <div className="bg-blue-50/50 px-5 py-3 border-b border-gray-200/60 flex items-center">
                <FiBookOpen className="text-blue-500 mr-2 shrink-0" />
                <h3 className="font-bold text-gray-800 text-xs md:text-sm uppercase tracking-wide">
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

  if (selectedInterview) {
    return (
      <div className="min-h-screen bg-slate-50 p-6 md:p-8">
        <div className="max-w-3xl mx-auto">
          {/* Back button */}
          <button
            onClick={() => setSelectedInterview(null)}
            className="flex items-center text-blue-600 hover:text-blue-800 font-bold mb-6 transition gap-1"
          >
            <FiArrowLeft /> Back to History List
          </button>

          {/* Performance Summary */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6 flex flex-col md:flex-row gap-6 items-center mb-6">
            <div className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center shrink-0 ${getScoreColor(selectedInterview.score)}`}>
              <span className="text-2xl font-extrabold">{selectedInterview.score}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mt-0.5">Score</span>
            </div>

            <div className="text-center md:text-left space-y-1">
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedInterview.role}
              </h2>
              {selectedInterview.company && (
                <p className="text-gray-600 font-medium text-sm">
                  Company: {selectedInterview.company}
                </p>
              )}
              <p className="text-gray-400 text-xs flex items-center justify-center md:justify-start gap-1">
                <FiCalendar />
                {new Date(selectedInterview.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
              </p>
            </div>
          </div>

          {/* Transcript Details */}
          {renderFeedbackSections(selectedInterview.feedback)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 border-b border-gray-200 pb-5">
          <h1 className="text-3xl font-extrabold text-blue-900 flex items-center gap-2">
            <FiAward className="text-indigo-600" />
            Interview Practice History
          </h1>
          <p className="text-gray-500 mt-1">
            Review your past mock interview evaluations, scores, and coaching notes to track progress.
          </p>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="flex justify-center items-center py-24 text-gray-500">
            <span className="w-3 h-3 bg-blue-600 rounded-full animate-ping mr-2" />
            Loading practice history...
          </div>
        ) : history.length > 0 ? (
          /* History Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {history.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <h3 className="font-bold text-gray-900 text-lg line-clamp-1" title={item.role}>
                      {item.role}
                    </h3>
                    <span className={`text-sm font-extrabold px-3 py-1 rounded-full border shrink-0 ${getScoreColor(item.score)}`}>
                      {item.score}/100
                    </span>
                  </div>

                  {item.company && (
                    <p className="text-sm font-semibold text-gray-600 mb-2">
                      Company: <span className="text-gray-800">{item.company}</span>
                    </p>
                  )}

                  <div className="flex items-center text-xs text-gray-400 mb-4 gap-1">
                    <FiCalendar className="shrink-0" />
                    <span>
                      {new Date(item.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedInterview(item)}
                  className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold py-2.5 px-4 rounded-xl text-center transition flex items-center justify-center gap-2 text-sm"
                >
                  <FiBookOpen size={16} />
                  Review Performance Report
                </button>
              </div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-16 text-center max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-4">
              <FiGrid size={24} />
            </div>
            <h3 className="font-bold text-gray-800 text-lg mb-1">No Interviews Practiced Yet</h3>
            <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
              You haven't completed any mock interviews. Start your first session to receive comprehensive performance reports.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
