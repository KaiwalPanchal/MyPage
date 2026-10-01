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
  const scrambleRef = useRef<HTMLSpanElement | null>(null);
  const ctaRef = useRef<HTMLAnchorElement | null>(null);
  const [isScrambling, setIsScrambling] = useState(false);

  // Clear any old drag positions from previous sessions
  useEffect(() => {
    try {
      localStorage.removeItem("mypagedemo_hero_positions_v2");
    } catch {
      // Ignore
    }
  }, []);

  const triggerScramble = (duration: number = 0.85) => {
    const scrambleEl = scrambleRef.current;
    if (!scrambleEl || isScrambling) return;
    setIsScrambling(true);
    const target = "I DON'T NEED INFINITY";
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_'λΣθΩ#$ ";
    const obj = { p: 0 };
    gsap.to(obj, {
      p: 1,
      duration,
      ease: "power2.inOut",
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

  // GSAP Entrance Choreography
  useEffect(() => {
    if (!isReady) return;
    const hero = heroRef.current;
    if (!hero) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const splitLines = hero.querySelectorAll<HTMLElement>("[data-split]");
    const fadeEls = hero.querySelectorAll<HTMLElement>("[data-fade]");
    const cta = ctaRef.current;
    const scrambleEl = scrambleRef.current;
    const heroFlare = heroFlareRef.current;

    if (prefersReduced) {
      if (heroFlare) heroFlare.style.display = "none";
      splitLines.forEach((el) => { el.style.opacity = "1"; });
      fadeEls.forEach((el) => { el.style.opacity = "1"; el.style.filter = "none"; });
      if (scrambleEl) scrambleEl.style.opacity = "1";
      if (cta) { cta.style.opacity = "1"; cta.style.transform = "none"; }
      return;
    }

    // Wrap words & chars for responsive per-character upward reveal without breaking words
    const lineChars: HTMLElement[][] = [];
    splitLines.forEach((line) => {
      const text = line.textContent?.trim() || "";
      line.innerHTML = "";
      line.style.opacity = "1";
      const chList: HTMLElement[] = [];
      const words = text.split(/\s+/);

      words.forEach((word, wIdx) => {
        const wordSpan = document.createElement("span");
        wordSpan.className = "DemoHero-word";

        for (const ch of word) {
          const span = document.createElement("span");
          span.textContent = ch;
          span.className = "DemoHero-char";
          wordSpan.appendChild(span);
          chList.push(span);
        }
        line.appendChild(wordSpan);

        if (wIdx < words.length - 1) {
          const space = document.createElement("span");
          space.className = "DemoHero-space";
          space.innerHTML = "&nbsp;";
          line.appendChild(space);
        }
      });

      lineChars.push(chList);
    });

    if (cta) gsap.set(cta, { autoAlpha: 0, scale: 0.92, y: 15 });
    fadeEls.forEach((t) => gsap.set(t, { autoAlpha: 0, filter: "blur(12px)", y: 10 }));
    if (scrambleEl) gsap.set(scrambleEl, { autoAlpha: 0, y: 10 });

    if (heroFlare) {
      gsap.fromTo(
        heroFlare,
        { opacity: 0.9, scale: 0.7 },
        { opacity: 0, scale: 1.4, duration: 1.8, ease: "power3.out" }
      );
    }

    const tl = gsap.timeline({ delay: 0.25 });

    // Deliberate editorial stagger across header nameplate, Line 1, Line 2, Line 3, Thank God
    const delays = [0.05, 0.24, 0.44, 0.62, 0.82];
    lineChars.forEach((chars, i) => {
      tl.to(
        chars,
        {
          yPercent: -100,
          opacity: 1,
          ease: "power4.out",
          duration: 0.95,
          stagger: 0.022,
          clearProps: "transform",
        },
        delays[i] ?? 0.82
      );
    });

    // Reveal interactive scramble text
    if (scrambleEl) {
      tl.to(
        scrambleEl,
        { autoAlpha: 1, y: 0, duration: 0.6, ease: "power3.out" },
        1.05
      );
      tl.add(() => triggerScramble(1.1), 1.05);
    }

    // Reveal CTA with subtle spring
    if (cta) {
      tl.to(
        cta,
        { autoAlpha: 1, scale: 1, y: 0, duration: 0.55, ease: "back.out(1.8)" },
        1.25
      );
    }

    // Reveal perimeter metadata & bottom editorial columns
    tl.to(
      fadeEls,
      {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.0,
        ease: "power2.out",
        stagger: 0.12,
      },
      1.3
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

      {/* Living Fluted Caustic Wave Shader Background */}
      <DemoShader theme={theme} className="DemoHero-shader" />

      {/* Entrance Radial Caustic Gradient Bloom */}
      <div ref={heroFlareRef} className="DemoHero-entranceFlare" aria-hidden="true" />

      {/* Seamless bottom fade masks */}
      <div className="DemoHero-bottomFade" />
      <div className="DemoHero-bottomHighlight" />

      {/* Hero Outer Frame (Anchors edges & perfectly centers content) */}
      <div className="DemoHero-frame">
        {/* Top Header Bar */}
        <header className="DemoHero-topBar">
          <div className="DemoHero-identity">
            <p className="DemoHero-name" data-split="true" aria-hidden="true">
              KAIWAL PANCHAL
            </p>
            <span className="DemoHero-coordBadge" data-fade="true">
              <span className="DemoHero-pulseDot" />
              <span>SF • 37.77° N, 122.41° W</span>
            </span>
          </div>

          <div className="DemoHero-statusBadge" data-fade="true">
            <span className="DemoHero-statusDot" />
            <span className="DemoHero-statusText">AVAILABLE FOR HIGH-IMPACT SYSTEMS</span>
          </div>
        </header>

        {/* Centerpiece: Sculptural Editorial Typographic Cascade */}
        <div className="DemoHero-stage">
          <div className="DemoHero-composition" aria-hidden="true">
            {/* Line 1: Swiss Grotesque Sans Anchor (Left-aligned) */}
            <div className="DemoHero-lineWrap DemoHero-lineWrap1">
              <p className="DemoHero-lineSans" data-split="true">
                Infinite agents. Infinite tokens.
              </p>
            </div>

            {/* Line 2: Editorial Display Serif Italic (Indented) */}
            <div className="DemoHero-lineWrap DemoHero-lineWrapIndent">
              <p className="DemoHero-lineDisplay" data-split="true">
                Eventually, one builds
              </p>
            </div>

            {/* Line 3: Editorial Display Serif Italic (Same Indent Alignment as Line 2) */}
            <div className="DemoHero-lineWrap DemoHero-lineWrapIndent">
              <p className="DemoHero-lineDisplay" data-split="true">
                something great.
              </p>
            </div>

            {/* Resolution Block: "Thank God" + Scramble + CTA */}
            <div className="DemoHero-resolutionBlock">
              <p className="DemoHero-thankGod" data-split="true">
                Thank God
              </p>

              <div className="DemoHero-actionRow">
                <span
                  ref={scrambleRef}
                  className="DemoHero-scrambleText"
                  data-scramble="true"
                  onClick={() => triggerScramble(0.55)}
                  onMouseEnter={() => triggerScramble(0.55)}
                  data-cursor-label="SCRAMBLE"
                >
                  I DON&apos;T NEED INFINITY
                </span>

                <a
                  ref={ctaRef}
                  className="DemoHero-cta"
                  href="mailto:kaiwalextra@gmail.com"
                  data-cursor-label="CONTACT"
                >
                  <span className="DemoHero-ctaInner">
                    <span>Initialize Contact</span>
                    <svg
                      className="DemoHero-ctaArrow"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Dual Balanced Editorial Columns (Bottom Tier) */}
        <footer className="DemoHero-bottomBar">
          <div className="DemoHero-colLeft" data-fade="true">
            <p className="DemoHero-colText">
              Forward Deployed &amp; Applied AI<br />
              Engineer building intelligent<br />
              systems at Sylvr
            </p>
          </div>

          <div className="DemoHero-colRight" data-fade="true">
            <p className="DemoHero-colText DemoHero-colTextRight">
              Suspiciously obsessed with<br />
              making things work.
            </p>
          </div>
        </footer>
      </div>
    </section>
  );
}
