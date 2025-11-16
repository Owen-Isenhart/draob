"use client";

import { useState, useCallback, useRef } from "react"; // Make sure useRef is imported
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import { FlyerData } from "@/lib/types";

// Import our components
import BoardFlyer from "@/components/dynamic/BoardFlyer";
import BoardSidebar from "@/components/dynamic/BoardSidebar";
import CreateFlyerModal from "@/components/dynamic/CreateFlyerModal";

// Omit id, x, and y, as the parent will set those
type NewFlyerData = Omit<FlyerData, "id" | "x" | "y">;

// 1. Set up initial data
const initialFlyers: FlyerData[] = [
  {
    id: "1",
    title: "ACM Kickoff",
    organization: "ACM",
    description: "Come join us for our fall kickoff event! Free food.",
    location: "ECSW 1.120",
    time: "just now",
    user: 0,
    type: 0,
    images: null,
    x: 100,
    y: 150,
  },
  {
    id: "2",
    title: "GDSC Workshop",
    organization: "Google Developer Student Club",
    description: "Learn Next.js and Framer Motion!",
    location: "ECSS 2.102",
    time: "just now",
    user: 0,
    type: 0,
    images: null,
    x: 450,
    y: 80,
  },
];

export default function BoardPage() {
  const [flyers, setFlyers] = useState<FlyerData[]>(initialFlyers);
  const [selectedFlyer, setSelectedFlyer] = useState<FlyerData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // --- FIX #1: Explicitly type the ref as HTMLDivElement ---
  const constraintsRef = useRef<HTMLDivElement>(null);

  const scale = useMotionValue(1);
  const scaleTransform = useTransform(scale, (s) => `scale(${s})`);

  const handleWheel = (event: React.WheelEvent) => {
    event.preventDefault();
    const currentScale = scale.get();
    let newScale = currentScale - event.deltaY * 0.001;
    newScale = Math.min(Math.max(newScale, 0.3), 2);
    scale.set(newScale);
  };

  const handleCreateFlyer = useCallback(
    (data: NewFlyerData) => {
      const newId = (flyers.length + 1).toString();
      const newFlyer: FlyerData = {
        ...data,
        id: newId,
        x: Math.random() * 500,
        y: Math.random() * 300,
      };
      setFlyers((prev) => [...prev, newFlyer]);
      setIsModalOpen(false);
    },
    [flyers]
  );

  const handleFlyerDragEnd = useCallback(
    (id: string, info: PanInfo) => {
      setFlyers((prevFlyers) =>
        prevFlyers.map((flyer) => {
          if (flyer.id === id) {
            return {
              ...flyer,
              x: flyer.x + info.offset.x / scale.get(),
              y: flyer.y + info.offset.y / scale.get(),
            };
          }
          return flyer;
        })
      );
    },
    [scale]
  );

  return (
    <div className="w-screen h-screen flex overflow-hidden">
      
      {/* --- FIX #2: Changed <main> to <div> to match the ref type --- */}
      <div className="flex-1 h-full relative" ref={constraintsRef}>
        
        <motion.div
          className="w-full h-full relative overflow-hidden"
          onWheel={handleWheel}
        >
          {/* This is the canvas that scales and pans */}
          <motion.div
            className="relative w-[2000px] h-[2000px] bg-gray-50"
            style={{
              transform: scaleTransform,
              transformOrigin: "top left",
            }}
            drag
            dragConstraints={constraintsRef}
            dragElastic={0.1}
          >
            {/* Render all the flyers */}
            {flyers.map((flyer) => (
              <BoardFlyer
                key={flyer.id}
                flyer={flyer}
                onClick={() => setSelectedFlyer(flyer)}
                constraintsRef={constraintsRef} // Now the type matches
                onDragEnd={(info) => handleFlyerDragEnd(flyer.id, info)}
              />
            ))}
          </motion.div>
        </motion.div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="man absolute top-4 left-4 z-10 bg-amber-700 py-2 px-4 border border-amber-700 text-white rounded-md hover:bg-white hover:text-black transition-all duration-300"
        >
          Post a Flyer
        </button>
      </div> {/* <-- This was </main> before --> */}

      {/* The Sidebar */}
      <BoardSidebar
        flyer={selectedFlyer}
        onClose={() => setSelectedFlyer(null)}
      />

      {/* The Modal */}
      <CreateFlyerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateFlyer}
      />
    </div>
  );
}