import React, {useState, useEffect, useCallback} from "react";
import {FiSearch, FiList, FiColumns} from "react-icons/fi";
import ApplicationCard from "../components/ApplicationCard";
import AddOrEditApplicationModal from "../components/AddOrEditApplicationModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import KanbanBoard from "../components/KanbanBoard";
import axios from "axios";
import {toast} from "react-hot-toast";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";


const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [viewMode, setViewMode] = useState("board"); // "board" or "list"

  const fetchApplications = useCallback(async () => {
    try {
      const query = new URLSearchParams();
      if (status) query.append("status", status);
      if (sortOrder) query.append("sort", sortOrder);

      const response = await axios.get(
        `${API_BASE_URL}/api/applications?${query.toString()}`,
        {withCredentials: true}
      );
      console.log("API RESPONSE:", response.data);


      

      const apps = Array.isArray(response.data)
    ? response.data
    : response.data.applications || response.data.data || []
     setApplications(apps);



      
    } catch (err) {
      console.error("Error fetching applications:", err);
      toast.error("Failed to fetch applications.");
    }
  }, [status, sortOrder]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

const filteredApps = Array.isArray(applications)
  ? applications.filter(
      (app) =>
        app.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.role?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  : [];


  const handleEdit = (app) => {
    setSelectedApp(app); // ✅ match backend field
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedApp(null); // ✅ reset form
  };

  const handleStatusChange = async (appId, newStatus) => {
    // 1. Save original applications state in case of rollback
    const originalApps = [...applications];

    // 2. Optimistically update local UI state
    setApplications((prevApps) =>
      prevApps.map((app) =>
        app._id === appId ? { ...app, status: newStatus } : app
      )
    );

    try {
      // 3. Make PUT request to backend to update status
      const response = await axios.put(
        `${API_BASE_URL}/api/applications/${appId}`,
        { status: newStatus },
        { withCredentials: true }
      );

      if (response.status === 200 || response.status === 204 || response.data) {
        toast.success(`Moved application to ${newStatus}`);
      } else {
        throw new Error("Invalid status code");
      }
    } catch (err) {
      console.error("Error updating application status:", err);
      toast.error("Failed to update status on server.");
      // Rollback on failure
      setApplications(originalApps);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 px-6 py-8">
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-blue-900">
          Job Applications Dashboard
        </h1>
        <p className="text-gray-700 mt-1">
          Track and manage all your job applications efficiently.
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full md:w-4/5">
          <div className="relative">
            <FiSearch className="absolute top-3.5 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search company or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            disabled={viewMode === "board"} // Disable status filter in Board view since all statuses are visible
            className={`px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 ${
              viewMode === "board" ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-gray-700"
            }`}
          >
            <option value="">All Statuses</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Rejected">Rejected</option>
            <option value="Offer">Offer</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 bg-white text-gray-700"
          >
            <option value="asc">Date: Ascending</option>
            <option value="desc">Date: Descending</option>
          </select>
        </div>

        <div className="flex items-center space-x-3 self-stretch md:self-auto justify-between md:justify-start">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-gray-200/80 p-1 rounded-lg">
            <button
              onClick={() => setViewMode("list")}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium transition ${
                viewMode === "list"
                  ? "bg-white text-blue-600 shadow-sm font-semibold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              title="List View"
            >
              <FiList className="shrink-0" />
              <span className="hidden sm:inline">List</span>
            </button>
            <button
              onClick={() => setViewMode("board")}
              className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm font-medium transition ${
                viewMode === "board"
                  ? "bg-white text-blue-600 shadow-sm font-semibold"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              title="Kanban Board View"
            >
              <FiColumns className="shrink-0" />
              <span className="hidden sm:inline">Board</span>
            </button>
          </div>

          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md transition font-semibold"
            onClick={() => {
              setSelectedApp(null); // Reset form
              setShowModal(true);
            }}
          >
            + Add New
          </button>
        </div>
      </div>

      {viewMode === "list" ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredApps.length > 0 ? (
            filteredApps.map((app) => (
              <ApplicationCard
                key={app._id}
                id={app._id}
                position={app.role}
                company={app.company}
                notes={app.notes}
                status={app.status}
                dateApplied={app.dateApplied}
                refreshApplications={fetchApplications}
                setShowDeleteModal={setShowDeleteModal}
                setSelectedAppId={setSelectedAppId}
                onEdit={() => handleEdit(app)}
              />
            ))
          ) : (
            <p className="text-center col-span-full text-gray-500 py-12">
              No applications found.
            </p>
          )}
        </div>
      ) : (
        <KanbanBoard
          applications={filteredApps}
          onStatusChange={handleStatusChange}
          onEdit={handleEdit}
          setShowDeleteModal={setShowDeleteModal}
          setSelectedAppId={setSelectedAppId}
        />
      )}

      <AddOrEditApplicationModal
        show={showModal}
        onClose={handleModalClose}
        refreshApplications={fetchApplications}
        selectedApp={selectedApp}
      />

      <ConfirmDeleteModal
        id={selectedAppId}
        setShowDeleteModal={setShowDeleteModal}
        showDeleteModal={showDeleteModal}
        refreshApplications={fetchApplications}
        showToast={(msg) => toast.success(msg)}
      />
    </div>
  );
};

export default Dashboard;
