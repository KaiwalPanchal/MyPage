"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Animated "K" monogram.
 * - Draw-on entrance (stroke dash) once the preloader is done
 * - Idle: ring orbits, arms breathe around the stem joint
 * - Hover / periodic pulse: arms flex open, glow flares
 */
export default function DemoLogo({ isReady = true }: { isReady?: boolean }) {
  const rootRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !isReady) return;

    const stem = root.querySelector<SVGPathElement>("[data-stem]");
    const upper = root.querySelector<SVGPathElement>("[data-upper]");
    const lower = root.querySelector<SVGPathElement>("[data-lower]");
    const armUpper = root.querySelector<SVGGElement>("[data-arm-upper]");
    const armLower = root.querySelector<SVGGElement>("[data-arm-lower]");
    const ring = root.querySelector<SVGGElement>("[data-ring]");
    const ringLine = root.querySelector<SVGCircleElement>("[data-ring-line]");
    const dot = root.querySelector<SVGCircleElement>("[data-dot]");
    const glow = root.querySelector<HTMLElement>("[data-glow]");
    if (!stem || !upper || !lower || !armUpper || !armLower || !ring || !ringLine || !dot || !glow) return;

    const strokes = [stem, upper, lower];
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      gsap.set(strokes, { strokeDashoffset: 0 });
      gsap.set([ring, dot], { opacity: 1 });
      return;
    }

    gsap.set(strokes, { strokeDasharray: 1, strokeDashoffset: 1 });
    gsap.set(ring, { opacity: 0, transformOrigin: "30px 30px" });
    gsap.set(dot, { opacity: 0 });
    gsap.set([armUpper, armLower], { transformOrigin: "20px 30px" });

    const flex = gsap.timeline({ paused: true });
    flex
      .to(armUpper, { rotation: -14, duration: 0.45, ease: "back.out(2.2)" }, 0)
      .to(armLower, { rotation: 14, duration: 0.45, ease: "back.out(2.2)" }, 0)
      .to(glow, { opacity: 1, scale: 1.25, duration: 0.45, ease: "power2.out" }, 0);

    const intro = gsap.timeline({ delay: 0.15 });
    intro
      .to(stem, { strokeDashoffset: 0, duration: 0.7, ease: "power3.inOut" }, 0)
      .to(upper, { strokeDashoffset: 0, duration: 0.6, ease: "power3.inOut" }, 0.35)
      .to(lower, { strokeDashoffset: 0, duration: 0.6, ease: "power3.inOut" }, 0.5)
      .to(ring, { opacity: 1, rotation: 360, duration: 1.4, ease: "power3.out" }, 0.7)
      .to(dot, { opacity: 1, duration: 0.3 }, 1.1)
      .add(() => {
        flex.play();
        gsap.delayedCall(0.9, () => flex.reverse());
      }, 1.3);

    // Idle: ring orbit + arm breathing
    const orbit = gsap.to(ring, {
      rotation: "+=360",
      duration: 14,
      ease: "none",
      repeat: -1,
      delay: 2,
    });
    const breathe = gsap.timeline({ repeat: -1, yoyo: true, delay: 2 });
    breathe
      .to(armUpper, { rotation: -3.5, duration: 2.4, ease: "sine.inOut" }, 0)
      .to(armLower, { rotation: 3.5, duration: 2.4, ease: "sine.inOut" }, 0);

    const pulse = () => {
      if (flex.isActive()) return;
      flex.play();
      gsap.delayedCall(1.1, () => flex.reverse());
    };
    const interval = window.setInterval(pulse, 6000);

    const onEnter = () => {
      breathe.pause();
      flex.play();
    };
    const onLeave = () => {
      flex.reverse();
      breathe.resume();
    };
    root.addEventListener("pointerenter", onEnter);
    root.addEventListener("pointerleave", onLeave);

    return () => {
      window.clearInterval(interval);
      root.removeEventListener("pointerenter", onEnter);
      root.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf([...strokes, armUpper, armLower, ring, dot, glow]);
      intro.kill();
      orbit.kill();
      breathe.kill();
      flex.kill();
    };
  }, [isReady]);

  return (
    <a
      ref={rootRef}
      href="#home"
      className="DemoHero-logo"
      aria-label="Kaiwal Panchal — home"
      data-cursor-label="HOME"
    >
      <span className="DemoHero-logoGlow" data-glow="" aria-hidden="true" />
      <svg viewBox="0 0 60 60" fill="none" aria-hidden="true" className="DemoHero-logoSvg">
        <g data-ring="">
          <circle
            data-ring-line=""
            cx="30"
            cy="30"
            r="28"
            stroke="currentColor"
            strokeOpacity="0.28"
            strokeWidth="0.7"
            strokeDasharray="1.5 3.5"
          />
          <circle data-dot="" cx="30" cy="2" r="1.8" fill="var(--accent-bright)" />
        </g>
        <g stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
          <path data-stem="" d="M16 11V49" pathLength={1} />
          <g data-arm-upper="">
            <path data-upper="" d="M20 31L45 11" pathLength={1} />
          </g>
          <g data-arm-lower="">
            <path data-lower="" d="M28 27L45 49" pathLength={1} />
          </g>
        </g>
      </svg>
    </a>
  );
}
