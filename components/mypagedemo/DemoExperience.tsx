"use client";

import React, { useEffect, useRef, useState } from "react";

const EXPERIENCES = [
  {
    year: "Present",
    role: "Lead Engineer",
    company: "Sylvr",
    badge: "CURRENT",
    website: "https://sylvr.io/",
    description:
      "Own end-to-end AI and backend architecture behind sylvr.io: 4-stage news-intelligence pipeline with 3-tier deterministic grounding guardrails, token-budgeted review extraction on open-weights Gemma, and brandOS e-commerce ingestion via Celery and Playwright.",
    tech: ["Python", "FastAPI", "MongoDB Atlas", "Celery", "Gemma", "Claude Haiku", "Playwright"],
  },
  {
    year: "2025",
    role: "AI & NLP Intern",
    company: "Sylvr",
    badge: "PROMOTED",
    website: "https://sylvr.io/",
    description:
      "Engineered multi-agent analytics workflows, automated PESTEL/market synthesis over unstructured feeds, and built review sentiment clustering pipelines. Promoted directly to Lead Engineer.",
    tech: ["Python", "NLP", "LangGraph", "MongoDB", "spaCy"],
  },
  {
    year: "2025",
    role: "Machine Learning Intern",
    company: "Town Plan Map",
    badge: "FORWARD DEPLOYED",
    website: "https://townplanmap.com/",
    description:
      "Forward deployed to municipal planning workflows: optimized production inference latency for computer-vision layout-extraction models and engineered automated parsers extracting cadastral plot dimensions, boundaries, and zoning rules from raw vector CAD drawings and municipal PDFs.",
    tech: ["Python", "Computer Vision", "CAD Parsing", "PyAutoCAD", "NLP", "QGIS"],
  },
  {
    year: "2024",
    role: "GenAI Intern",
    company: "Office Solutions PVT LTD",
    badge: "CLIENT DEPLOYMENT",
    website: "https://innovationalofficesolution.com/",
    description:
      "Deployed DecisionPulse natural-language analytics agent over live client Azure PostgreSQL with Google ADK routing and low-latency WebSocket streaming.",
    tech: ["GenAI", "Python", "Google ADK", "Azure PostgreSQL", "FastAPI", "WebSockets"],
  },
];

export default function DemoExperience() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`DemoExp-section ${inView ? "DemoMetrics-inView" : ""}`}
      id="experience"
    >
      {/* Section Header with Hairline Divider (aligned to container) */}
      <div className="DemoExp-headerWrap">
        <div className="DemoExp-header">
          <div>
            <h2 className="DemoExp-title">
              Engineering <em>Trajectory</em>
            </h2>
          </div>
          <p className="DemoExp-sub">
            Forward deployed &amp; applied AI systems architected across news intelligence, municipal CAD parsing, and real-time streaming agents.
          </p>
        </div>
      </div>

      {/* Vertical Stack with Full-Width Highlights & Aligned Inner Content */}
      <div className="DemoExp-list">
        {EXPERIENCES.map((job, idx) => (
          <a
            key={idx}
            href={job.website}
            target="_blank"
            rel="noopener noreferrer"
            className="DemoExp-row group"
            data-interactive="true"
            data-cursor-label="VISIT"
          >
            <div className="DemoExp-rowInner">
              {/* Year Column with Sliding Entrance Animation */}
              <div className="DemoExp-yearCol">
                <span className="DemoExp-year overflow-hidden">
                  <span
                    className="DemoMetrics-slide"
                    style={{ transitionDelay: `${(idx * 0.12).toFixed(2)}s` }}
                  >
                    {job.year}
                  </span>
                </span>
                <span className="DemoExp-currentBadge">{job.badge}</span>
              </div>

              {/* Main Architecture & Description Column */}
              <div className="DemoExp-mainCol">
                <div className="DemoExp-role overflow-hidden">
                  <span
                    className="DemoMetrics-slide"
                    style={{ transitionDelay: `${(idx * 0.12 + 0.08).toFixed(2)}s` }}
                  >
                    {job.role}
                  </span>
                  <span className="DemoExp-company">@ {job.company}</span>
                </div>

                <p className="DemoExp-desc">{job.description}</p>
              </div>

              {/* Right Column: Tech Badges + Diagonal Link Arrow */}
              <div className="DemoExp-techCol">
                <div className="DemoExp-arrowWrap" aria-hidden="true">
                  <svg
                    className="DemoExp-arrowIcon"
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
                </div>

                <div className="DemoExp-badgeGroup">
                  {job.tech.map((t) => (
                    <span key={t} className="DemoExp-techBadge">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
