import type { MotionProps } from "framer-motion";
import type { ElementType, ReactNode } from "react";

/**
 * From src/components/dynamic/FeatureTree.tsx
 */
export type TreeNodeData = {
  header: string;
  longHeader: string;
  paragraph: string;
};

/**
 * From src/components/dynamic/Flyer.tsx
 */
export interface FlyerProps extends MotionProps {
  children: ReactNode;
  className?: string;
}

/**
 * From src/components/dynamic/HomeFlyer.tsx
 */
export interface TabData {
  color: string;
  bgColor: string;
  href: string;
  icon: ElementType; // The icon component itself
}

/**
 * From src/components/dynamic/Tab.tsx
 */
export interface FillProps {
  x: number;
  y: number;
  color: string;
}

/**
 * From src/components/dynamic/Tab.tsx
 */
export interface TabProps {
  colorClass: string; // Tailwind class for hover (e.g., "pink-600")
  bgColor: string;    // Hex code for fill animation (e.g., "#db2777")
  href: string;
  isFirst: boolean;
  icon: ElementType;
}

export interface FlyerData {
  id: string;
  title: string;
  organization: string;
  description: string;
  location: string;
  time: string;
  user: number;
  type: number;
  images: File[] | null;
  x: number;
  y: number;
}

export interface FlyerDataImg {
  id: string;
  img: File;
}
