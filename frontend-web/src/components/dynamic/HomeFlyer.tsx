"use client"
// to do
// make responsive

import Tab from "./Tab";
import { ElementType } from "react";

// 1. Import your icons
import {
  FaInstagram,
  FaDiscord,
  FaGithub,
  FaArrowRight,
  FaUser,
} from "react-icons/fa";
import { MdOutlineEmail } from "react-icons/md";

// 2. Define an interface for your tab data (good practice)
interface TabData {
  color: string;
  bgColor: string;
  href: string;
  icon: ElementType; // The icon component itself
}

export default function HomeFlyer() {
  // 3. Update your tabs array to include the icons
  const tabs: TabData[] = [
    { color: "pink-600", bgColor: "#db2777",href: "https://instagram.com/",icon: FaInstagram,},
    { color: "indigo-600", bgColor: "#4f46e5", href: "https://discord.com/", icon: FaDiscord }, // Was "Discord"
    { color: "emerald-600", bgColor: "#059669", href: "https://github.com/Owen-Isenhart/draob", icon: FaArrowRight,},
    { color: "red-600", bgColor: "#dc2626", href: "mailto:contact@draob.net", icon: MdOutlineEmail }, // Was "Email"
    { color: "gray-800", bgColor: "#1f2937", href: "https://github.com/Owen-Isenhart/draob", icon: FaGithub }, // Was "GitHub"
    { color: "sky-600", bgColor: "#0284c7", href: "/about", icon: FaUser }, // Was "About"
  ];

  return (
    <div className="man relative w-full max-w-lg h-100 sm:h-120">
      {/* ... your background divs ... */}
      <div className="-rotate-1 absolute inset-0 translate-x-2 translate-y-2 bg-gray-200 rounded-lg"></div>
      <div className="rotate-4 absolute inset-0 translate-x-1 translate-y-1 bg-gray-100 rounded-lg"></div>

      {/* Main flyer */}
      <div className="relative h-100 sm:h-120 -rotate-2 bg-white rounded-lg shadow-lg flex flex-col">
        {/* Content */}
        <div className="flex-grow">
          <h1 className="text-5xl sm:text-6xl font-bold pt-8 px-8">
            Your Campus,<br></br>One Board.
          </h1>
          <p className="text-lg sm:text-xl p-8">
            Advertise events, student organizations, and more!
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-8 border-t border-dashed flex w-full">
          {tabs.map((tab, i) => (
            <Tab
              key={i}
              colorClass={tab.color}
              bgColor={tab.bgColor}
              href={tab.href}
              icon={tab.icon}
              isFirst={i === 0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}