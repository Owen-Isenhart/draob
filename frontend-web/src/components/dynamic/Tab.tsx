"use client";
import { motion, PanInfo } from "framer-motion";
import { useState, ElementType, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import Link from "next/link"; // Added Link import

// --- Full Screen Fill Animation Component ---

interface FillProps {
  x: number;
  y: number;
  color: string;
}

const FullScreenFill = ({ x, y, color }: FillProps) => {
  const [endRadius, setEndRadius] = useState(0);

  useEffect(() => {
    // Calculate the distance to the farthest corner to ensure the circle covers the screen
    const farthestX = x > window.innerWidth / 2 ? 0 : window.innerWidth;
    const farthestY = y > window.innerHeight / 2 ? 0 : window.innerHeight;
    const radius = Math.hypot(farthestX - x, farthestY - y);
    setEndRadius(radius);
  }, [x, y]);

  // Don't render until we have the radius to avoid a flash
  if (endRadius === 0) return null;

  return (
    <motion.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: color,
        zIndex: 9998, // High z-index to cover everything
      }}
      initial={{
        clipPath: `circle(0px at ${x}px ${y}px)`,
      }}
      animate={{
        clipPath: `circle(${endRadius}px at ${x}px ${y}px)`,
      }}
      transition={{ duration: 0.4, ease: "easeOut" }} // "quick" animation
    />
  );
};


// --- Tab Component ---

interface TabProps {
  colorClass: string; // Tailwind class for hover (e.g., "pink-600")
  bgColor: string;    // Hex code for fill animation (e.g., "#db2777")
  href: string;
  isFirst: boolean;
  icon: ElementType;
}

const colorMap: Record<string, string> = {
  "pink-600": "group-hover:text-pink-600",
  "indigo-600": "group-hover:text-indigo-600",
  "emerald-600": "group-hover:text-emerald-600",
  "red-600": "group-hover:text-red-600",
  "gray-800": "group-hover:text-gray-800",
  "sky-600": "group-hover:text-sky-600",
};


export default function Tab({ colorClass, bgColor, href, isFirst, icon: Icon }: TabProps) {
  const [ripped, setRipped] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [fillAnimation, setFillAnimation] = useState<FillProps | null>(null);
  const router = useRouter(); // Keep router for programmatic navigation

  // Ensure document.body is available for the portal
  useEffect(() => {
    setIsClient(true);
  }, []);

  const redirect = () => {
    if (href.startsWith("http")) window.open(href, "_blank");
    else router.push(href); // This is still needed for after the animation
  };

  // Shared function to trigger all animations and navigation
  const triggerAnimation = (x: number, y: number) => {
    setRipped(true);
    setFillAnimation({ x, y, color: bgColor }); // Trigger fill animation

    setTimeout(() => {
      redirect();
    }, 450); // Redirect after fill animation (400ms) + small buffer

    // Reset state after navigation (browser will handle most cleanup)
    setTimeout(() => {
      setRipped(false);
      setFillAnimation(null);
    }, 650);
  };

  const handleClick = (e: React.MouseEvent) => {
    // Prevent Link's default navigation to let the animation run
    if (!href.startsWith("http")) {
      e.preventDefault();
    }
    triggerAnimation(e.clientX, e.clientY);
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.y > 40) {
      triggerAnimation(info.point.x, info.point.y); // Use final pointer coords
    }
  };

  const borderClass = isFirst ? "" : "border-l border-dashed";
  // Use colorClass for the hover effect
  const hoverClass = colorMap[colorClass];
  const isExternal = href.startsWith("http");

  // Define the motion component separately to avoid repetition
  const tabContent = (
    <motion.div
      className={`
        group
        /* flex-1 is now on the wrapper */
        w-full h-full /* Fill the wrapper */
        flex flex-col justify-center /* Re-center icon */
        text-center
        cursor-pointer 
        bg-white
        ${borderClass}
        py-12
        text-gray-600
        active:scale-95
        select-none
        shadow-sm
        transition-colors
        relative /* Ensure z-index works */
        z-10 /* Keep tab above other elements */
      `}
      drag="y"
      dragConstraints={{ top: 0, bottom: 80 }}
      onDragEnd={handleDragEnd}
      initial={{ y: 0, opacity: 1 }}
      animate={ripped ? { y: 80, opacity: 0, zIndex: 9999 } : { y: 0, opacity: 1, zIndex: 10 }}
      transition={{ duration: 0.4 }}
    >
      <Icon className={`w-6 h-6 mx-auto ${hoverClass}`} />
    </motion.div>
  );

  return (
    <>
      {/* Wrap the content in a Next.js Link for internal routes (for prefetching)
        or a simple div for external routes.
        The onClick handler is moved to this wrapper.
      */}
      {isExternal ? (
        <div onClick={handleClick} className="flex-1">
          {tabContent}
        </div>
      ) : (
        <Link href={href} onClick={handleClick} className="flex-1">
          {tabContent}
        </Link>
      )}

      {/* Portal for the full-screen fill animation */}
      {isClient && fillAnimation && createPortal(
        <FullScreenFill
          x={fillAnimation.x}
          y={fillAnimation.y}
          color={fillAnimation.color}
        />,
        document.body
      )}
    </>
  );
}