"use client";

import React, { useEffect, useRef } from "react";
import { FlyerData } from "@/lib/types";

type BoardFlyerProps = {
  flyer: FlyerData;
  onSelect: () => void;
  // parent will set flyer position in board coordinates
  setPosition: (x: number, y: number) => void;
  // function to get current scale (board units -> screen units)
  scaleGetter: () => number;
};

export default function BoardFlyer({ flyer, onSelect, setPosition, scaleGetter }: BoardFlyerProps) {
  const elRef = useRef<HTMLDivElement | null>(null);

  // track dragging state to suppress click if move happened
  const draggingRef = useRef(false);
  const pointerIdRef = useRef<number | null>(null);
  const startPointerRef = useRef<{ x: number; y: number } | null>(null);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;

    const onPointerDown = (e: PointerEvent) => {
      // left button only for dragging flyers
      if (e.button !== 0) return;
      e.stopPropagation();
      pointerIdRef.current = e.pointerId;
      draggingRef.current = false;
      startPointerRef.current = { x: e.clientX, y: e.clientY };
      startPosRef.current = { x: flyer.x, y: flyer.y };
      try { el.setPointerCapture(e.pointerId); } catch {}
    };

    const onPointerMove = (e: PointerEvent) => {
      if (pointerIdRef.current !== e.pointerId) return;
      if (!startPointerRef.current || !startPosRef.current) return;

      const dx = e.clientX - startPointerRef.current.x;
      const dy = e.clientY - startPointerRef.current.y;

      const scale = scaleGetter() || 1;
      const boardDx = dx / scale;
      const boardDy = dy / scale;

      // If movement exceeds small threshold, consider it a drag (suppress click)
      if (!draggingRef.current && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
        draggingRef.current = true;
      }

      setPosition(startPosRef.current.x + boardDx, startPosRef.current.y + boardDy);
    };

    const onPointerUp = (e: PointerEvent) => {
      if (pointerIdRef.current !== e.pointerId) return;
      pointerIdRef.current = null;
      startPointerRef.current = null;
      startPosRef.current = null;
      try { el.releasePointerCapture(e.pointerId); } catch {}
      // keep draggingRef true only for a short moment so click is suppressed
      setTimeout(() => {
        draggingRef.current = false;
      }, 0);
    };

    el.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [flyer.x, flyer.y, setPosition, scaleGetter]);

  const handleClick = (e: React.MouseEvent) => {
    if (draggingRef.current) {
      e.stopPropagation();
      return;
    }
    onSelect();
  };

  return (
    <div
      ref={elRef}
      data-is-flyer
      onClick={handleClick}
      style={{
        position: "absolute",
        left: flyer.x,
        top: flyer.y,
        touchAction: "none", // required for pointer events to work reliably
        width: 256,
        zIndex: 20,
      }}
      className="man w-64 h-40 p-4 bg-white shadow-lg rounded-md border border-gray-200 cursor-pointer hover:shadow-xl hover:scale-105 transition-transform"
    >
      <h3 className="brico font-bold text-lg text-amber-700 truncate">
        {flyer.title}
      </h3>
      <p className="text-sm text-gray-600 truncate">{flyer.organization}</p>
      <p className="text-sm text-gray-500 mt-2 truncate">
        {flyer.description}
      </p>
    </div>
  );
}
