"use client";

import React, { useEffect, useRef } from "react";
import DemoShader from "./DemoShader";

interface DemoFooterRevealProps {
  theme?: "cyan" | "green";
}

export default function DemoFooterReveal({ theme = "cyan" }: DemoFooterRevealProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // Expand smoothly as it approaches bottom viewport
      const p = Math.min(1, Math.max(0, (vh - rect.top) / (rect.height * 0.8)));
      const targetHeight = 12 + 15 * p; // from 12rem to 27rem
      el.style.height = `${targetHeight.toFixed(2)}rem`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={containerRef} className="DemoReveal-reveal" aria-hidden="true">
      <div className="DemoReveal-inner">
        {/* Living Fluted Caustic Wave Shader at bottom */}
        <DemoShader theme={theme} className="w-full h-full absolute inset-0 block" />

        {/* Top Fade Gradient blending seamlessly with page background */}
        <div className="DemoReveal-fade" />
        {/* Bottom Fade Gradient into footer */}
        <div className="DemoReveal-bottomFade" />
      </div>
    </div>
  );
}
