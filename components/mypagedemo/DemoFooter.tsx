"use client";

import React, { useEffect, useRef, useState } from "react";
import { portfolioData } from "@/data/portfolio";

export default function DemoFooter() {
  const footerRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const socials = portfolioData.connect.socials;

  return (
    <footer
      ref={footerRef}
      className={`DemoFooter-footer ${inView ? "DemoFooter-inView" : ""}`}
      id="footer"
    >
      <div className="DemoFooter-inner">
        {/* Animated Heading Mask Reveal */}
        <div className="DemoFooter-headingMask">
          <h2 className="DemoFooter-heading">GET SHIT DONE</h2>
        </div>

        {/* Mission Statement */}
        <p className="DemoFooter-mission">
          Driven by relentless curiosity, uncompromising craft, and quiet discipline. Whether reverse-engineering CAD internals, grounding LLM agents, or debugging at 3 AM — I care about building insane systems and getting shit done.{" "}
          <a
            href={`mailto:${portfolioData.connect.email}`}
            className="DemoFooter-writeLink"
            data-cursor-label="EMAIL"
          >
            Prefer to write? Send a note.
          </a>
        </p>

        {/* Direct Contact Button */}
        <a
          className="DemoFooter-contact"
          href={`mailto:${portfolioData.connect.email}`}
          data-cursor-label="WRITE"
          aria-label="Contact — send an email"
        >
          Contact
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

        {/* Social Cards Grid with cyanGrain hover */}
        <div className="DemoFooter-socialRow">
          {socials.map((social) => (
            <a
              key={social.name}
              className="DemoFooter-card"
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.name}
              data-cursor-label={social.name.toUpperCase()}
            >
              <div className="DemoFooter-cardIcon">
                {social.name === "GitHub" && (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                )}
                {social.name === "LinkedIn" && (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                )}
                {social.name === "X" && (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                )}
              </div>
              <div>
                <span className="DemoFooter-cardLabel">{social.name}</span>
                <div style={{ color: "var(--text-body)", fontSize: "0.85rem", marginTop: "0.25rem" }}>
                  {social.handle}
                </div>
              </div>
            </a>
          ))}

          {/* 4th Card: Sylvr */}
          <a
            className="DemoFooter-card"
            href="https://sylvr.io"
            target="_blank"
            rel="noopener noreferrer"
            data-cursor-label="SYLVR"
          >
            <div className="DemoFooter-cardIcon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
            </div>
            <div>
              <span className="DemoFooter-cardLabel">Sylvr.io</span>
              <div style={{ color: "var(--text-body)", fontSize: "0.85rem", marginTop: "0.25rem" }}>
                Lead Engineer
              </div>
            </div>
          </a>
        </div>

        {/* Copyright */}
        <p className="DemoFooter-copyright">
          © {portfolioData.personal.year} Kaiwal Panchal. All rights reserved.
        </p>

        {/* Legal / Meta */}
        <div className="DemoFooter-legal">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#works">Works</a>
          <a href="#blog">Blog</a>
        </div>

        {/* Smooth Back To Top Button */}
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
    </footer>
  );
}
