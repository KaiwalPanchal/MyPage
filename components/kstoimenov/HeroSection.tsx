"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import HeroShader from "./HeroShader";
import HeroLogoCanvas from "./HeroLogoCanvas";

export default function HeroSection({ isReady = true }: { isReady?: boolean }) {
  const heroRef = useRef<HTMLElement | null>(null);
  const scrambleRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLAnchorElement | null>(null);

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

    if (prefersReduced) {
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

    // Wrap chars in split lines
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

    if (cta) {
      gsap.set(cta, { autoAlpha: 0, scale: 0.9 });
    }
    taglines.forEach((t) => {
      gsap.set(t, { autoAlpha: 0, filter: "blur(16px)" });
    });
    if (scrambleEl) {
      gsap.set(scrambleEl, { autoAlpha: 0 });
    }

    const tl = gsap.timeline({ delay: 0.2 });

    // Animate lines
    const delays = [0, 0.35, 0.7];
    lineChars.forEach((chars, i) => {
      const d = delays[i] ?? 0.7;
      tl.to(
        chars,
        {
          yPercent: -115, // from translateY(115%) to translateY(0)
          opacity: 1,
          ease: "power4.out",
          duration: 0.9,
          stagger: 0.035,
        },
        d
      );
    });

    // Animate scramble on "remarkable"
    const targetWord = "remarkable";
    const charsSet = "abcdefghijklmnopqrstuvwxyz";
    if (scrambleEl) {
      tl.set(scrambleEl, { autoAlpha: 1 }, 0.85);

      const scrambleObj = { p: 0 };
      tl.to(
        scrambleObj,
        {
          p: 1,
          duration: 1.1,
          ease: "none",
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
          },
        },
        0.85
      );
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

    return () => {
      tl.kill();
    };
  }, [isReady]);

  return (
    <section className="Hero-module___w2HtG__hero" id="home" ref={heroRef}>
      <h1 className="sr-only">
        From Wireframes to Wow’s — elevating UX to the remarkable
      </h1>

      <HeroShader />

      <div className="Hero-module___w2HtG__bottomFade" />
      <div className="Hero-module___w2HtG__bottomHighlight" />

      <a href="#home" aria-label="Home" style={{ display: "contents" }}>
        <HeroLogoCanvas />
      </a>

      <div className="Hero-module___w2HtG__banner" aria-hidden="true">
        <p
          className="Hero-module___w2HtG__lineSans"
          data-split="true"
          style={{ "--l": "26.30%", "--t": "18.5625rem" } as React.CSSProperties}
        >
          From Wireframes
        </p>
        <p
          className="Hero-module___w2HtG__lineDisplay"
          data-split="true"
          style={{ "--l": "53.07%", "--t": "24.1875rem" } as React.CSSProperties}
        >
          to Wow’s
        </p>
        <p
          className="Hero-module___w2HtG__lineSans"
          data-split="true"
          style={{ "--l": "25.83%", "--t": "29.8125rem" } as React.CSSProperties}
        >
          elevating UX to the
        </p>
        <p
          ref={scrambleRef}
          className="Hero-module___w2HtG__lineDisplay"
          data-scramble="true"
          style={{ "--l": "46.61%", "--t": "35.4375rem" } as React.CSSProperties}
        >
          remarkable
        </p>
      </div>

      <a
        ref={ctaRef}
        className="Hero-module___w2HtG__cta"
        data-cta="true"
        href="https://cal.eu/krs.design/30min"
        target="_blank"
        rel="noopener noreferrer"
      >
        <span className="Hero-module___w2HtG__ctaInner">Book a call</span>
      </a>

      <p
        className="Hero-module___w2HtG__tagline Hero-module___w2HtG__taglineLeft"
        data-subsplit="true"
      >
        Design lead shaping product systems and AI-driven experiences
      </p>
      <p
        className="Hero-module___w2HtG__tagline Hero-module___w2HtG__taglineRight"
        data-subsplit="true"
      >
        For founders who need it shipped, not workshopped
      </p>
    </section>
  );
}
