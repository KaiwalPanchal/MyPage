"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import HiddenSnackToken from "@/components/circle-game/HiddenSnackToken";

const TICKS = Array.from({ length: 28 }, (_, e) => {
  const isMajor = e % 7 === 0;
  return {
    top: (19.25 * e) / 16, // in rem
    w: (isMajor ? 12 : 4) / 16,
    h: (e % 2 === 0 ? 1.6 : 1.0) / 16,
    c: isMajor ? "var(--accent-bright)" : e % 2 === 0 ? "#76889d" : "#1f2733",
  };
});

type GlyphKind = "pop" | "spin" | "burst";

interface Segment {
  text: string;
  em?: boolean;
  trail?: boolean; // keep a trailing space before the next segment
}

const PARAGRAPHS: { segments: Segment[]; glyph?: GlyphKind }[] = [
  {
    segments: [
      { text: "It usually starts with a stupidly simple question:", trail: true },
      { text: '"wait, can I actually build that?"', em: true, trail: true },
      { text: "Three hours later I'm deep in a problem nobody asked me to solve." },
    ],
    glyph: "spin",
  },
  {
    segments: [
      {
        text: "I like taking things apart, figuring out how they work, and putting them back together slightly differently. AI, code, hardware, music, data, 2am ideas. I'm bad at leaving a rabbit hole alone.",
      },
    ],
    glyph: "burst",
  },
  {
    segments: [
      {
        text: "I build the thing, then I build the thing that checks the thing. I benchmark stuff that doesn't need benchmarking and worry about edge cases that will probably never happen.",
      },
    ],
    glyph: "pop",
  },
  {
    segments: [
      {
        text: "Sometimes the result is genuinely useful. Sometimes it's completely unnecessary. I enjoy both equally.",
      },
    ],
  },
];

function Glyph({ kind }: { kind: GlyphKind }) {
  return (
    <span
      className="DemoAbout-glyph DemoAbout-inlineGlyph"
      data-w=""
      data-glyph=""
      data-anim={kind}
      aria-hidden="true"
    >
      <svg className="DemoAbout-glyphIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        {kind === "pop" && (
          <>
            <circle cx="6" cy="6" r="3" />
            <circle cx="18" cy="6" r="3" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="18" r="3" />
            <line x1="9" y1="6" x2="15" y2="6" />
            <line x1="6" y1="9" x2="6" y2="15" />
            <line x1="9" y1="18" x2="15" y2="18" />
            <line x1="18" y1="9" x2="18" y2="15" />
          </>
        )}
        {kind === "spin" && (
          <>
            <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
            <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
            <path d="M16 21h5v-5" />
          </>
        )}
        {kind === "burst" && (
          <>
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <rect x="9" y="9" width="6" height="6" />
            <line x1="9" y1="1" x2="9" y2="4" />
            <line x1="15" y1="1" x2="15" y2="4" />
            <line x1="9" y1="20" x2="9" y2="23" />
            <line x1="15" y1="20" x2="15" y2="23" />
            <line x1="20" y1="9" x2="23" y2="9" />
            <line x1="20" y1="14" x2="23" y2="14" />
            <line x1="1" y1="9" x2="4" y2="9" />
            <line x1="1" y1="14" x2="4" y2="14" />
          </>
        )}
      </svg>
    </span>
  );
}

export default function DemoAbout() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const railCapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const words = Array.from(
      section.querySelectorAll<HTMLElement>("[data-w]")
    ).filter(
      (el) => el.offsetParent !== null && (el.offsetWidth > 0 || el.offsetHeight > 0)
    );

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const baseOpacity = isMobile ? 0.32 : 0.14;

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const u = Math.min(
        1,
        Math.max(0, (0.85 * vh - rect.top) / (rect.height + 0.35 * vh))
      );
      const activeCount = u * (words.length + 6);

      words.forEach((el, idx) => {
        const factor = Math.min(1, Math.max(0, (activeCount - idx) / 5));
        el.style.opacity = (baseOpacity + (1 - baseOpacity) * factor).toFixed(3);

        const isLit = factor >= 0.85;
        const uBar = el.querySelector(".DemoAbout-uBar");
        if (uBar) {
          uBar.classList.toggle("DemoAbout-uRevealed", isLit);
        }

        if (el.hasAttribute("data-glyph")) {
          const wasLit = el.dataset.lit === "1";
          if (isLit && !wasLit) {
            el.dataset.lit = "1";
            const anim = el.dataset.anim;
            gsap.killTweensOf(el, "rotation,scale");
            if (anim === "spin") {
              gsap.to(el, {
                rotation: "+=180",
                duration: 0.7,
                ease: "back.out(1.8)",
              });
            } else if (anim === "pop") {
              gsap.timeline()
                .to(el, {
                  scale: 1.3,
                  rotation: "+=45",
                  duration: 0.22,
                  ease: "power3.out",
                })
                .to(el, {
                  scale: 1,
                  duration: 0.55,
                  ease: "elastic.out(1, 0.45)",
                });
            } else if (anim === "burst") {
              gsap.timeline()
                .to(el, {
                  scale: 0.7,
                  rotation: "-=30",
                  duration: 0.15,
                  ease: "power2.in",
                })
                .to(el, {
                  scale: 1,
                  rotation: "+=150",
                  duration: 0.6,
                  ease: "back.out(2)",
                });
            }
          } else if (!isLit && wasLit) {
            el.dataset.lit = "0";
          }
        }
      });

      const railCap = railCapRef.current;
      if (railCap) {
        const parent = railCap.parentElement;
        const maxTravel = parent
          ? Math.max(0, parent.clientHeight - railCap.offsetHeight)
          : 0;
        railCap.style.transform = `translateY(${(u * maxTravel).toFixed(2)}px)`;
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section className="DemoAbout-about" id="about" ref={sectionRef}>
      {/* Fluid Responsive Editorial Block — 100% collision-free on all viewports */}
      <div className="DemoAbout-fluidBlock">
        {PARAGRAPHS.map((para, pi) => (
          <p
            key={pi}
            className={`DemoAbout-paragraph${pi === 0 ? " DemoAbout-lead" : ""}`}
          >
            {para.segments.map((seg, si) =>
              seg.text.split(" ").filter(Boolean).map((word, wi, arr) => (
                <span
                  key={`${si}-${wi}`}
                  className={`DemoAbout-w${seg.em ? " DemoAbout-em" : ""}`}
                  data-w=""
                >
                  {word}
                  {wi < arr.length - 1 || seg.trail ? " " : ""}
                </span>
              ))
            )}
            {para.glyph && <Glyph kind={para.glyph} />}
          </p>
        ))}
      </div>

      {/* Side Precision Telemetry Rail */}
      <div className="DemoAbout-rail" aria-hidden="true">
        <div className="DemoAbout-railHeader">SIGNAL</div>
        <div className="DemoAbout-railTicks">
          {TICKS.map((t, idx) => (
            <div
              key={idx}
              className="DemoAbout-tick"
              style={{
                top: `${t.top}rem`,
                width: `${t.w}rem`,
                height: `${t.h}rem`,
                backgroundColor: t.c,
              }}
            />
          ))}
        </div>
        <div ref={railCapRef} className="DemoAbout-railCap" />

        {/* Hidden Snack Token for DevTools & Curious Observers */}
        <div style={{ position: "absolute", bottom: "-24px", left: "0", opacity: 0.6 }}>
          <HiddenSnackToken />
        </div>
      </div>
    </section>
  );
}
