import React, {useState, useEffect, useCallback} from "react";
import {FiSearch} from "react-icons/fi";
import ApplicationCard from "../components/ApplicationCard";
import AddOrEditApplicationModal from "../components/AddOrEditApplicationModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import axios from "axios";
import {toast} from "react-hot-toast";
const API_BASE_URL =process.env.REACT_APP_API_BASE_URL;

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);

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
            className="px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
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
            className="px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
          >
            <option value="asc">Date: Ascending</option>
            <option value="desc">Date: Descending</option>
          </select>
        </div>

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-md transition"
          onClick={() => {
            setSelectedApp(null); // Reset form
            setShowModal(true);
          }}
        >
          + Add New Application
        </button>
      </div>

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
          <p className="text-center col-span-full text-gray-500">
            No applications found.
          </p>
        )}
      </div>

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
