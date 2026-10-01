"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/**
 * Dual Logo System:
 * - Variant 1 (Default): Stylized Calligraphic / Signature Star "K" Monogram from file_0000000039ec82308935f78d6f30237d.png.
 * - Variant 2: Solid Geometric "K" Monogram from logo.jpg (with refined 3px thinner stem).
 *
 * Click the logo at any time to toggle between both variants live!
 */

// Variant 1: Star / Signature Calligraphic K Logo (viewBox 0 0 699 699, enhanced bold weight)
export const SIGNATURE_PATH =
  "M 603,109 L 598,108 L 589,111 L 567,120 L 560,124 L 555,125 L 524,140 L 515,143 L 500,151 L 485,157 L 321,237 L 324,216 L 327,205 L 327,198 L 330,179 L 332,173 L 333,159 L 335,153 L 337,136 L 337,127 L 339,118 L 342,86 L 342,59 L 341,50 L 338,42 L 334,38 L 330,36 L 326,36 L 320,39 L 312,47 L 307,54 L 299,69 L 297,75 L 295,77 L 279,114 L 266,148 L 244,215 L 224,287 L 168,316 L 160,319 L 145,327 L 138,332 L 126,338 L 108,351 L 100,359 L 97,363 L 93,372 L 93,381 L 96,389 L 103,398 L 114,408 L 128,417 L 150,428 L 170,436 L 183,440 L 184,443 L 180,454 L 179,462 L 172,485 L 167,509 L 164,516 L 159,539 L 155,550 L 151,571 L 147,583 L 145,596 L 143,600 L 140,614 L 136,641 L 136,654 L 137,658 L 139,661 L 143,663 L 148,663 L 153,659 L 152,645 L 154,634 L 156,630 L 156,626 L 158,622 L 158,617 L 161,604 L 164,596 L 164,592 L 170,573 L 171,565 L 173,562 L 177,542 L 186,512 L 186,508 L 190,497 L 190,493 L 192,489 L 192,485 L 196,474 L 196,470 L 201,451 L 205,448 L 211,449 L 221,453 L 292,473 L 316,481 L 348,494 L 375,509 L 388,519 L 391,520 L 438,559 L 442,561 L 446,561 L 450,558 L 450,553 L 438,532 L 415,497 L 384,454 L 373,441 L 372,438 L 363,428 L 352,414 L 350,410 L 345,405 L 342,400 L 337,395 L 331,386 L 323,377 L 315,366 L 315,364 L 341,339 L 349,333 L 377,307 L 410,279 L 457,237 L 463,233 L 471,225 L 478,220 L 485,213 L 506,196 L 513,189 L 533,172 L 539,168 L 546,161 L 555,155 L 561,149 L 589,127 L 601,119 L 605,115 L 605,111 Z M 216,309 L 217,314 L 211,337 L 208,344 L 207,352 L 204,360 L 204,364 L 201,376 L 195,395 L 195,399 L 193,403 L 193,407 L 189,419 L 189,423 L 187,425 L 185,425 L 168,419 L 142,407 L 127,398 L 111,383 L 109,376 L 112,369 L 120,361 L 128,355 L 157,338 Z M 534,150 L 535,152 L 533,154 L 528,157 L 483,195 L 469,208 L 462,213 L 455,220 L 435,236 L 418,252 L 411,257 L 395,272 L 381,283 L 379,286 L 371,292 L 348,313 L 341,318 L 332,327 L 324,333 L 294,361 L 294,367 L 296,371 L 315,394 L 321,403 L 326,408 L 332,417 L 358,448 L 371,466 L 376,471 L 381,479 L 388,487 L 400,504 L 400,508 L 396,504 L 376,491 L 340,473 L 304,460 L 284,454 L 277,453 L 270,450 L 259,448 L 238,442 L 207,432 L 207,428 L 213,408 L 214,400 L 221,377 L 227,350 L 230,343 L 236,316 L 238,312 L 240,301 L 242,296 L 246,295 L 306,264 L 313,265 L 315,264 L 316,261 L 319,258 L 425,203 L 516,158 Z M 327,53 L 329,55 L 330,62 L 330,83 L 328,111 L 326,121 L 326,131 L 324,138 L 323,155 L 321,162 L 320,177 L 318,183 L 318,190 L 316,196 L 316,204 L 311,238 L 309,245 L 300,249 L 298,251 L 248,273 L 250,265 L 253,258 L 255,247 L 272,189 L 292,129 L 315,72 L 319,66 L 320,62 Z";

// Variant 2: Solid Geometric Monogram (viewBox 0 0 192 192, with 3px thinner stem)
export const STEM_PATH =
  "M 80,21 L 41,21 L 35,26 L 35,29 L 34,30 L 34,171 L 36,175 L 41,177 L 44,176 L 47,173 L 48,170 L 87,98 L 87,29 L 86,26 Z";
export const LOWER_ARM_PATH =
  "M 88,99 L 88,166 L 91,172 L 95,175 L 98,175 L 99,176 L 155,176 L 161,173 L 165,166 L 165,161 L 163,156 Z";
export const UPPER_ARM_PATH =
  "M 88,98 L 154,98 L 159,96 L 163,92 L 165,87 L 165,31 L 163,26 L 159,22 L 156,21 L 148,21 L 141,27 Z";

interface DemoLogoProps {
  isReady?: boolean;
  defaultVariant?: "signature" | "geometric";
}

