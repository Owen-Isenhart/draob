"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import BoardFlyer from "@/components/dynamic/BoardFlyer";
import BoardSidebar from "@/components/dynamic/BoardSidebar";
import CreateFlyerModal from "@/components/dynamic/CreateFlyerModal";
import { FlyerData } from "@/lib/types";

// Omit id, x, and y, as the parent will set those
type NewFlyerData = Omit<FlyerData, "id" | "x" | "y">;

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

const graphPaperStyle = {
  backgroundImage: `
    linear-gradient(to right, #e5e7eb 1px, transparent 1px),
    linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
  `,
  backgroundSize: "2rem 2rem",
  backgroundColor: "#f9fafb",
};

export default function BoardPage() {
  const [flyers, setFlyers] = useState<FlyerData[]>(initialFlyers);

  // selectedFlyer holds the currently-open flyer. null = closed.
  const [selectedFlyer, setSelectedFlyer] = useState<FlyerData | null>(null);

  // modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ----- VIEW TRANSFORMS -----
  // pan is in screen-space pixels (applied as translate)
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const scale = useMotionValue(1);
  const scaleTransform = useTransform(scale, (s) => `scale(${s})`);

  // references for pointer handling
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const isPanningRef = useRef(false);
  const panStartRef = useRef<{ x: number; y: number } | null>(null);
  const pointerIdRef = useRef<number | null>(null);

  // Sidebar width (resizable)
  const [sidebarWidth, setSidebarWidth] = useState<number>(384); // 96 * 4 (w-96)
  const sidebarMin = 240;
  const sidebarMax = 800;

  // Resize handle refs
  const sidebarResizingRef = useRef(false);
  const sidebarResizeStartRef = useRef<{ pointerX: number; startWidth: number } | null>(null);

  // ----- Helper: update flyer position (board coords) -----
  const setFlyerPosition = useCallback((id: string, newX: number, newY: number) => {
    setFlyers((prev) => prev.map((f) => (f.id === id ? { ...f, x: newX, y: newY } : f)));
  }, []);

  // Create flyer
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

  // ----- ZOOM (wheel) - zoom around mouse pointer, keep board point under cursor fixed -----
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      // Only when pointer is over viewport
      e.preventDefault();

      const rect = el.getBoundingClientRect();
      const mouseX = e.clientX - rect.left; // screen-space inside viewport
      const mouseY = e.clientY - rect.top;

      const currentScale = scale.get();
      const delta = -e.deltaY * 0.001; // invert so wheel up zooms in
      let newScale = currentScale + delta;
      newScale = Math.min(Math.max(newScale, 0.3), 2);

      // Convert screen -> board coords (board coords are what flyer positions use)
      // screen = board * scale + pan  => board = (screen - pan) / scale
      const boardX = (mouseX - pan.x) / currentScale;
      const boardY = (mouseY - pan.y) / currentScale;

      // After scale change, recompute pan so boardX,boardY remains under mouse
      const nextPanX = mouseX - boardX * newScale;
      const nextPanY = mouseY - boardY * newScale;

      scale.set(newScale);
      setPan({ x: nextPanX, y: nextPanY });
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [pan.x, pan.y, scale]);

  // ----- PANNING (Option 2): LMB on empty + MMB both pan -----
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const onPointerDown = (e: PointerEvent) => {
      // We only start panning when:
      // - left button (0) down on empty area (not on a flyer)
      // - OR middle button (1) down anywhere inside board viewport
      // Determine if target is a flyer by searching for data-is-flyer attribute
      const target = e.target as Element | null;
      const isOnFlyer = !!(target && target instanceof Element && target.closest("[data-is-flyer]"));

      if (e.button === 1) {
        // middle-button: always pan
        isPanningRef.current = true;
        pointerIdRef.current = e.pointerId;
        panStartRef.current = { x: e.clientX, y: e.clientY };
        (e.target as Element).setPointerCapture?.(e.pointerId);
      } else if (e.button === 0 && !isOnFlyer) {
        // left-button on background: pan
        isPanningRef.current = true;
        pointerIdRef.current = e.pointerId;
        panStartRef.current = { x: e.clientX, y: e.clientY };
        (e.target as Element).setPointerCapture?.(e.pointerId);
      } else {
        // otherwise don't begin panning here
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isPanningRef.current) return;
      if (pointerIdRef.current !== e.pointerId) return;
      if (!panStartRef.current) return;

      const dx = e.clientX - panStartRef.current.x;
      const dy = e.clientY - panStartRef.current.y;

      setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      panStartRef.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = (e: PointerEvent) => {
      if (isPanningRef.current && pointerIdRef.current === e.pointerId) {
        isPanningRef.current = false;
        pointerIdRef.current = null;
        panStartRef.current = null;
        try { (e.target as Element).releasePointerCapture?.(e.pointerId); } catch {}
      }
    };

    el.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  // ----- Sidebar resize handling (pointer events) -----
  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (!sidebarResizingRef.current || !sidebarResizeStartRef.current) return;
      const delta = sidebarResizeStartRef.current.pointerX - e.clientX; // moving left increases width
      const nextWidth = Math.min(Math.max(sidebarResizeStartRef.current.startWidth + delta, sidebarMin), sidebarMax);
      setSidebarWidth(nextWidth);
    };

    const onPointerUp = () => {
      if (sidebarResizingRef.current) {
        sidebarResizingRef.current = false;
        sidebarResizeStartRef.current = null;
      }
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  // start sidebar resizing (invoked by the sidebar's left handle)
  const startSidebarResize = (e: React.PointerEvent) => {
    e.stopPropagation();
    sidebarResizingRef.current = true;
    sidebarResizeStartRef.current = { pointerX: e.clientX, startWidth: sidebarWidth };
    (e.target as Element).setPointerCapture?.(e.pointerId);
  };

  // ----- Flyer selection/toggle behavior -----
  const handleFlyerClick = (flyer: FlyerData) => {
    if (!selectedFlyer) {
      // closed -> open this one
      setSelectedFlyer(flyer);
    } else if (selectedFlyer.id === flyer.id) {
      // same flyer clicked -> toggle closed
      setSelectedFlyer(null);
    } else {
      // different flyer clicked -> switch content (stay open)
      setSelectedFlyer(flyer);
    }
  };

  // Utility: provide a getter to pass current scale to flyers
  const getScale = useCallback(() => scale.get(), [scale]);

  // Graph-paper background position should follow pan (so it feels infinite).
  // We do not scale the background with zoom (Option A). So backgroundSize remains fixed.
  const bgStyle: React.CSSProperties = {
    ...graphPaperStyle,
    width: "100vw",
    height: "100vh",
    position: "absolute",
    left: 0,
    top: 0,
    // backgroundPosition moves opposite the content pan so that visually the grid moves with content.
    backgroundPosition: `${pan.x}px ${pan.y}px`,
    zIndex: 0,
  };

  return (
    <div className="w-screen h-screen relative overflow-hidden" style={{ touchAction: "none" }}>
      {/* Graph paper background (does NOT scale) */}
      <div ref={viewportRef} style={bgStyle} />

      {/* Board content layer (pan + scale applied to hold flyer positions) */}
      <div
        ref={viewportRef}
        className="absolute inset-0"
        style={{ zIndex: 5, pointerEvents: "auto" }}
        // prevent native drag
        onDragStart={(e) => e.preventDefault()}
      >
        {/* The container that applies pan in screen-space */}
        <motion.div
          className="absolute left-0 top-0"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px)`,
            width: "2000px",
            height: "2000px",
          }}
        >
          {/* The scaled board (scale applied relative to top-left) */}
          <motion.div
            className="absolute left-0 top-0"
            style={{
              transform: scaleTransform,
              transformOrigin: "top left",
              width: "2000px",
              height: "2000px",
            }}
          >
            {/* Flyers (their positions are in board coordinates) */}
            {flyers.map((flyer) => (
              <BoardFlyer
                key={flyer.id}
                flyer={flyer}
                onSelect={() => handleFlyerClick(flyer)}
                setPosition={(x: number, y: number) => setFlyerPosition(flyer.id, x, y)}
                scaleGetter={getScale}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Post button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="man absolute top-4 left-4 z-30 bg-amber-700 py-2 px-4 border border-amber-700 text-white rounded-md hover:bg-white hover:text-black transition-all duration-300"
          style={{ zIndex: 60 }}
        >
          Post a Flyer
        </button>
      </div>

      {/* Sidebar (resizable) */}
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          height: "100%",
          width: sidebarWidth,
          zIndex: 50,
          display: "flex",
          flexDirection: "row",
          transform: selectedFlyer ? "translateX(0)" : `translateX(${sidebarWidth}px)`,
          transition: "transform 180ms ease-in-out",
        }}
      >
        {/* left resize handle */}
        <div
          role="separator"
          aria-orientation="vertical"
          onPointerDown={startSidebarResize}
          style={{
            width: 8,
            cursor: "ew-resize",
            background: "transparent",
            zIndex: 70,
          }}
          className="hover:bg-gray-100"
        />

        <BoardSidebar
          flyer={selectedFlyer}
          onClose={() => setSelectedFlyer(null)}
          // pass width & resize handler so internal UI can adapt if needed
        />
      </div>

      {/* Create flyer modal */}
      <CreateFlyerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateFlyer}
      />
    </div>
  );
}
