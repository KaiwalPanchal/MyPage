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
  const centerBlockRef = useRef<HTMLDivElement | null>(null);
  const heroFlareRef = useRef<HTMLDivElement | null>(null);
  const scrambleRef = useRef<HTMLSpanElement | null>(null);
  const scrambleInvRef = useRef<HTMLSpanElement | null>(null);
  const ctaRef = useRef<HTMLAnchorElement | null>(null);
  const [isScrambling, setIsScrambling] = useState(false);

  // Reusable scramble effect function for intro and on-hover
  const triggerScramble = (duration: number = 0.9) => {
    const scrambleEl = scrambleRef.current;
    const scrambleInvEl = scrambleInvRef.current;
    if (!scrambleEl || isScrambling) return;

    setIsScrambling(true);
    const targetWord = "PRODUCTION";
    const charsSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_#λΣθΩ";
    const scrambleObj = { p: 0 };

    gsap.to(scrambleObj, {
      p: 1,
      duration: duration,
      ease: "power1.inOut",
      onUpdate: () => {
        const revealed = Math.floor(scrambleObj.p * targetWord.length);
        let str = targetWord.slice(0, revealed);
        for (let k = revealed; k < targetWord.length; k++) {
          str += charsSet[Math.floor(Math.random() * charsSet.length)];
        }
        if (scrambleEl) scrambleEl.textContent = str;
        if (scrambleInvEl) scrambleInvEl.textContent = str;
      },
      onComplete: () => {
        if (scrambleEl) scrambleEl.textContent = targetWord;
        if (scrambleInvEl) scrambleInvEl.textContent = targetWord;
        setIsScrambling(false);
      },
    });
  };

  useEffect(() => {
    if (!isReady) return;
    const hero = heroRef.current;
    if (!hero) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const splitLinesBase = hero.querySelectorAll<HTMLElement>("[data-split]");
    const splitLinesInv = hero.querySelectorAll<HTMLElement>("[data-split-inv]");
    const taglines = hero.querySelectorAll<HTMLElement>("[data-subsplit], [data-subsplit-inv]");
    const cta = ctaRef.current;
    const scrambleEl = scrambleRef.current;
    const scrambleInvEl = scrambleInvRef.current;
    const centerBlock = centerBlockRef.current;
    const heroFlare = heroFlareRef.current;

    if (prefersReduced) {
      if (heroFlare) heroFlare.style.display = "none";
      splitLinesBase.forEach((el) => {
        el.style.opacity = "1";
      });
      splitLinesInv.forEach((el) => {
        el.style.opacity = "1";
      });
      if (scrambleEl) scrambleEl.style.opacity = "1";
      if (scrambleInvEl) scrambleInvEl.style.opacity = "1";
      if (cta) {
        cta.style.opacity = "1";
        cta.style.transform = "none";
      }
      taglines.forEach((el) => {
        el.style.opacity = "0.75";
        el.style.filter = "none";
      });
      return;
    }

    // Wrap chars inside word containers to allow natural responsive wrapping
    const splitElements = (lines: NodeListOf<HTMLElement>) => {
      const allLineChars: HTMLElement[][] = [];
      lines.forEach((line) => {
        const text = line.textContent || "";
        line.innerHTML = "";
        line.style.opacity = "1";
        const chars: HTMLElement[] = [];
        const words = text.trim().split(/\s+/);

        words.forEach((word, wordIdx) => {
          const wordSpan = document.createElement("span");
          wordSpan.style.display = "inline-block";
          wordSpan.style.whiteSpace = "nowrap";

          for (const ch of word) {
            const charSpan = document.createElement("span");
            charSpan.textContent = ch;
            charSpan.style.display = "inline-block";
            charSpan.style.transform = "translateY(115%)";
            charSpan.style.opacity = "0";
            wordSpan.appendChild(charSpan);
            chars.push(charSpan);
          }

          line.appendChild(wordSpan);

          if (wordIdx < words.length - 1) {
            const space = document.createTextNode(" ");
            line.appendChild(space);
          }
        });

        allLineChars.push(chars);
      });
      return allLineChars;
    };

    const lineCharsBase = splitElements(splitLinesBase);
    const lineCharsInv = splitElements(splitLinesInv);

    if (cta) {
      gsap.set(cta, { autoAlpha: 0, scale: 0.92 });
    }
    taglines.forEach((t) => {
      gsap.set(t, { autoAlpha: 0, filter: "blur(14px)" });
    });
    if (scrambleEl) {
      gsap.set(scrambleEl, { autoAlpha: 0 });
    }
    if (scrambleInvEl) {
      gsap.set(scrambleInvEl, { autoAlpha: 0 });
    }

    // Entrance radial flare & dynamic 3D upward glide of hero as preloader curtain lifts
    if (heroFlare) {
      gsap.fromTo(
        heroFlare,
        { opacity: 0.95, scale: 0.65 },
        { opacity: 0, scale: 1.35, duration: 1.6, ease: "power3.out" }
      );
    }

    if (centerBlock) {
      gsap.fromTo(
        centerBlock,
        { y: 85, scale: 0.94, filter: "blur(14px)", opacity: 0 },
        { y: 0, scale: 1, filter: "blur(0px)", opacity: 1, duration: 1.25, ease: "power4.out" }
      );
    }

    const tl = gsap.timeline({ delay: 0.2 });

    // Animate lines sequentially for both base and inverted mask layers in exact sync
    const delays = [0, 0.32, 0.65];
    lineCharsBase.forEach((chars, i) => {
      const d = delays[i] ?? 0.65;
      tl.to(
        chars,
        {
          yPercent: -115,
          opacity: 1,
          ease: "power4.out",
          duration: 0.85,
          stagger: 0.03,
          clearProps: "transform",
        },
        d
      );
      if (lineCharsInv[i]) {
        tl.to(
          lineCharsInv[i],
          {
            yPercent: -115,
            opacity: 1,
            ease: "power4.out",
            duration: 0.85,
            stagger: 0.03,
            clearProps: "transform",
          },
          d
        );
      }
    });

    // Intro Scramble on "PRODUCTION"
    if (scrambleEl) {
      tl.set(scrambleEl, { autoAlpha: 1 }, 0.8);
      if (scrambleInvEl) {
        tl.set(scrambleInvEl, { autoAlpha: 1 }, 0.8);
      }
      tl.add(() => triggerScramble(1.1), 0.8);
    }

    // CTA Reveal
    if (cta) {
      tl.to(
        cta,
        { autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(2)" },
        1.85
      );
    }

    // Sub-taglines
    tl.to(
      taglines,
      {
        autoAlpha: 0.85,
        filter: "blur(0px)",
        duration: 1.0,
        ease: "power2.out",
        stagger: 0.12,
      },
      1.85
    );
  }, [isReady]);

  return (
    <section className="DemoHero-hero" id="home" ref={heroRef}>
      <h1 className="sr-only">
        Kaiwal Panchal — Applied AI &amp; Forward Deployed Engineer. Engineering Intelligence from Research to Deterministic Production.
      </h1>

      {/* Living Fluted Caustic Glass Wave Shader */}
      <DemoShader theme={theme} className="DemoHero-shader" />

      {/* Entrance Radial Caustic Gradient Bloom */}
      <div ref={heroFlareRef} className="DemoHero-entranceFlare" aria-hidden="true" />

      {/* Seamless bottom fade masks */}
      <div className="DemoHero-bottomFade" />
      <div className="DemoHero-bottomHighlight" />

      {/* Hero Center Block with Synchronized Base & Inverted Text Layers */}
      <div ref={centerBlockRef} className="DemoHero-centerBlock">
        <div className="DemoHero-textStack">
          {/* Base Layer: Frosted Platinum Silver Text over Dark Background */}
          <div className="DemoHero-textLayer DemoHero-layerBase">
            <div className="DemoHero-banner">
              <div className="DemoHero-line">
                <span className="DemoHero-lineSans" data-split="true">
                  Engineering Intelligence
                </span>
              </div>

              <div className="DemoHero-line">
                <span className="DemoHero-lineDisplay" data-split="true">
                  from research
                </span>
                <span className="DemoHero-lineSans" data-split="true">
                  to deterministic
                </span>
              </div>

              <div className="DemoHero-line">
                <span
                  ref={scrambleRef}
                  className="DemoHero-lineSans DemoHero-scrambleWord cursor-pointer select-none"
                  data-scramble="true"
                  onMouseEnter={() => triggerScramble(0.5)}
                  onClick={() => triggerScramble(0.5)}
                  data-cursor-label="SCRAMBLE"
                  title="Click or hover to scramble"
                >
                  PRODUCTION
                </span>
              </div>
            </div>

            <div className="DemoHero-subRow">
              <p className="DemoHero-tagline" data-subsplit="true">
                Forward Deployed &amp; Applied AI Engineer. Unapologetic nerd driven by uncompromising craft, deep technical curiosity, and a relentless bias to get shit done. Leading AI systems at Sylvr.
              </p>

              <a
                ref={ctaRef}
                className="DemoHero-cta"
                href="mailto:kaiwalextra@gmail.com"
                data-cursor-label="CONTACT"
              >
                <span className="DemoHero-ctaInner">
                  Initialize Contact
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 17L17 7" />
                    <path d="M7 7h10v10" />
                  </svg>
                </span>
              </a>
            </div>
          </div>

          {/* Inverted Layer: Deep Obsidian Text Masked to Living Caustic Wave & Mouse */}
          <div className="DemoHero-textLayer DemoHero-layerInverted" aria-hidden="true">
            <div className="DemoHero-banner">
              <div className="DemoHero-line">
                <span className="DemoHero-lineSans" data-split-inv="true">
                  Engineering Intelligence
                </span>
              </div>

              <div className="DemoHero-line">
                <span className="DemoHero-lineDisplay" data-split-inv="true">
                  from research
                </span>
                <span className="DemoHero-lineSans" data-split-inv="true">
                  to deterministic
                </span>
              </div>

              <div className="DemoHero-line">
                <span
                  ref={scrambleInvRef}
                  className="DemoHero-lineSans DemoHero-scrambleWord"
                >
                  PRODUCTION
                </span>
              </div>
            </div>

            <div className="DemoHero-subRow">
              <p className="DemoHero-tagline" data-subsplit-inv="true">
                Forward Deployed &amp; Applied AI Engineer. Unapologetic nerd driven by uncompromising craft, deep technical curiosity, and a relentless bias to get shit done. Leading AI systems at Sylvr.
              </p>

              {/* Invisible spacer matching CTA button to keep subRow height & alignment identical */}
              <div className="DemoHero-cta DemoHero-ctaGhost" aria-hidden="true">
                <span className="DemoHero-ctaInner">
                  Initialize Contact
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
