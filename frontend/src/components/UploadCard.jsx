export const UploadCard = ({
  file,
  setFile,
  onAnalyze,
  loading,
  setFeedback,
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
    <div className="bg-white shadow rounded-lg p-6 w-full max-w-xl mx-auto">
      <h2 className="text-lg font-semibold mb-4">
        Upload Resume (PDF, DOCX, TXT - Max 5MB)
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
          className="flex flex-col items-center justify-center space-y-2 cursor-pointer"
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
        <div className="mt-4 bg-gray-100 p-2 rounded flex items-center justify-between">
          <span className="text-sm text-gray-700 truncate w-64">
            {file.name}
          </span>
          <button
            onClick={() => {
              setFile(null);
              setFeedback("");
            }}
            className="text-gray-500 hover:text-red-500 text-xl"
          >
            &times;
          </button>
        </div>
      )}

      <button
        onClick={onAnalyze}
        className={`mt-4 w-full ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        } text-white py-2 rounded-md transition`}
        disabled={!file || loading}
      >
        {loading ? "Analyzing..." : "Analyze Resume"}
      </button>
    </div>
  );
};
