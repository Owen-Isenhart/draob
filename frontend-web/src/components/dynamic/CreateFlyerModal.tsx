// src/components/dynamic/CreateFlyerModal.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaImage, FaKeyboard } from "react-icons/fa";
import { FlyerData } from "@/lib/types";

// Omit id, x, and y, as the parent will set those
type NewFlyerData = Omit<FlyerData, "id" | "x" | "y">;

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewFlyerData) => void;
};

export default function CreateFlyerModal({ isOpen, onClose, onSubmit }: ModalProps) {
  const [tab, setTab] = useState<"form" | "upload">("form");

  const [formData, setFormData] = useState<NewFlyerData>({
    title: "",
    organization: "",
    description: "",
    location: "",
    time: "",
    user: 0,
    type: 0,
    images: null,
  });

  const handleFieldChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFormData((prev) => ({
      ...prev,
      images: Array.from(e.target!.files!), // store File[]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);

    // Reset form and close
    setFormData({
      title: "",
      organization: "",
      description: "",
      location: "",
      time: "",
      user: 0,
      type: 0,
      images: null,
    });

    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="man fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="brico text-xl font-bold">Create a New Flyer</h2>
              <button onClick={onClose} className="p-2 rounded-md hover:bg-gray-100">
                <FaTimes />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b">
              <button
                onClick={() => setTab("form")}
                className={`flex-1 p-3 flex items-center justify-center gap-2 ${
                  tab === "form"
                    ? "border-b-2 border-amber-700 text-amber-700"
                    : "text-gray-500"
                }`}
              >
                <FaKeyboard /> Fill Form
              </button>

              <button
                onClick={() => setTab("upload")}
                className={`flex-1 p-3 flex items-center justify-center gap-2 ${
                  tab === "upload"
                    ? "border-b-2 border-amber-700 text-amber-700"
                    : "text-gray-500"
                }`}
              >
                <FaImage /> Upload Images
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* ---- FORM TAB ---- */}
              {tab === "form" && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-500">Title</label>
                    <input
                      type="text"
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleFieldChange}
                      className="man w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-500">
                      Organization
                    </label>
                    <input
                      type="text"
                      name="organization"
                      required
                      value={formData.organization}
                      onChange={handleFieldChange}
                      className="man w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-500">Location</label>
                    <input
                      type="text"
                      name="location"
                      required
                      value={formData.location}
                      onChange={handleFieldChange}
                      className="man w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-500">
                      Description
                    </label>
                    <textarea
                      name="description"
                      required
                      value={formData.description}
                      onChange={handleFieldChange}
                      rows={3}
                      className="man w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-500">Type</label>
                    <input
                      type="number"
                      name="type"
                      required
                      value={formData.type}
                      onChange={handleFieldChange}
                      className="man w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  {/* IMAGE UPLOAD FIELD — NOT A TEXTAREA */}
                  <div>
                    <label className="text-sm font-semibold text-gray-500">Images</label>
                    <input
                      type="file"
                      name="images"
                      multiple
                      accept="image/*"
                      onChange={handleImageChange}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-700 py-2 px-4 border border-amber-700 text-white rounded-md hover:bg-white hover:text-black transition-all duration-300"
                  >
                    Post Flyer
                  </button>
                </form>
              )}

              {/* ---- UPLOAD TAB ---- */}
              {tab === "upload" && (
                <div className="text-center p-8 border border-dashed rounded-md">
                  <FaImage className="mx-auto w-12 h-12 text-gray-300" />

                  {formData.images ? (
                    <p className="mt-2 text-gray-700">
                      {formData.images.length} image(s) selected
                    </p>
                  ) : (
                    <p className="mt-2 text-gray-500">No images uploaded yet</p>
                  )}

                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-4"
                  />
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
