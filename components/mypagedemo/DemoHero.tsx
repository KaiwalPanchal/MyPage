"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import DemoShader from "./DemoShader";

interface DemoHeroProps {
  theme?: "cyan" | "green";
  isReady?: boolean;
}

export default function DemoHero({ theme = "cyan", isReady = true }: DemoHeroProps) {
  const heroRef = useRef<HTMLElement | null>(null);
  const heroFlareRef = useRef<HTMLDivElement | null>(null);
  const scrambleRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLAnchorElement | null>(null);
  const [isScrambling, setIsScrambling] = useState(false);

  const triggerScramble = (duration: number = 0.9) => {
    const scrambleEl = scrambleRef.current;
    if (!scrambleEl || isScrambling) return;
    setIsScrambling(true);
    const target = "I DON'T NEED INFINITY";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_'λΣθΩ ";
    const obj = { p: 0 };
    gsap.to(obj, {
      p: 1,
      duration,
      ease: "power1.inOut",
      onUpdate: () => {
        const revealed = Math.floor(obj.p * target.length);
        let str = target.slice(0, revealed);
        for (let k = revealed; k < target.length; k++) {
          str += chars[Math.floor(Math.random() * chars.length)];
        }
        if (scrambleEl) scrambleEl.textContent = str;
      },
      onComplete: () => {
        if (scrambleEl) scrambleEl.textContent = target;
        setIsScrambling(false);
      },
    });
  };

  useEffect(() => {
    if (!isReady) return;
    const hero = heroRef.current;
    if (!hero) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const splitLines = hero.querySelectorAll<HTMLElement>("[data-split]");
    const taglines = hero.querySelectorAll<HTMLElement>("[data-subsplit]");
    const cta = ctaRef.current;
    const scrambleEl = scrambleRef.current;
    const heroFlare = heroFlareRef.current;

    if (prefersReduced) {
      if (heroFlare) heroFlare.style.display = "none";
      splitLines.forEach((el) => {
        el.style.opacity = "1";
      });
      if (scrambleEl) scrambleEl.style.opacity = "1";
      if (cta) {
        cta.style.opacity = "1";
        cta.style.transform = "none";
      }
      taglines.forEach((el) => {
        el.style.opacity = "0.7";
        el.style.filter = "none";
      });
      return;
    }

    // Wrap chars in split lines (kstoimenov pattern)
    const lineChars: HTMLElement[][] = [];
    splitLines.forEach((line) => {
      const text = line.textContent || "";
      line.innerHTML = "";
      line.style.opacity = "1";
      const chars: HTMLElement[] = [];
      for (const ch of text) {
        const span = document.createElement("span");
        span.textContent = ch === " " ? "\u00A0" : ch;
        span.style.display = "inline-block";
        span.style.transform = "translateY(115%)";
        span.style.opacity = "0";
        line.appendChild(span);
        chars.push(span);
      }
      lineChars.push(chars);
    });

    if (cta) gsap.set(cta, { autoAlpha: 0, scale: 0.9 });
    taglines.forEach((t) => gsap.set(t, { autoAlpha: 0, filter: "blur(16px)" }));
    if (scrambleEl) gsap.set(scrambleEl, { autoAlpha: 0 });

    if (heroFlare) {
      gsap.fromTo(
        heroFlare,
        { opacity: 0.95, scale: 0.65 },
        { opacity: 0, scale: 1.35, duration: 1.6, ease: "power3.out" }
      );
    }

    const tl = gsap.timeline({ delay: 0.2 });

    // Animate lines: name=0, line1=0.25, line2=0.48, line3=0.68, line4=0.88
    const delays = [0, 0.25, 0.48, 0.68, 0.88];
    lineChars.forEach((chars, i) => {
      tl.to(
        chars,
        {
          yPercent: -115,
          opacity: 1,
          ease: "power4.out",
          duration: 0.9,
          stagger: 0.03,
          clearProps: "transform",
        },
        delays[i] ?? 0.88
      );
    });

    // Intro scramble on line 5
    if (scrambleEl) {
      tl.set(scrambleEl, { autoAlpha: 1 }, 1.05);
      tl.add(() => triggerScramble(1.1), 1.05);
    }

    // CTA
    if (cta) {
      tl.to(cta, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(2)" }, 1.85);
    }

    // Sub-taglines at bottom
    tl.to(
      taglines,
      {
        autoAlpha: 0.7,
        filter: "blur(0px)",
        duration: 1.1,
        ease: "power2.out",
        stagger: 0.14,
      },
      1.85
    );

    return () => {
      tl.kill();
    };
  }, [isReady]);

  return (
    <section className="DemoHero-hero" id="home" ref={heroRef}>
      <h1 className="sr-only">
        Kaiwal Panchal — Applied AI &amp; Forward Deployed Engineer. Infinite agents. Infinite tokens. Eventually one builds something great. Thank God I DON&apos;T NEED INFINITY.
      </h1>

      {/* Living Fluted Caustic Glass Wave Shader */}
      <DemoShader theme={theme} className="DemoHero-shader" />

      {/* Entrance Radial Caustic Gradient Bloom */}
      <div ref={heroFlareRef} className="DemoHero-entranceFlare" aria-hidden="true" />

      {/* Seamless bottom fade & highlight masks */}
      <div className="DemoHero-bottomFade" />
      <div className="DemoHero-bottomHighlight" />

      {/* Name in top left — kstoimenov nameplate style */}
      <p className="DemoHero-name" data-split="true" aria-hidden="true">
        kaiwal panchal
      </p>

      {/* Banner — kstoimenov absolute lines over shader */}
      <div className="DemoHero-banner" aria-hidden="true">
        {/* Line 1 — sans, left */}
        <p
          className="DemoHero-lineSans"
          data-split="true"
          style={{ "--l": "18%", "--t": "clamp(6.8rem, 16vh, 10.5rem)" } as React.CSSProperties}
        >
          Infinite agents. Infinite tokens.
        </p>

        {/* Line 2 — display italic, indented right */}
        <p
          className="DemoHero-lineDisplay"
          data-split="true"
          style={{ "--l": "44%", "--t": "clamp(10.2rem, 24vh, 16rem)" } as React.CSSProperties}
        >
          Eventually, one builds
        </p>

        {/* Line 3 — display italic, same indent axis as Line 2 */}
        <p
          className="DemoHero-lineDisplay"
          data-split="true"
          style={{ "--l": "44%", "--t": "clamp(13.6rem, 32vh, 21.5rem)" } as React.CSSProperties}
        >
          something great.
        </p>

        {/* Line 4 — sans, left-aligned under Line 1 */}
        <p
          className="DemoHero-lineSans"
          data-split="true"
          style={{ "--l": "18%", "--t": "clamp(17.6rem, 41.5vh, 28rem)" } as React.CSSProperties}
        >
          Thank God
        </p>

        {/* Line 5 — scramble word, left-aligned under Thank God */}
        <p
          ref={scrambleRef}
          className="DemoHero-lineSans DemoHero-scrambleWord"
          data-scramble="true"
          style={{ "--l": "18%", "--t": "clamp(21.2rem, 50vh, 34rem)" } as React.CSSProperties}
          onMouseEnter={() => triggerScramble(0.5)}
          onClick={() => triggerScramble(0.5)}
          data-cursor-label="SCRAMBLE"
        >
          I DON&apos;T NEED INFINITY
        </p>
      </div>

      {/* CTA pill — kstoimenov large oval button adjacent to Line 5 */}
      <a
        ref={ctaRef}
        className="DemoHero-cta"
        href="mailto:kaiwalextra@gmail.com"
        data-cursor-label="CONTACT"
      >
        <span className="DemoHero-ctaInner">Initialize Contact</span>
      </a>

      {/* Dual bottom editorial taglines — kstoimenov balance */}
      <p className="DemoHero-tagline DemoHero-taglineLeft" data-subsplit="true">
        Forward Deployed &amp; Applied AI Engineer building intelligent systems at Sylvr
      </p>

      <p className="DemoHero-tagline DemoHero-taglineRight" data-subsplit="true">
        Suspiciously obsessed with making things work.
      </p>
    </section>
  );
}