export default function DemoLogo({ isReady = true, defaultVariant = "signature" }: DemoLogoProps) {
  const rootRef = useRef<HTMLAnchorElement | null>(null);
  const [variant, setVariant] = useState<"signature" | "geometric">(defaultVariant);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !isReady) return;

    const glyph = root.querySelector<SVGGElement>("[data-glyph-group]");
    const glow = root.querySelector<HTMLElement>("[data-glow]");
    const shine = root.querySelector<SVGLinearGradientElement>("[data-shine-grad]");
    if (!glyph || !glow) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) {
      gsap.set(glyph, { opacity: 1, transform: "none" });
      gsap.set(glow, { opacity: 0.35 });
      return;
    }

    const origin = variant === "signature" ? "350px 350px" : "96px 96px";
    gsap.set(glyph, { opacity: 0, scale: 0.85, transformOrigin: origin });
    gsap.set(glow, { opacity: 0, scale: 0.6 });

    // Entrance Animation
    const introTl = gsap.timeline({ delay: 0.1 });
    introTl
      .to(glow, { opacity: 0.45, scale: 1, duration: 1.1, ease: "power2.out" }, 0)
      .to(glyph, { opacity: 1, scale: 1, duration: 0.8, ease: "power3.out" }, 0.1);

    // Idle organic micro-levitation floating
    const floatAnim = gsap.to(glyph, {
      y: -2.5,
      duration: 2.6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 1.2,
    });

    // Idle breathing ambient glow
    const glowBreathe = gsap.to(glow, {
      opacity: 0.65,
      scale: 1.12,
      duration: 2.6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 1.2,
    });

    // Periodic subtle glint sweep
    const glint = () => {
      if (!shine) return;
      gsap.fromTo(
        shine,
        { attr: { x1: "-100%", x2: "0%" } },
        { attr: { x1: "100%", x2: "200%" }, duration: 1.2, ease: "power1.inOut" }
      );
    };
    const glintInterval = window.setInterval(glint, 6000);

    // Interactive hover
    const onEnter = () => {
      floatAnim.pause();
      glowBreathe.pause();
      gsap.to(glyph, { scale: 1.08, y: -2, duration: 0.3, ease: "power2.out" });
      gsap.to(glow, { opacity: 0.85, scale: 1.3, duration: 0.3, ease: "power2.out" });
      glint();
    };

    const onLeave = () => {
      gsap.to(glyph, {
        scale: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out",
        onComplete: () => {
          floatAnim.resume();
          glowBreathe.resume();
        },
      });
      gsap.to(glow, { opacity: 0.45, scale: 1, duration: 0.4, ease: "power2.out" });
    };

    root.addEventListener("pointerenter", onEnter);
    root.addEventListener("pointerleave", onLeave);

    return () => {
      window.clearInterval(glintInterval);
      root.removeEventListener("pointerenter", onEnter);
      root.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf([glyph, glow, root]);
      introTl.kill();
      floatAnim.kill();
      glowBreathe.kill();
    };
  }, [isReady, variant]);

  const toggleVariant = (e: React.MouseEvent) => {
    e.preventDefault();
    setVariant((prev) => (prev === "signature" ? "geometric" : "signature"));
  };

  return (
    <a
      ref={rootRef}
      href="#home"
      onClick={toggleVariant}
      className="DemoHero-logo"
      style={{
        opacity: isReady ? 1 : 0,
        pointerEvents: isReady ? "auto" : "none",
        transition: "opacity 0.25s cubic-bezier(0.22, 1, 0.36, 1)",
      }}
      aria-label={`Kaiwal Panchal — logo (${variant}). Click to toggle.`}
      title={`Current: ${variant === "signature" ? "Signature Star K" : "Geometric K Monogram"}. Click to toggle variant.`}
      data-cursor-label="TOGGLE"
    >
      {/* Ambient caustic glow */}
      <span className="DemoHero-logoGlow" data-glow="" aria-hidden="true" />

      {variant === "signature" ? (
        /* Variant 1: Star / Signature Calligraphic K Logo */
        <svg
          viewBox="0 0 699 699"
          fill="none"
          aria-hidden="true"
          className="DemoHero-logoSvg DemoHero-logoSvgSignature"
          shapeRendering="geometricPrecision"
          style={{ transform: "scale(1.15)", transformOrigin: "center" }}
        >
          <defs>
            <linearGradient
              id="logoShine"
              data-shine-grad=""
              x1="-100%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="45%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="50%" stopColor="#9ff5ff" stopOpacity="1" />
              <stop offset="55%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
            </linearGradient>
          </defs>

          <g
            data-glyph-group=""
            fill="url(#logoShine)"
            stroke="url(#logoShine)"
            strokeWidth={7}
            strokeLinejoin="round"
          >
            <path d={SIGNATURE_PATH} fillRule="evenodd" />
          </g>
        </svg>
      ) : (
        /* Variant 2: Solid Geometric K Monogram (with thinner stem) */
        <svg
          viewBox="0 0 192 192"
          fill="none"
          aria-hidden="true"
          className="DemoHero-logoSvg"
          shapeRendering="geometricPrecision"
        >
          <defs>
            <linearGradient
              id="logoShine"
              data-shine-grad=""
              x1="-100%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="45%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="50%" stopColor="#9ff5ff" stopOpacity="1" />
              <stop offset="55%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
            </linearGradient>
          </defs>

          <g data-glyph-group="" fill="url(#logoShine)">
            <path d={STEM_PATH} />
            <path d={LOWER_ARM_PATH} />
            <path d={UPPER_ARM_PATH} />
          </g>
        </svg>
      )}
    </a>
  );
}
