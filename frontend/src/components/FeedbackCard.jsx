import React from "react";

export const FeedbackCard = ({file, loading, feedback}) => {
  // Split feedback into bullet points
  const bulletPoints = feedback
    ? feedback.split(/\n+/).filter((line) => line.trim().startsWith("-"))
    : [];

  return (
    <div className="bg-white shadow-md rounded-lg p-6 relative min-h-[300px] max-h-[700px] overflow-auto">
      <h2 className="text-xl font-semibold mb-5 text-center text-gray-900">
        Feedback for {file ? file.name : "Resume"}
      </h2>

      {loading ? (
        <div className="absolute inset-0 bg-gray-100 bg-opacity-70 flex items-center justify-center animate-pulse rounded-lg z-10">
          <p className="text-gray-600 text-base font-medium">Analyzing...</p>
        </div>
      ) : bulletPoints.length ? (
        <ul className="list-disc pl-6 text-gray-800 text-base leading-relaxed space-y-3">
          {bulletPoints.map((point, idx) => (
            <li key={idx} className="cursor-default">
              {point.slice(1).trim()}
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center text-center text-gray-500">
          <svg
            className="w-12 h-12 text-blue-400 mb-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 16h-1v-4h-1m1-4h.01M12 18.5a6.5 6.5 0 110-13 6.5 6.5 0 010 13z"
            />
          </svg>
          <p className="text-md">
            No feedback available yet. Please perform an analysis.
          </p>
        </div>
      )}
    </div>
  );
};
