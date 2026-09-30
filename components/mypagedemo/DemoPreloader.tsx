"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface DemoPreloaderProps {
  onComplete?: () => void;
}

const TOTAL_BARS = 100;

export default function DemoPreloader({ onComplete }: DemoPreloaderProps) {
  const [visible, setVisible] = useState(true);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const meterRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const meter = meterRef.current;
    if (!overlay || !meter) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      if (onComplete) onComplete();
      setVisible(false);
      return;
    }

    const bars = Array.from(meter.children) as HTMLElement[];
    const progress = { val: 0 };

    const tl = gsap.timeline();

    // Fast, organic multi-stage surge to 100% in ~620ms total!
    tl.to(progress, {
      val: TOTAL_BARS,
      duration: 0.62,
      ease: "power2.inOut",
      onUpdate: () => {
        const activeCount = Math.floor(progress.val);
        for (let i = 0; i < TOTAL_BARS; i++) {
          const bar = bars[i];
          if (!bar) continue;
          if (i < activeCount) {
            bar.classList.add("active");
            if (i === activeCount - 1) {
              bar.classList.add("leading-tip");
            } else {
              bar.classList.remove("leading-tip");
            }
          } else {
            bar.classList.remove("active", "leading-tip");
          }
        }
      },
    })
      // Neon flash burst at 100%
      .call(() => {
        bars.forEach((b) => b.classList.add("surge"));
      })
      .to({}, { duration: 0.12 })
      // Slide the preloader curtain UP with high-energy power4 curve
      .to(overlay, {
        yPercent: -100,
        duration: 0.8,
        ease: "power4.inOut",
        onStart: () => {
          if (onComplete) onComplete();
        },
        onComplete: () => {
          setVisible(false);
        },
      });

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
      <div className="DemoPreloader-content">
        {/* 100 Bold Neon Bars Meter - Uniform, Borderless, Pure Lights */}
        <div ref={meterRef} className="DemoPreloader-meter" aria-hidden="true">
          {Array.from({ length: TOTAL_BARS }).map((_, i) => (
            <div key={i} className="DemoPreloader-tick" />
          ))}
        </div>
      </div>
    </div>
  );
}
