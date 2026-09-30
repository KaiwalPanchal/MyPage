"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const scalerRef = useRef<HTMLDivElement | null>(null);
  const discRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const crossRef = useRef<HTMLSpanElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const scaler = scalerRef.current;
    if (!cursor || !scaler) return;

    // Apply cursor: none globally to the document while on this page
    const styleEl = document.createElement("style");
    styleEl.id = "custom-cursor-hide-native";
    styleEl.innerHTML = `
      * {
        cursor: none !important;
      }
    `;
    document.head.appendChild(styleEl);

    // Initial positioning setup with GSAP
    gsap.set(scaler, { xPercent: -50, yPercent: -50, scale: 1 });

    const onMouseMove = (e: MouseEvent) => {
      cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      cursor.style.opacity = "1";
    };

    const onMouseLeave = () => {
      cursor.style.opacity = "0";
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onMouseLeave);

    const tl = gsap.timeline({ paused: true });
    tl.to(
      discRef.current,
      {
        scale: 2,
        backgroundColor: "#ffffff",
        duration: 0.35,
        ease: "power3.out",
      },
      0
    )
      .to(imgRef.current, { autoAlpha: 0, duration: 0.15 }, 0)
      .to(crossRef.current, { autoAlpha: 0, scale: 0.3, duration: 0.15 }, 0)
      .to(
        labelRef.current,
        { autoAlpha: 1, duration: 0.25, ease: "power2.out" },
        0.1
      );

    let isExpanded = false;

    const onCursorVariant = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail === "viewcase" || detail === "expand" || detail === "more") {
        isExpanded = true;
        gsap.to(scaler, {
          scale: 1,
          xPercent: -50,
          yPercent: -50,
          duration: 0.2,
          ease: "power2.out",
          overwrite: true,
        });
        if (labelRef.current) {
          labelRef.current.textContent =
            detail === "expand"
              ? "Expand"
              : detail === "more"
              ? "Click for more"
              : "View case";
        }
        tl.play();
      } else {
        isExpanded = false;
        tl.reverse();
      }
    };

    window.addEventListener("cursorvariant", onCursorVariant);

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const targetSelector = 'a, button, [role="button"], input, label';
    let spinTween: gsap.core.Tween | null = null;

    const onPointerOver = (e: PointerEvent) => {
      if (isExpanded) return;
      const target = (e.target as HTMLElement)?.closest(targetSelector);
      if (target) {
        gsap.to(scaler, {
          scale: 0.7,
          xPercent: -50,
          yPercent: -50,
          duration: 0.3,
          ease: "power2.out",
          overwrite: true,
        });
        if (!prefersReduced && (!spinTween || !spinTween.isActive())) {
          spinTween = gsap.to(crossRef.current, {
            rotation: "+=360",
            duration: 0.25,
            ease: "power2.out",
          });
        }
      }
    };

    const onPointerOut = (e: PointerEvent) => {
      if (isExpanded) return;
      const target = (e.target as HTMLElement)?.closest(targetSelector);
      if (!target || target.contains(e.relatedTarget as Node)) return;
      gsap.to(scaler, {
        scale: 1,
        xPercent: -50,
        yPercent: -50,
        duration: 0.3,
        ease: "power2.out",
        overwrite: true,
      });
    };

    document.addEventListener("pointerover", onPointerOver);
    document.addEventListener("pointerout", onPointerOut);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.documentElement.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("cursorvariant", onCursorVariant);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);
      tl.kill();
      const el = document.getElementById("custom-cursor-hide-native");
      if (el) el.remove();
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="CustomCursor-module__scj-aG__cursor"
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        margin: 0,
        padding: 0,
        pointerEvents: "none",
        zIndex: 2147483647, // Guaranteed on top of all elements
        opacity: 0,
        willChange: "transform",
        display: "block",
      }}
    >
      <div
        ref={scalerRef}
        className="CustomCursor-module__scj-aG__scaler"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "66px",
          height: "66px",
          transformOrigin: "center center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          ref={discRef}
          className="CustomCursor-module__scj-aG__disc"
          style={{
            position: "absolute",
            width: "66px",
            height: "66px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            ref={imgRef}
            src="/MyPage/assets/cursor-ring-green.svg"
            alt=""
            style={{ width: "100%", height: "100%", display: "block" }}
          />
        </div>
        <span
          ref={crossRef}
          className="CustomCursor-module__scj-aG__cross"
          style={{
            position: "absolute",
            width: "66px",
            height: "66px",
            pointerEvents: "none",
          }}
        />
        <span
          ref={labelRef}
          className="CustomCursor-module__scj-aG__label"
          style={{
            position: "absolute",
            pointerEvents: "none",
          }}
        >
          View case
        </span>
      </div>
    </div>
  );
}
