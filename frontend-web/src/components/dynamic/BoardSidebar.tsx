"use client";

import React, { useEffect, useState } from "react";
import { FaTimes, FaPencilAlt, FaSave } from "react-icons/fa";
import { FlyerData } from "@/lib/types";

type BoardSidebarProps = {
  flyer: FlyerData | null;
  onClose: () => void;
};

export default function BoardSidebar({ flyer, onClose }: BoardSidebarProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<FlyerData | null>(flyer);

  useEffect(() => {
    setEditData(flyer);
    setIsEditing(false);
  }, [flyer]);

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editData) return;
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    // TODO: expose onSave prop to parent to persist changes
    console.log("Saving...", editData);
    setIsEditing(false);
  };

  return (
    <aside
      className={`
        man h-full bg-white border-l border-dashed shadow-2xl
        transition-all duration-300 ease-in-out
        ${flyer ? "translate-x-0" : "translate-x-[100%]"}
      `}
      style={{ width: "100%", position: "relative", zIndex: 60 }}
    >
      <div className="flex justify-between items-center p-4 border-b border-dashed">
        <h2 className="brico text-xl font-bold">
          {isEditing ? "Editing Flyer" : "Flyer Details"}
        </h2>
        <div className="flex items-center gap-2">
          {flyer && (isEditing ? (
            <button onClick={handleSave} className="p-2 rounded-md hover:bg-gray-100">
              <FaSave className="w-5 h-5 text-green-600" />
            </button>
          ) : (
            <button onClick={() => setIsEditing(true)} className="p-2 rounded-md hover:bg-gray-100">
              <FaPencilAlt className="w-5 h-5 text-gray-600" />
            </button>
          ))}
          <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100">
            <FaTimes className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {editData ? (
        <div className="p-4 space-y-4 overflow-auto h-[calc(100%-64px)]">
          <div>
            <label className="text-sm font-semibold text-gray-500">Title</label>
            {isEditing ? (
              <input
                type="text"
                name="title"
                value={editData.title}
                onChange={handleFieldChange}
                className="man w-full p-2 border border-gray-300 rounded-md"
              />
            ) : (
              <p className="text-lg font-bold text-gray-900">{editData.title}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-500">Organization</label>
            {isEditing ? (
              <input
                type="text"
                name="organization"
                value={editData.organization}
                onChange={handleFieldChange}
                className="man w-full p-2 border border-gray-300 rounded-md"
              />
            ) : (
              <p className="text-md text-gray-700">{editData.organization}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-500">Location</label>
            {isEditing ? (
              <input
                type="text"
                name="location"
                value={editData.location}
                onChange={handleFieldChange}
                className="man w-full p-2 border border-gray-300 rounded-md"
              />
            ) : (
              <p className="text-md text-gray-700">{editData.location}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-500">Description</label>
            {isEditing ? (
              <textarea
                name="description"
                value={editData.description}
                onChange={handleFieldChange}
                rows={6}
                className="man w-full p-2 border border-gray-300 rounded-md"
              />
            ) : (
              <p className="text-md text-gray-700">{editData.description}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4">
          <p className="text-gray-500">Click a flyer to see details</p>
        </div>
      )}
    </aside>
  );
}
