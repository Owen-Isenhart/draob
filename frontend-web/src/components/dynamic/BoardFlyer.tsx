// src/components/dynamic/BoardFlyer.tsx
"use client";

import { motion, PanInfo } from "framer-motion";
import { FlyerData } from "@/lib/types";

type BoardFlyerProps = {
  flyer: FlyerData;
  onClick: () => void;
  onDragEnd: (info: PanInfo) => void; // Prop to update state in parent
  constraintsRef: React.RefObject<HTMLDivElement | null>; // The board boundaries
};

export default function BoardFlyer({
  flyer,
  onClick,
  onDragEnd,
  constraintsRef,
}: BoardFlyerProps) {
  return (
    <motion.div
      style={{
        position: "absolute",
        left: flyer.x,
        top: flyer.y,
        touchAction: "none",
      }}
      drag // <-- 2. ENABLED DRAG
      dragConstraints={constraintsRef} // Keep inside the main canvas
      dragElastic={0.1}
      onDragEnd={(e, info) => onDragEnd(info)} // Pass drag info to parent
      onDragStart={(e) => e.stopPropagation()} // Prevent canvas from dragging
      onClick={onClick}
      className="man w-64 h-40 p-4 bg-white shadow-lg rounded-md border border-gray-200 cursor-pointer hover:shadow-xl hover:scale-105 transition-all"
    >
      <h3 className="brico font-bold text-lg text-amber-700 truncate">
        {flyer.title}
      </h3>
      <p className="text-sm text-gray-600 truncate">{flyer.organization}</p>
      <p className="text-sm text-gray-500 mt-2 truncate">
        {flyer.description}
      </p>
    </motion.div>
  );
}