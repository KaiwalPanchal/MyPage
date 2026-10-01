"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SIGNATURE_PATH } from "./DemoLogo";

interface DemoPreloaderProps {
  onComplete?: () => void;
}

const TOTAL_STRIPES = 6;

export default function DemoPreloader({ onComplete }: DemoPreloaderProps) {
  const [visible, setVisible] = useState(true);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const stripesRef = useRef<HTMLDivElement | null>(null);
  const logoStageRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const stripesWrap = stripesRef.current;
    const logoStage = logoStageRef.current;
    const glow = glowRef.current;
    if (!overlay || !stripesWrap || !logoStage) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      if (onComplete) onComplete();
      setVisible(false);
      return;
    }

    const stripes = Array.from(stripesWrap.children) as HTMLElement[];
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Initial heroic centered position
    const initialSize = Math.max(90, Math.min(130, Math.min(vw, vh) * 0.22));
    const centerX = vw / 2;
    const centerY = vh / 2;

    gsap.set(logoStage, {
      x: centerX,
      y: centerY,
      xPercent: -50,
      yPercent: -50,
      width: initialSize,
      height: initialSize,
      opacity: 0,
      scale: 0.75,
    });

    if (glow) {
      gsap.set(glow, { opacity: 0, scale: 0.6 });
    }

    const tl = gsap.timeline();

    // Stage 1: Heroic logo entrance in center of screen with glowing halo (0.0s - 0.7s)
    tl.to(
      logoStage,
      {
        opacity: 1,
        scale: 1,
        duration: 0.65,
        ease: "power3.out",
      },
      0.1
    );

    if (glow) {
      tl.to(
        glow,
        {
          opacity: 0.85,
          scale: 1.25,
          duration: 0.65,
          ease: "sine.out",
        },
        0.1
      );
    }

    // Brief charging anticipation pause (0.75s)
    tl.to({}, { duration: 0.2 });

    // Stage 2: FLIP flight of the logo to top-left & vertical stripes curtain opening
    tl.add(() => {
      // Find exact live coordinates of the target top-left masthead logo
      const targetEl = document.querySelector(".DemoHero-logo") as HTMLElement;
      let targetX = 48;
      let targetY = 48;
      let targetSize = 52;

      if (targetEl) {
        const rect = targetEl.getBoundingClientRect();
        targetX = rect.left + rect.width / 2;
        targetY = rect.top + rect.height / 2;
        targetSize = rect.width;
      }

      // 1) Fly and shrink logo to target coordinates
      gsap.to(logoStage, {
        x: targetX,
        y: targetY,
        width: targetSize,
        height: targetSize,
        duration: 0.95,
        ease: "power4.inOut",
      });

      if (glow) {
        gsap.to(glow, {
          opacity: 0.4,
          scale: 0.9,
          duration: 0.95,
          ease: "power4.inOut",
        });
      }

      // 2) Stagger stripes sliding UP to reveal background
      gsap.to(stripes, {
        yPercent: -100,
        duration: 0.95,
        ease: "power4.inOut",
        stagger: 0.065,
      });
    }, "+=0.05");

    // Stage 3: Halfway through the stripes opening, signal page readiness
    // This allows the shader and the text staircase to start unmasking seamlessly
    tl.call(
      () => {
        if (onComplete) onComplete();
      },
      undefined,
      "+=0.45"
    );

    // Stage 4: Once flight completes, smoothly fade out preloader overlay
    tl.to(
      overlay,
      {
        opacity: 0,
        duration: 0.25,
        ease: "power2.inOut",
        onComplete: () => {
          setVisible(false);
        },
      },
      "+=0.55"
    );

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      className="DemoPreloader-overlay"
      aria-label="Loading systems"
    >
      {/* 6 Vertical Stripes Curtain */}
      <div ref={stripesRef} className="DemoPreloader-stripes" aria-hidden="true">
        {Array.from({ length: TOTAL_STRIPES }).map((_, i) => (
          <div key={i} className="DemoPreloader-stripe" />
        ))}
      </div>

      {/* Floating Center-to-Masthead Flying Logo */}
      <div ref={logoStageRef} className="DemoPreloader-logoStage" aria-hidden="true">
        <span ref={glowRef} className="DemoPreloader-logoGlow" />
        <svg
          viewBox="0 0 699 699"
          fill="none"
          className="DemoPreloader-logoSvg"
          shapeRendering="geometricPrecision"
          style={{ transform: "scale(1.15)", transformOrigin: "center" }}
        >
          <defs>
            <linearGradient id="preloaderShine" x1="-100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="45%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="50%" stopColor="#9ff5ff" stopOpacity="1" />
              <stop offset="55%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
            </linearGradient>
          </defs>
          <g
            fill="url(#preloaderShine)"
            stroke="url(#preloaderShine)"
            strokeWidth={7}
            strokeLinejoin="round"
          >
            <path d={SIGNATURE_PATH} fillRule="evenodd" />
          </g>
        </svg>
      </div>
    </div>
  );
}
