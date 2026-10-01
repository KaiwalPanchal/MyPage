"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function DemoCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const discRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const disc = discRef.current;
    const label = labelRef.current;
    if (!cursor) return;

    let mouseX = -100;
    let mouseY = -100;

    // Direct hardware-accelerated positioning with exact center alignment
    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      gsap.to(cursor, {
        x: mouseX,
        y: mouseY,
        xPercent: -50,
        yPercent: -50,
        duration: 0.12,
        ease: "power2.out",
        overwrite: "auto",
      });

      if (cursor.style.opacity !== "1") {
        cursor.style.opacity = "1";
      }
    };

    const onMouseEnter = () => {
      if (cursor) cursor.style.opacity = "1";
    };

    const onMouseLeave = () => {
      if (cursor) cursor.style.opacity = "0";
    };

    // Contextual hover listener
    const onElementOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest("a, button, [data-interactive], [data-cursor-label]");
      if (interactive) {
        gsap.to(disc, {
          scale: 1.35,
          duration: 0.3,
          ease: "back.out(2)",
        });

        const customLabel = interactive.getAttribute("data-cursor-label");
        if (customLabel && label) {
          label.textContent = customLabel;
          label.style.opacity = "1";
          label.style.visibility = "visible";
        }
      }
    };

    const onElementOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest("a, button, [data-interactive], [data-cursor-label]");
      if (interactive) {
        gsap.to(disc, {
          scale: 1,
          duration: 0.25,
          ease: "power2.out",
        });

        if (label) {
          label.style.opacity = "0";
          label.style.visibility = "hidden";
        }
      }
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseover", onElementOver);
    document.addEventListener("mouseout", onElementOut);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseover", onElementOver);
      document.removeEventListener("mouseout", onElementOut);
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="DemoCursor-wrap"
      aria-hidden="true"
    >
      <div className="DemoCursor-scaler">
        <div ref={discRef} className="DemoCursor-disc" />
        <div className="DemoCursor-cross" />
        <span ref={labelRef} className="DemoCursor-label" />
      </div>
    </div>
  );
}
