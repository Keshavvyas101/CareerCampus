import React from "react";
import axios from "axios";
import {toast} from "react-hot-toast";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const ConfirmDeleteModal = ({
  id,
  refreshApplications,
  setShowDeleteModal,
  showDeleteModal,
  showToast, // passed from Dashboard
}) => {
  if (!showDeleteModal) return null;

  const onConfirmDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/applications/${id}`, {
        withCredentials: true,
      });
      setShowDeleteModal(false);
      refreshApplications();
      if (showToast) showToast("Application deleted successfully");
    } catch (error) {
      console.error("Error deleting application:", error);
      toast.error("Failed to delete application. Please try again.");
    }
  };

  const onClose = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Confirm Deletion
        </h2>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this application? This action cannot
          be undone.
        </p>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirmDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
