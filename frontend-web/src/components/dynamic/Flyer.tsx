"use client";
import { motion, MotionProps } from "framer-motion";
import { ReactNode } from "react";

// Combine MotionProps with our own to allow animation props
interface FlyerProps extends MotionProps {
  children: ReactNode;
  className?: string;
}

export default function Flyer({ children, className, ...rest }: FlyerProps) {
  return (
    <motion.div
      className={`
        absolute
        p-4
        bg-white
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