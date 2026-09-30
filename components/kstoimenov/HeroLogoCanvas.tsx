"use client";

import React, { useEffect, useRef } from "react";

const LOGO_PATH =
  "M56.6385 1.4777C59.1351 1.08934 60.5851 3.72204 59.1301 6.00157L46.2438 26.1905C45.8608 26.7905 45.8608 27.5179 46.2438 27.9988L59.1301 44.1786C60.5851 46.0055 59.1351 49.0893 56.6385 49.4777L4.06616 57.6556C2.37277 57.919 1 56.7433 1 55.0295V13.2356C1 11.5218 2.37277 9.91903 4.06616 9.65561L56.6385 1.4777ZM6.65323 12.8411C5.80653 12.9728 5.12015 13.7742 5.12015 14.631V53.9038L19.9718 51.5935V12.3208C19.9718 11.4639 19.2855 10.876 18.4388 11.0078L6.65323 12.8411Z";

export default function HeroLogoCanvas({
  className = "Hero-module___w2HtG__logo",
}: {
  className?: string;
}) {
  const containerRef = useRef<HTMLSpanElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isDesktop = window.matchMedia("(min-width: 769px)");

    // Offscreen canvas containing the vector logo mask
    const offscreen = document.createElement("canvas");
    offscreen.width = 512;
    offscreen.height = 512;
    const offCtx = offscreen.getContext("2d");
    if (!offCtx) return;

    offCtx.setTransform(512 / 60, 0, 0, 512 / 60, 0, 0);
    offCtx.fillStyle = "#fff";
    offCtx.fill(new Path2D(LOGO_PATH));

    const state = { hover: false, auto: false, intensity: 0, t: 0 };
    let animId = 0;
    let prevTime = 0;
    let autoInterval = 0;
    let autoTimeout = 0;
    let hasHiddenImg = false;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.round(1.3 * rect.width * dpr));
      const h = Math.max(1, Math.round(1.3 * rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };

    const draw = () => {
      const cw = canvas.width;
      const ch = canvas.height;
      ctx.clearRect(0, 0, cw, ch);

      const size = Math.min(cw, ch) / 1.3;
      const offsetX = (cw - size) / 2;
      const offsetY = (ch - size) / 2;
      const s = state.intensity;
      const amp = 0.11 * size * s;
      const freq1 = 1.3 * Math.PI * 2;
      const freq2 = 1.9 * freq1;
      const time = state.t;

      for (let x = 0; x < size; x++) {
        const norm = x / size;
        const wave =
          (amp *
            Math.pow(norm, 1.25) *
            (Math.sin(freq1 * norm - time) +
              0.32 * Math.sin(freq2 * norm - 1.7 * time + 1))) /
          1.32;

        ctx.drawImage(
          offscreen,
          512 * norm,
          0,
          512 / size,
          512,
          offsetX + x,
          offsetY + wave,
          1,
          size
        );
      }

      if (!hasHiddenImg && imgRef.current) {
        imgRef.current.style.opacity = "0";
        hasHiddenImg = true;
      }
    };

    const animate = (now: number) => {
      const dt = Math.min(64, now - prevTime);
      prevTime = now;

      const target = prefersReduced ? 0 : state.hover || state.auto ? 1 : 0;
      state.intensity += (target - state.intensity) * (1 - Math.exp(-dt / 150));
      if (Math.abs(target - state.intensity) < 0.0005) {
        state.intensity = target;
      }

      if (state.intensity > 0.001) {
        state.t += (dt / 1000) * 1.76;
      }

      draw();

      if (state.intensity > 0.001 || target > 0) {
        animId = requestAnimationFrame(animate);
      } else {
        animId = 0;
      }
    };

    const trigger = () => {
      if (!animId) {
        prevTime = performance.now();
        animId = requestAnimationFrame(animate);
      }
    };

    const onEnter = () => {
      state.hover = true;
      trigger();
    };

    const onLeave = () => {
      state.hover = false;
      trigger();
    };

    container.addEventListener("pointerenter", onEnter);
    container.addEventListener("pointerleave", onLeave);

    const clearAuto = () => {
      if (autoInterval) window.clearInterval(autoInterval);
      if (autoTimeout) window.clearTimeout(autoTimeout);
      autoInterval = 0;
      autoTimeout = 0;
      state.auto = false;
    };

    const setupAuto = () => {
      clearAuto();
      if (!prefersReduced && isDesktop.matches) {
        autoInterval = window.setInterval(() => {
          state.auto = true;
          trigger();
          autoTimeout = window.setTimeout(() => {
            state.auto = false;
            trigger();
          }, 1800);
        }, 6000);
      }
    };

    setupAuto();
    isDesktop.addEventListener("change", setupAuto);

    resize();
    draw();
    trigger();

    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(container);

    return () => {
      container.removeEventListener("pointerenter", onEnter);
      container.removeEventListener("pointerleave", onLeave);
      isDesktop.removeEventListener("change", setupAuto);
      clearAuto();
      ro.disconnect();
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <span
      ref={containerRef}
      className={className}
      role="img"
      aria-label="Logo"
    >
      <img
        ref={imgRef}
        src="/MyPage/assets/logo.svg"
        alt=""
        aria-hidden="true"
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: "130%",
          height: "130%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
      />
    </span>
  );
}
