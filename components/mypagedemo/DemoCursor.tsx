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
    let lastHovered: HTMLElement | null = null;
    let rafId: number | null = null;
    let scrollTimeout: NodeJS.Timeout | null = null;

    const updateHoverState = (x: number, y: number) => {
      if (x < 0 || y < 0 || x > window.innerWidth || y > window.innerHeight) {
        if (lastHovered) {
          lastHovered.classList.remove("is-hovered");
          lastHovered.removeAttribute("data-hovered");
          lastHovered = null;
        }
        return;
      }

      const el = document.elementFromPoint(x, y) as HTMLElement | null;
      const interactive = el?.closest(
        "a, button, [data-interactive], [data-cursor-label], [data-scramble], .DemoExp-row, .DemoBlog-card, .DemoMetrics-card, .DemoFooter-card, .DemoHero-cta, .DemoHero-scrambleWord"
      ) as HTMLElement | null;

      if (interactive !== lastHovered) {
        if (lastHovered) {
          lastHovered.classList.remove("is-hovered");
          lastHovered.removeAttribute("data-hovered");
        }
        if (interactive) {
          interactive.classList.add("is-hovered");
          interactive.setAttribute("data-hovered", "true");
        }
        lastHovered = interactive;
      }

      if (interactive) {
        gsap.to(disc, {
          scale: 1.35,
          duration: 0.25,
          ease: "back.out(2)",
          overwrite: "auto",
        });

        const customLabel = interactive.getAttribute("data-cursor-label");
        if (customLabel && label) {
          label.textContent = customLabel;
          label.style.opacity = "1";
          label.style.visibility = "visible";
        } else if (label) {
          label.style.opacity = "0";
          label.style.visibility = "hidden";
        }
      } else {
        gsap.to(disc, {
          scale: 1,
          duration: 0.2,
          ease: "power2.out",
          overwrite: "auto",
        });

        if (label) {
          label.style.opacity = "0";
          label.style.visibility = "hidden";
        }
      }
    };

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

      updateHoverState(mouseX, mouseY);
    };

    const onMouseEnter = (e: MouseEvent) => {
      if (cursor) cursor.style.opacity = "1";
      mouseX = e.clientX;
      mouseY = e.clientY;
      updateHoverState(mouseX, mouseY);
    };

    const onMouseLeave = () => {
      if (cursor) cursor.style.opacity = "0";
      if (lastHovered) {
        lastHovered.classList.remove("is-hovered");
        lastHovered.removeAttribute("data-hovered");
        lastHovered = null;
      }
      if (disc) {
        gsap.to(disc, { scale: 1, duration: 0.2, overwrite: "auto" });
      }
      if (label) {
        label.style.opacity = "0";
        label.style.visibility = "hidden";
      }
      mouseX = -100;
      mouseY = -100;
    };

    const onScrollOrWheel = () => {
      if (mouseX < 0 || mouseY < 0) return;
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          rafId = null;
          updateHoverState(mouseX, mouseY);
        });
      }
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        updateHoverState(mouseX, mouseY);
      }, 100);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("scroll", onScrollOrWheel, { passive: true });
    window.addEventListener("wheel", onScrollOrWheel, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("scroll", onScrollOrWheel);
      window.removeEventListener("wheel", onScrollOrWheel);
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      if (lastHovered) {
        lastHovered.classList.remove("is-hovered");
        lastHovered.removeAttribute("data-hovered");
      }
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
