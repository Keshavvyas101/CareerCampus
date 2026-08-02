import React, { useState } from "react";
import { FiCalendar, FiEdit, FiTrash2, FiClock } from "react-icons/fi";
import { MdWorkOutline } from "react-icons/md";

const COLUMNS = [
  { name: "Applied", color: "border-gray-400 text-gray-800 bg-gray-100/60 hover:bg-gray-100" },
  { name: "Interview", color: "border-blue-500 text-blue-800 bg-blue-50/60 hover:bg-blue-50" },
  { name: "Offer", color: "border-green-500 text-green-800 bg-green-50/60 hover:bg-green-50" },
  { name: "Rejected", color: "border-red-500 text-red-800 bg-red-50/60 hover:bg-red-50" },
];

export default function KanbanBoard({
  applications,
  onStatusChange,
  onEdit,
  setShowDeleteModal,
  setSelectedAppId,
}) {
  const [activeColumn, setActiveColumn] = useState(null);

  const handleDragStart = (e, appId) => {
    e.dataTransfer.setData("text/plain", appId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, columnStatus) => {
    e.preventDefault();
  };

  const handleDragEnter = (e, columnStatus) => {
    e.preventDefault();
    setActiveColumn(columnStatus);
  };

  const handleDragLeave = (e) => {
    // only reset if leaving the column wrapper
    // we don't strictly need complex logic, a simple visual toggle is enough
  };

  const handleDrop = (e, columnStatus) => {
    e.preventDefault();
    const appId = e.dataTransfer.getData("text/plain");
    if (appId) {
      onStatusChange(appId, columnStatus);
    }
    setActiveColumn(null);
  };

  const handleDragEnd = () => {
    setActiveColumn(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
      {COLUMNS.map((col) => {
        const colApps = applications.filter((app) => app.status === col.name);
        const isOver = activeColumn === col.name;

        return (
          <div
            key={col.name}
            onDragOver={(e) => handleDragOver(e, col.name)}
            onDragEnter={(e) => handleDragEnter(e, col.name)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.name)}
            className={`flex flex-col rounded-xl border-t-4 p-4 min-h-[500px] transition-all duration-200 ${
              col.color
            } ${
              isOver 
                ? "ring-2 ring-blue-400 ring-offset-2 scale-[1.01] bg-blue-50/80 shadow-md"
                : "border-gray-200 shadow-sm bg-white"
            }`}
          >
            {/* Column Header */}
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
              <h3 className="font-bold text-gray-800 text-base flex items-center">
                <span className={`inline-block w-2.5 h-2.5 rounded-full mr-2 ${
                  col.name === "Applied" ? "bg-gray-500" :
                  col.name === "Interview" ? "bg-blue-500" :
                  col.name === "Offer" ? "bg-green-500" : "bg-red-500"
                }`} />
                {col.name}
              </h3>
              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-semibold">
                {colApps.length}
              </span>
            </div>

            {/* Column Cards Container */}
            <div className="flex-1 flex flex-col gap-3">
              {colApps.length > 0 ? (
                colApps.map((app) => (
                  <div
                    key={app._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, app._id)}
                    onDragEnd={handleDragEnd}
                    className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition cursor-grab active:cursor-grabbing select-none hover:border-blue-300 group"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-gray-800 text-sm truncate max-w-[150px]" title={app.role}>
                        {app.role}
                      </h4>
                      <div className="flex items-center space-x-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onEdit(app)}
                          className="text-gray-500 hover:text-blue-600 p-0.5 rounded transition"
                          title="Edit"
                        >
                          <FiEdit size={14} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedAppId(app._id);
                            setShowDeleteModal(true);
                          }}
                          className="text-gray-500 hover:text-red-600 p-0.5 rounded transition"
                          title="Delete"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center text-xs text-gray-600 mb-2">
                      <MdWorkOutline className="mr-1 text-gray-400 shrink-0" />
                      <span className="truncate">{app.company}</span>
                    </div>

                    {app.notes && app.notes !== "Nothing" && (
                      <p className="text-xs text-gray-500 line-clamp-2 bg-gray-50 p-2 rounded mb-2 italic">
                        "{app.notes}"
                      </p>
                    )}

                    <div className="flex items-center text-[10px] text-gray-400 border-t border-gray-100 pt-2">
                      <FiCalendar className="mr-1 shrink-0" />
                      <span>
                        {app.dateApplied
                          ? new Date(app.dateApplied).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "2-digit",
                            })
                          : "Unknown"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-lg p-4 min-h-[120px] text-gray-400 text-xs">
                  <FiClock className="mb-1 text-gray-300" size={16} />
                  <span>No applications</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
