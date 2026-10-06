"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { portfolioData } from "@/data/portfolio";
import FooterHiddenGlyph from "@/components/circle-game/FooterHiddenGlyph";

interface SocialCard {
  index: string;
  name: string;
  handle: string;
  url: string;
  badge: string;
  description: string;
  tags: string[];
  icon: React.ReactNode;
  cta: string;
}

const GitHubIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const XIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const SylvrIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

export default function DemoFooter() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const socials = portfolioData.connect.socials;

  const cards: SocialCard[] = [
    {
      index: "01",
      name: "GitHub",
      handle: socials.find((s) => s.name === "GitHub")?.handle ?? "@KaiwalPanchal",
      url: socials.find((s) => s.name === "GitHub")?.url ?? "https://github.com/KaiwalPanchal",
      badge: "Source",
      description: "Repos, side projects, and open-source contributions — where the real work lives.",
      tags: ["Next.js", "Python", "LangGraph"],
      cta: "View repos",
      icon: <GitHubIcon />,
    },
    {
      index: "02",
      name: "LinkedIn",
      handle: socials.find((s) => s.name === "LinkedIn")?.handle ?? "kaiwal-panchal",
      url: socials.find((s) => s.name === "LinkedIn")?.url ?? "https://linkedin.com/in/kaiwal-panchal",
      badge: "Professional",
      description: "Work history, shipped projects, and the professional narrative behind the engineering.",
      tags: ["AI Engineering", "FDE", "Sylvr"],
      cta: "Connect",
      icon: <LinkedInIcon />,
    },
    {
      index: "03",
      name: "X / Twitter",
      handle: socials.find((s) => s.name === "X")?.handle ?? "@kaiwalp",
      url: socials.find((s) => s.name === "X")?.url ?? "https://x.com/kaiwalp",
      badge: "Thoughts",
      description: "Half-baked ideas, engineering rants, and the occasional take worth reading.",
      tags: ["Hot Takes", "Building in Public"],
      cta: "Follow",
      icon: <XIcon />,
    },
    {
      index: "04",
      name: "Sylvr.io",
      handle: "Lead Engineer",
      url: "https://sylvr.io",
      badge: "Currently",
      description: "Where I spend most of my waking hours — building AI systems that make money move smarter.",
      tags: ["FinTech", "AI", "Production"],
      cta: "See the work",
      icon: <SylvrIcon />,
    },
  ];

  return (
    <footer
      ref={sectionRef}
      className={`DemoFooter-footer ${inView ? "DemoFooter-inView" : ""}`}
      id="footer"
    >
      <div className="DemoFooter-inner">
        {/* Header */}
        <div className="DemoFooter-header">
          <div className="DemoFooter-headerCol">
            <div className="DemoFooter-headingMask">
              <h2 className="DemoFooter-heading">
                Let&apos;s <em>Connect</em>
              </h2>
            </div>
            <p className="DemoFooter-mission">
              Driven by uncompromising craft and a relentless bias to ship.{" "}
              <a
                href={`mailto:${portfolioData.connect.email}`}
                className="DemoFooter-writeLink"
                data-cursor-label="EMAIL"
              >
                Prefer email? Send a note.
              </a>
            </p>
          </div>

          <a
            className="DemoFooter-contact"
            href={`mailto:${portfolioData.connect.email}`}
            data-cursor-label="WRITE"
            aria-label="Contact — send an email"
          >
            <span>Initialize Contact</span>
            <svg
              className="DemoFooter-contactArrow"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </a>
        </div>

        {/* Social Cards — same structure as My 2 Cents */}
        <div className="DemoFooter-grid">
          {cards.map((card, idx) => {
            const baseDelay = idx * 0.15;
            return (
              <a
                key={card.name}
                href={card.url}
                target="_blank"
                rel="noopener noreferrer"
                className="DemoFooter-card"
                data-interactive="true"
                data-cursor-label={card.cta.toUpperCase()}
              >
                {/* Index + Badge Row */}
                <div className="DemoFooter-indexRow">
                  <div className="DemoFooter-valueWrap">
                    <p className="DemoFooter-indexNum">
                      <span
                        className="DemoFooter-slide"
                        style={{ transitionDelay: `${(baseDelay + 0.00).toFixed(2)}s` }}
                      >
                        {card.index}
                      </span>
                    </p>
                    <p className="DemoFooter-valueLabel">
                      <span
                        className="DemoFooter-slide"
                        style={{ transitionDelay: `${(baseDelay + 0.18).toFixed(2)}s` }}
                      >
                        {card.badge}
                      </span>
                    </p>
                  </div>
                  <div className="DemoFooter-cardIconWrap">
                    <span
                      className="DemoFooter-slide"
                      style={{ transitionDelay: `${(baseDelay + 0.12).toFixed(2)}s` }}
                    >
                      {card.icon}
                    </span>
                  </div>
                </div>

                {/* Content Block */}
                <div className="DemoFooter-contentBlock">
                  <div className="DemoFooter-titleWrap">
                    <h3 className="DemoFooter-cardTitle">
                      <span
                        className="DemoFooter-slide"
                        style={{ transitionDelay: `${(baseDelay + 0.22).toFixed(2)}s` }}
                      >
                        {card.name}
                      </span>
                    </h3>
                  </div>
                  <div className="DemoFooter-descWrap">
                    <p className="DemoFooter-cardHandle">
                      <span
                        className="DemoFooter-slide"
                        style={{ transitionDelay: `${(baseDelay + 0.26).toFixed(2)}s` }}
                      >
                        {card.handle}
                      </span>
                    </p>
                    <p className="DemoFooter-cardExcerpt">
                      <span
                        className="DemoFooter-slide"
                        style={{ transitionDelay: `${(baseDelay + 0.32).toFixed(2)}s` }}
                      >
                        {card.description}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Footer — tags + arrow CTA */}
                <div className="DemoFooter-cardFooter">
                  <div className="DemoFooter-tagGroup">
                    {card.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="DemoFooter-techTag"
                        style={{ transitionDelay: `${(baseDelay + 0.36 + tIdx * 0.04).toFixed(2)}s` }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="DemoFooter-readMore">
                    <span className="DemoFooter-readLabel">{card.cta}</span>
                    <div className="DemoFooter-arrowCircle">
                      <ArrowIcon />
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>

        {/* Bottom bar */}
        <div className="DemoFooter-bottom">
          <p className="DemoFooter-copyright">
            © {portfolioData.personal.year} Kaiwal Panchal. All rights reserved.
          </p>
          <nav className="DemoFooter-legal">
            <a href="#home">Home</a>
            <a href="#about">About</a>
            <a href="#works">Works</a>
            <a href="#blog">My 2 Cents</a>
          </nav>
          {/* Secret Abyss Coordinate Glyph & Circle Hiding Spot */}
          <FooterHiddenGlyph />
          <button
            type="button"
            className="DemoFooter-logoBtn"
            aria-label="Back to top"
            onClick={scrollToTop}
            data-cursor-label="TOP"
          >
            <svg
              className="DemoFooter-arrowUp"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}
