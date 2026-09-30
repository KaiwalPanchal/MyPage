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

  // Scramble effect function for intro and on-hover
  const triggerScramble = (duration: number = 0.9) => {
    const scrambleEl = scrambleRef.current;
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
      },
      onComplete: () => {
        if (scrambleEl) scrambleEl.textContent = targetWord;
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

    const splitLines = hero.querySelectorAll<HTMLElement>("[data-split]");
    const taglines = hero.querySelectorAll<HTMLElement>("[data-subsplit]");
    const cta = ctaRef.current;
    const scrambleEl = scrambleRef.current;
    const heroFlare = heroFlareRef.current;

    if (prefersReduced) {
      if (heroFlare) heroFlare.style.display = "none";
      splitLines.forEach((el) => { el.style.opacity = "1"; });
      if (scrambleEl) scrambleEl.style.opacity = "1";
      if (cta) { cta.style.opacity = "1"; cta.style.transform = "none"; }
      taglines.forEach((el) => { el.style.opacity = "0.7"; el.style.filter = "none"; });
      return;
    }

    // Wrap chars for per-character stagger animation
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

    // Entrance flare
    if (heroFlare) {
      gsap.fromTo(
        heroFlare,
        { opacity: 0.95, scale: 0.65 },
        { opacity: 0, scale: 1.35, duration: 1.6, ease: "power3.out" }
      );
    }

    const tl = gsap.timeline({ delay: 0.2 });

    // Lines
    const delays = [0, 0.35, 0.7];
    lineChars.forEach((chars, i) => {
      const d = delays[i] ?? 0.7;
      tl.to(
        chars,
        {
          yPercent: -115,
          opacity: 1,
          ease: "power4.out",
          duration: 0.9,
          stagger: 0.035,
          clearProps: "transform",
        },
        d
      );
    });

    // Intro scramble
    if (scrambleEl) {
      tl.set(scrambleEl, { autoAlpha: 1 }, 0.85);
      tl.add(() => triggerScramble(1.1), 0.85);
    }

    // CTA
    if (cta) {
      tl.to(
        cta,
        { autoAlpha: 1, scale: 1, duration: 0.45, ease: "back.out(2)" },
        1.95
      );
    }

    // Sub-taglines
    tl.to(
      taglines,
      {
        autoAlpha: 0.7,
        filter: "blur(0px)",
        duration: 1.1,
        ease: "power2.out",
        stagger: 0.14,
      },
      1.95
    );

    return () => { tl.kill(); };
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

      {/* kstoimenov pattern: text floats absolutely over shader — no scrim, no panel */}
      <div className="DemoHero-banner" aria-hidden="true">
        <p
          className="DemoHero-lineSans"
          data-split="true"
          style={{ "--l": "26%", "--t": "18.5rem" } as React.CSSProperties}
        >
          Engineering Intelligence
        </p>
        <p
          className="DemoHero-lineDisplay"
          data-split="true"
          style={{ "--l": "52%", "--t": "24rem" } as React.CSSProperties}
        >
          from research
        </p>
        <p
          className="DemoHero-lineSans"
          data-split="true"
          style={{ "--l": "25%", "--t": "29.5rem" } as React.CSSProperties}
        >
          to deterministic
        </p>
        <p
          ref={scrambleRef}
          className="DemoHero-lineSans DemoHero-scrambleWord"
          data-scramble="true"
          style={{ "--l": "46%", "--t": "35rem" } as React.CSSProperties}
          onMouseEnter={() => triggerScramble(0.5)}
          onClick={() => triggerScramble(0.5)}
          data-cursor-label="SCRAMBLE"
        >
          PRODUCTION
        </p>
      </div>

      {/* CTA pill */}
      <a
        ref={ctaRef}
        className="DemoHero-cta"
        href="mailto:kaiwalextra@gmail.com"
        data-cursor-label="CONTACT"
      >
        <span className="DemoHero-ctaInner">Initialize Contact</span>
      </a>

      {/* Taglines at bottom */}
      <p className="DemoHero-tagline DemoHero-taglineLeft" data-subsplit="true">
        Forward Deployed &amp; Applied AI Engineer building intelligent systems at Sylvr
      </p>
      <p className="DemoHero-tagline DemoHero-taglineRight" data-subsplit="true">
        Unapologetic nerd driven by craft, curiosity, and a relentless bias to ship
      </p>
    </section>
  );
}
