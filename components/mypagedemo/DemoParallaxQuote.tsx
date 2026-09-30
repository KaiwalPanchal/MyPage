"use client";

import React, { useEffect, useRef } from "react";

const BADGES = [
  {
    name: "Python 3.12",
    top: "3rem",
    left: "15rem",
    drift: 220,
    icon: (
      <svg className="DemoQuote-badgeIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2v20M2 12h20" />
      </svg>
    ),
  },
  {
    name: "LangGraph Multi-Agent",
    top: "5rem",
    left: "95rem",
    drift: -240,
    icon: (
      <svg className="DemoQuote-badgeIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" /><path d="m4.93 4.93 4.24 4.24M14.83 14.83l4.24 4.24" />
      </svg>
    ),
  },
  {
    name: "FastAPI Streaming",
    top: "17rem",
    left: "8rem",
    drift: 180,
    icon: (
      <svg className="DemoQuote-badgeIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    name: "MongoDB Atlas",
    top: "22rem",
    left: "105rem",
    drift: -200,
    icon: (
      <svg className="DemoQuote-badgeIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2C6.5 2 2 6.5 2 12c0 4.5 3 8 7 9.5 0-3 1-5 2-8-2 0-3-2-3-4 0-3 2.5-5.5 5.5-5.5" />
      </svg>
    ),
  },
  {
    name: "Gemma & Claude Routing",
    top: "32rem",
    left: "22rem",
    drift: 190,
    icon: (
      <svg className="DemoQuote-badgeIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" /><path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
      </svg>
    ),
  },
  {
    name: "Docker Containers",
    top: "34rem",
    left: "88rem",
    drift: 160,
    icon: (
      <svg className="DemoQuote-badgeIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      </svg>
    ),
  },
];

export default function DemoParallaxQuote() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const line1Ref = useRef<HTMLParagraphElement | null>(null);
  const line2Ref = useRef<HTMLParagraphElement | null>(null);
  const line3Ref = useRef<HTMLParagraphElement | null>(null);
  const badgeRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const onScroll = () => {
      if (window.innerWidth <= 768) {
        if (line1Ref.current) line1Ref.current.style.transform = "none";
        if (line2Ref.current) line2Ref.current.style.transform = "none";
        if (line3Ref.current) line3Ref.current.style.transform = "none";
        badgeRefs.current.forEach((el) => {
          if (el) el.style.transform = "none";
        });
        return;
      }

      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = (vh - rect.top) / (rect.height + vh) - 0.5; // -0.5 to 0.5

      if (line1Ref.current) {
        line1Ref.current.style.transform = `translateX(${progress * 220}px)`;
      }
      if (line2Ref.current) {
        line2Ref.current.style.transform = `translateX(${progress * -260}px)`;
      }
      if (line3Ref.current) {
        line3Ref.current.style.transform = `translateX(${progress * 180}px)`;
      }

      badgeRefs.current.forEach((el, idx) => {
        if (!el) return;
        const drift = BADGES[idx]?.drift || 150;
        el.style.transform = `translateX(${progress * drift}px)`;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="DemoQuote-quote" id="quote" ref={sectionRef}>
      <div className="DemoQuote-content" aria-hidden="true">
        {/* Line 1 */}
        <p
          ref={line1Ref}
          className="DemoQuote-line"
          style={{ top: "4.5rem", left: "14.5rem" }}
        >
          ENGINEERING AT SCALE
        </p>

        {/* Line 2 with Display Italic */}
        <p
          ref={line2Ref}
          className="DemoQuote-line DemoQuote-lineSerif"
          style={{ top: "16rem", left: "28rem" }}
        >
          orchestrating agents
        </p>

        {/* Line 3 */}
        <p
          ref={line3Ref}
          className="DemoQuote-line"
          style={{ top: "27.5rem", left: "18rem" }}
        >
          GROUNDED IN DATA
        </p>

        {/* Floating Tech Badges (Parallax on desktop, clean wrapped cloud on mobile) */}
        <div className="DemoQuote-badgeCloud">
          {BADGES.map((badge, idx) => (
            <div
              key={idx}
              ref={(el) => {
                badgeRefs.current[idx] = el;
              }}
              className="DemoQuote-badge"
              style={{
                top: badge.top,
                left: badge.left,
              }}
            >
              {badge.icon}
              <span>{badge.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
