"use client";
import { motion, PanInfo } from "framer-motion";
import { useState, ElementType } from "react"; // 1. Import ElementType
import { useRouter } from "next/navigation";

interface TabProps {
  color: string;
  href: string;
  isFirst: boolean;
  icon: ElementType; // 2. Accept the icon prop
}

const colorMap: Record<string, string> = {
  "pink-600": "group-hover:text-pink-600",
  "blue-500": "group-hover:text-blue-500",
  "emerald-500": "group-hover:text-emerald-500",
  "yellow-500": "group-hover:text-yellow-500",
  "gray-800": "group-hover:text-gray-800",
  "sky-500": "group-hover:text-sky-500",
};


export default function Tab({ color, href, isFirst, icon: Icon }: TabProps) { // 3. Destructure & rename icon to Icon
  const [ripped, setRipped] = useState(false);
  const router = useRouter();

  const redirect = () => {
    if (href.startsWith("http")) window.open(href, "_blank");
    else router.push(href);
  };

  const handleClick = () => {
    setRipped(true);
    setTimeout(() => {
      redirect();
      setRipped(false);
    }, 450);
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.y > 40) {
      setRipped(true);
      setTimeout(() => {
        redirect();
        setTimeout(() => setRipped(false), 200);
      }, 450);
    }
  };

  const borderClass = isFirst ? "" : "border-l border-dashed";
  const hoverClass = colorMap[color];

  return (
    <motion.div
      className={`
        group
        flex-1
        text-center
        cursor-pointer 
        bg-white
        ${borderClass}
        py-12
        text-gray-600 /* Set a base color for icons *
        active:scale-95
        select-none
        shadow-sm
        transition-colors /* Add transition for hover color */
      `}
      onClick={handleClick}
      drag="y"
      dragConstraints={{ top: 0, bottom: 80 }}
      onDragEnd={handleDragEnd}
      initial={{ y: 0, opacity: 1 }}
      animate={ripped ? { y: 80, opacity: 0 } : { y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* 5. Render the Icon component */}
      <Icon className={`w-6 h-6 mx-auto ${hoverClass}`} />
    </motion.div>
  );
}