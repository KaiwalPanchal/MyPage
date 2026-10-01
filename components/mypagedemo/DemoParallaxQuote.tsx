"use client";

import React, { useEffect, useRef } from "react";

const BADGES = [
  {
    name: "LLM Routing",
    top: "2.5rem",
    left: "14rem",
    drift: 180,
    icon: (
      <svg className="DemoQuote-badgeIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="6" cy="18" r="3" />
        <circle cx="6" cy="6" r="3" />
        <circle cx="18" cy="6" r="3" />
        <path d="M6 9v3a3 3 0 0 0 3 3h6" />
        <path d="M18 9v9" />
      </svg>
    ),
  },
  {
    name: "Context Engineering",
    top: "3.5rem",
    left: "46rem",
    drift: -210,
    icon: (
      <svg className="DemoQuote-badgeIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    ),
  },
  {
    name: "Model Context Protocol (MCP)",
    top: "5rem",
    left: "75rem",
    drift: -160,
    icon: (
      <svg className="DemoQuote-badgeIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="6" height="6" rx="1" />
        <rect x="16" y="2" width="6" height="6" rx="1" />
        <rect x="9" y="16" width="6" height="6" rx="1" />
        <path d="M5 8v3a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8" />
        <path d="M12 13v3" />
      </svg>
    ),
  },
  {
    name: "Finetuning",
    top: "14.5rem",
    left: "13rem",
    drift: 190,
    icon: (
      <svg className="DemoQuote-badgeIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="21" x2="4" y2="14" />
        <line x1="4" y1="10" x2="4" y2="3" />
        <line x1="12" y1="21" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12" y2="3" />
        <line x1="20" y1="21" x2="20" y2="16" />
        <line x1="20" y1="12" x2="20" y2="3" />
        <line x1="1" y1="14" x2="7" y2="14" />
        <line x1="9" y1="8" x2="15" y2="8" />
        <line x1="17" y1="16" x2="23" y2="16" />
      </svg>
    ),
  },
  {
    name: "LLM Evals",
    top: "15rem",
    left: "48rem",
    drift: -180,
    icon: (
      <svg className="DemoQuote-badgeIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 11l3 3L22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
  },
  {
    name: "Guardrails",
    top: "19.5rem",
    left: "77rem",
    drift: -210,
    icon: (
      <svg className="DemoQuote-badgeIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    name: "MLOps",
    top: "28rem",
    left: "12rem",
    drift: 170,
    icon: (
      <svg className="DemoQuote-badgeIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.229-8-5.096 0-5.096 8 0 8 5.096 0 7.134-8 12.23-8z" />
      </svg>
    ),
  },
  {
    name: "AWS",
    top: "34rem",
    left: "40rem",
    drift: 200,
    icon: (
      <svg className="DemoQuote-badgeIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
      </svg>
    ),
  },
  {
    name: "Observability",
    top: "33rem",
    left: "74rem",
    drift: -170,
    icon: (
      <svg className="DemoQuote-badgeIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
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
