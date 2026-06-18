import React, {useState, useEffect} from "react";

export const ProfileInformationCard = ({profile, onSave, saving, loading}) => {
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    setFullName(""); // clear box after backend update
  }, [profile.fullName]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName.trim()) return;
    onSave({fullName: fullName.trim()});
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
        <svg
          className="w-5 h-5 text-blue-500"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5.121 17.804A7.5 7.5 0 1117.804 5.121a7.5 7.5 0 01-12.683 12.683z"
          />
        </svg>
        Profile Information
      </h2>
      <p className="text-gray-500 mb-4">Update your personal details.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            name="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={profile.email}
            readOnly
            className="w-full border border-gray-200 bg-gray-100 rounded-lg p-3 text-sm text-gray-500 cursor-not-allowed"
          />
        </div>

        <button
          type="submit"
          className={`mt-2 w-full ${
            saving ? "bg-gray-400" : "bg-gray-800 hover:bg-gray-900"
          } text-white py-2 rounded-md transition flex items-center justify-center gap-2`}
          disabled={saving || loading}
        >
          {saving ? (
            <span className="animate-spin border-2 border-t-transparent border-white rounded-full w-4 h-4"></span>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M17.707 10.293a1 1 0 00-1.414 0L10 16.586 3.707 10.293a1 1 0 00-1.414 1.414l7 7a1 1 0 001.414 0l7-7a1 1 0 000-1.414z" />
            </svg>
          )}
          Save Profile
        </button>
      </form>
    </div>
  );
};
