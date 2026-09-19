"use client";

import { useEffect, useState } from "react";

export function SolidCursor() {
  const [position, setPosition] = useState({ x: -40, y: -40 });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!canHover) return;

    function onPointerMove(event: PointerEvent) {
      setPosition({ x: event.clientX, y: event.clientY });
      setVisible(true);
    }

    function onPointerLeave() {
      setVisible(false);
    }

    window.addEventListener("pointermove", onPointerMove);
    document.documentElement.addEventListener("mouseleave", onPointerLeave);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("mouseleave", onPointerLeave);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="solid-cursor"
      style={{
        opacity: visible ? 1 : 0,
        transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
      }}
    />
  );
}
