"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import DemoShader from "./DemoShader";
import DemoLogo from "./DemoLogo";

interface DemoHeroProps {
  theme?: "cyan" | "green";
  isReady?: boolean;
}

const FONT_OPTIONS = [
  { id: "lausanne", label: "TWK Lausanne (Precision Swiss Sans)", className: "font-lausanne" },
  { id: "syne", label: "Syne (Modern Architectural Sans)", className: "font-syne" },
  { id: "manier", label: "Manier (Editorial Serif)", className: "font-manier" },
  { id: "cormorant", label: "Cormorant (Haute Couture Serif)", className: "font-cormorant" },
];

export default function DemoHero({ theme = "cyan", isReady = true }: DemoHeroProps) {
  const heroRef = useRef<HTMLElement | null>(null);
  const heroFlareRef = useRef<HTMLDivElement | null>(null);
  const scrambleRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLAnchorElement | null>(null);
  const [isScrambling, setIsScrambling] = useState(false);
  const [fontIdx, setFontIdx] = useState(0);

  const triggerScramble = (duration: number = 0.8) => {
    const scrambleEl = scrambleRef.current;
    if (!scrambleEl || isScrambling) return;
    setIsScrambling(true);
    const target = "and making the two interact.";
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_'λΣθΩ .,";
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
        el.style.opacity = "0.85";
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
    taglines.forEach((t) => gsap.set(t, { autoAlpha: 0, filter: "blur(8px)" }));
    if (scrambleEl) gsap.set(scrambleEl, { autoAlpha: 0 });

    if (heroFlare) {
      gsap.fromTo(
        heroFlare,
        { opacity: 0.95, scale: 0.65 },
        { opacity: 0, scale: 1.35, duration: 1.5, ease: "power3.out" }
      );
    }

    const tl = gsap.timeline({ delay: 0.15 });

    // Animate lines: line1=0.15, line2=0.35, line3=0.55
    const delays = [0.15, 0.35, 0.55];
    lineChars.forEach((chars, i) => {
      tl.to(
        chars,
        {
          yPercent: -115,
          opacity: 1,
          ease: "power4.out",
          duration: 0.85,
          stagger: 0.025,
          clearProps: "transform",
        },
        delays[i] ?? 0.55
      );
    });

    // Scramble on line 4
    if (scrambleEl) {
      tl.set(scrambleEl, { autoAlpha: 1 }, 0.75);
      tl.add(() => triggerScramble(0.85), 0.75);
    }

    // CTA button entrance — smooth back pop
    if (cta) {
      tl.to(cta, { autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(2)" }, 1.25);
    }

    // Role tagline & sub-taglines — crisp fade-in without remaining blur
    tl.to(
      taglines,
      {
        autoAlpha: 0.85,
        filter: "blur(0px)",
        duration: 0.75,
        ease: "power2.out",
        stagger: 0.1,
        clearProps: "filter",
      },
      1.05
    );

    return () => {
      tl.kill();
    };
  }, [isReady]);

  return (
    <section className="DemoHero-hero" id="home" ref={heroRef}>
      <h1 className="sr-only">
        Kaiwal Panchal — Applied AI &amp; Forward Deployed Engineer. Hey, I’m Kaiwal. I like computers, weird ideas, and making the two interact.
      </h1>

      {/* Living Fluted Caustic Glass Wave Shader */}
      <DemoShader theme={theme} className="DemoHero-shader" />

      {/* Entrance Radial Caustic Gradient Bloom */}
      <div ref={heroFlareRef} className="DemoHero-entranceFlare" aria-hidden="true" />

      {/* Seamless bottom fade & highlight masks */}
      <div className="DemoHero-bottomFade" />
      <div className="DemoHero-bottomHighlight" />

      {/* Animated K monogram — top left masthead */}
      <DemoLogo isReady={isReady} />

      {/* Role tagline — top right */}
      <p
        className="DemoHero-tagline DemoHero-taglineTop"
        data-subsplit="true"
        style={{ opacity: isReady ? undefined : 0 }}
      >
        Forward Deployed &amp; Applied AI Engineer building intelligent systems at Sylvr
      </p>

      {/* Hero Center Stage — centered by height & width relative to screen */}
      <div
        className="DemoHero-stage"
        aria-hidden="true"
        style={{ opacity: isReady ? 1 : 0 }}
      >
        {/* Line 1 — sans, left anchor */}
        <p className="DemoHero-lineSans" data-split="true">
          Hey, I’m Kaiwal.
        </p>

        {/* Lines 2 & 3 — indented staircase */}
        <div className="DemoHero-indentGroup">
          <p className="DemoHero-lineDisplay" data-split="true" style={{ "--ml": "2.4em" } as React.CSSProperties}>
            I like computers,
          </p>
          <p className="DemoHero-lineDisplay" data-split="true" style={{ "--ml": "4.6em" } as React.CSSProperties}>
            weird ideas,
          </p>
        </div>

        {/* Line 4 — conclusion with scramble */}
        <div className="DemoHero-conclusionGroup">
          <div className="DemoHero-infinityRow" style={{ "--ml": "0em" } as React.CSSProperties}>
            <p
              ref={scrambleRef}
              className="DemoHero-lineSans DemoHero-scrambleWord"
              data-scramble="true"
              onMouseEnter={() => triggerScramble(0.5)}
              onClick={() => triggerScramble(0.5)}
              data-cursor-label="SCRAMBLE"
            >
              and making the two interact.
            </p>
          </div>
        </div>

        {/* Bottom row: Line 6 tagline on left, Initialize Contact button on right */}
        <div className="DemoHero-ctaRow">
          <p className="DemoHero-tagline DemoHero-taglineCta" data-subsplit="true">
            Suspiciously obsessed with making things work.
          </p>
          <a
            ref={ctaRef}
            className="DemoHero-cta"
            href="mailto:kaiwalextra@gmail.com"
            data-cursor-label="CONTACT"
          >
            <span className="DemoHero-ctaInner">Initialize Contact</span>
          </a>
        </div>
      </div>
    </section>
  );
}
