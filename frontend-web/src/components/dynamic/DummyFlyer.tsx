"use client";
import { motion, MotionProps } from "framer-motion";
import { ReactNode } from "react";
import type { FlyerProps } from "@/lib/types";

export default function Flyer({ children, className, ...rest }: FlyerProps) {
  return (
    <motion.div
      className={`
        absolute
        p-4
        rounded-md
        shadow-lg
        ${className}
      `}
      {...rest} // Pass all framer-motion props (like initial, animate)
    >
      {children}
    </motion.div>
  );
}