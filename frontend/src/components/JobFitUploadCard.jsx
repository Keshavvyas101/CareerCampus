import React from "react";

export const JobFitUploadCard = ({
  file,
  setFile,
  jobDescription,
  setFeedback,
  setJobDescription,
  onAnalyze,
  loading,
}) => {
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-4">
        Upload Your Resume (PDF, DOCX, TXT - Max 5MB)
      </h2>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-500 transition"
      >
        <input
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleFileChange}
          className="hidden"
          id="fileUpload"
        />
        <label
          htmlFor="fileUpload"
          className="flex flex-col items-center justify-center space-y-2"
        >
          <svg
            className="w-12 h-12 text-blue-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M4 12l8-8 8 8M12 4v12"
            />
          </svg>
          <p className="text-gray-600 font-medium">
            Upload a file{" "}
            <span className="text-gray-400">or drag and drop</span>
          </p>
          <p className="text-sm text-gray-400">PDF, DOCX, TXT up to 5MB</p>
        </label>
      </div>

      {file && (
        <div className="mt-4 flex items-center justify-between bg-gray-100 p-2 rounded text-sm text-gray-700">
          <span>{file.name}</span>
          <button
            onClick={() => {
              setFile(null);
              setJobDescription("");
              setFeedback("");
            }}
            className="text-red-500 hover:text-red-700"
          >
            &times;
          </button>
        </div>
      )}

      {/* Job Description Textarea */}
      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Paste Job Description
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows="6"
          placeholder="Paste the full job description here..."
          className="w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Analyze Fit button */}
      <button
        className={`mt-4 w-full ${
          loading ? "bg-gray-400" : "bg-gray-600 hover:bg-gray-700"
        } text-white py-2 rounded-md transition flex items-center justify-center gap-2`}
        onClick={onAnalyze}
        disabled={!file || jobDescription.trim() === "" || loading}
      >
        {loading ? (
          <span className="animate-spin border-2 border-t-transparent border-white rounded-full w-4 h-4"></span>
        ) : (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        )}
        Analyze Fit
      </button>
    </div>
  );
};
