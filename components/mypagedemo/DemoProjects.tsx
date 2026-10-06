"use client";

import React, { useEffect, useRef, useState } from "react";

export interface ProjectItem {
  id: string;
  tag: string;
  index: string;
  title: string;
  titleAccent?: string;
  description: string;
  role: string;
  url: string;
  isExternal?: boolean;
  mainImage: {
    src: string;
    alt: string;
    badge?: string;
    fit?: "cover" | "contain";
    bg?: string;
  };
  sideImage: {
    src: string;
    alt: string;
    caption?: string;
    fit?: "cover" | "contain";
    bg?: string;
    padding?: string;
  };
  tech: string[];
}

export const PROJECTS: ProjectItem[] = [
  {
    id: "airvon",
    tag: "HVAC & Cleanrooms",
    index: "01",
    title: "Airvon Engineering",
    titleAccent: "Turnkey Cleanrooms",
    description:
      "Turnkey HVAC design, modular cleanrooms, and NABH healthcare facility interface in Ahmedabad. Engineered around ISO 14644, WHO-GMP, and USFDA standards with interactive system layouts, technical validation documentation, and responsive architectural aesthetics.",
    role: "Frontend & Web Interface Engineering",
    url: "https://airvon.in/",
    isExternal: true,
    mainImage: {
      src: "/MyPage/images/projects/airvon-hero.webp",
      alt: "Airvon — HVAC Engineering & Cleanroom Contractors Ahmedabad",
      badge: "Production Web Platform",
    },
    sideImage: {
      src: "/MyPage/images/projects/airvon-og.webp",
      alt: "Airvon Technical Blueprint A-01 Arrangement",
      caption: "Blueprint Spec · Rev C",
      fit: "contain",
      bg: "#050811",
      padding: "1rem",
    },
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Technical Blueprints", "ISO Validation"],
  },
  {
    id: "sylvr",
    tag: "Brand Intelligence",
    index: "02",
    title: "Sylvr Intelligence",
    titleAccent: "Platform UI",
    description:
      "The intelligence layer for Indian consumer brands tracking 50,000+ D2C entities. Architected the interactive web platform, platform economics dashboards, automated PESTEL & market synthesis flows, and live metric explorers.",
    role: "Lead Systems & Frontend Architecture",
    url: "https://sylvr.io/",
    isExternal: true,
    mainImage: {
      src: "/MyPage/images/projects/sylvr-hero.webp",
      alt: "Sylvr — Intelligence Layer for Indian Consumer Brands",
      badge: "Real-Time Intelligence UI",
    },
    sideImage: {
      src: "/MyPage/images/projects/sylvr-detail.webp",
      alt: "Sylvr Unit Economics Planner and Diagnostics",
      caption: "Unit Economics & Diagnostic Tools",
      fit: "cover",
      bg: "#fbfbfd",
    },
    tech: ["Next.js", "React", "Tailwind CSS", "Streaming UI", "Data Analytics"],
  },
  {
    id: "mypage",
    tag: "Creative Dev & Shaders",
    index: "03",
    title: "Kaiwal Panchal",
    titleAccent: "Interactive Portfolio",
    description:
      "Bespoke personal portfolio featuring custom WebGL GPU caustic wave shaders, Lenis inertia scrolling, GSAP scrub typography, dynamic highlight masking, and a hidden interactive secret game system.",
    role: "Creative Development & Interaction Design",
    url: "https://kaiwalpanchal.github.io/MyPage/",
    isExternal: true,
    mainImage: {
      src: "/MyPage/images/projects/mypage-hero.webp",
      alt: "Kaiwal Panchal Portfolio — GPU Caustic Shader & Kinetic Typography",
      badge: "Interactive Shader Sculpture",
    },
    sideImage: {
      src: "/MyPage/images/projects/mypage-detail.webp",
      alt: "Kaiwal Panchal Portfolio — Word-by-word reading flow and telemetry rail",
      caption: "Telemetry Rail & Secret Game HUD",
      fit: "cover",
      bg: "#05070a",
    },
    tech: ["Next.js 15", "WebGL Shaders", "GSAP 3", "Lenis", "Tailwind CSS", "Secret Game HUD"],
  },
];

export default function DemoProjects({ projects = PROJECTS }: { projects?: ProjectItem[] }) {
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
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const triggerCursor = (type: string) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("cursorvariant", { detail: type }));
    }
  };

  return (
    <section
      ref={sectionRef}
      className={`DemoProjects-section ${inView ? "DemoProjects-inView" : ""}`}
      id="works"
    >
      <div className="DemoProjects-inner">
        {/* Section Header with Hairline Divider */}
        <div className="DemoProjects-header">
          <div className="DemoProjects-headerCol">
            <h2 className="DemoProjects-title">
              Selected <em>Works</em>
            </h2>
            <p className="DemoProjects-subtitle">
              Frontend engineering, interactive shader experiments, and production web platforms built with high craft.
            </p>
          </div>
          <span className="DemoProjects-counter">
            03 <span>/ Selected Releases</span>
          </span>
        </div>

        {/* Projects List with kstoimenov Design System */}
        <div className="DemoProjects-list">
          {projects.map((proj, pIdx) => (
            <div
              key={proj.id}
              className="DemoProjects-item"
              data-project-id={proj.id}
            >
              {/* Hairline Divider above each project except first */}
              {pIdx > 0 && <div className="DemoProjects-divider" aria-hidden="true" />}

              {/* Project Meta Bar: Tag pill, Index, Title, and Action Link */}
              <div className="DemoProjects-topBar">
                <div className="DemoProjects-metaLeft">
                  <span className="DemoProjects-tag">{proj.tag}</span>
                  <span className="DemoProjects-index">{proj.index}</span>
                </div>

                <a
                  className="DemoProjects-linkView group"
                  href={proj.url}
                  target={proj.isExternal ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  data-interactive="true"
                  data-cursor-label="VISIT"
                  onMouseEnter={() => triggerCursor("viewcase")}
                  onMouseLeave={() => triggerCursor("default")}
                >
                  <span className="DemoProjects-rollText">
                    <span className="DemoProjects-rollInner">
                      <span className="DemoProjects-rollPrimary">View project</span>
                      <span className="DemoProjects-rollDup" aria-hidden="true">View project</span>
                    </span>
                  </span>
                  <svg
                    className="DemoProjects-arrowIcon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="7" y1="17" x2="17" y2="7" />
                    <polyline points="7 7 17 7 17 17" />
                  </svg>
                </a>
              </div>

              {/* Headline Title */}
              <div className="DemoProjects-titleRow">
                <h3 className="DemoProjects-projectTitle">
                  <a
                    href={proj.url}
                    target={proj.isExternal ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    data-interactive="true"
                    data-cursor-label="VISIT"
                  >
                    {proj.title}
                    {proj.titleAccent && (
                      <span className="DemoProjects-titleAccent">
                        {" "}— <em>{proj.titleAccent}</em>
                      </span>
                    )}
                  </a>
                </h3>
              </div>

              {/* Description & Role Narrative */}
              <div className="DemoProjects-narrativeRow">
                <p className="DemoProjects-desc">{proj.description}</p>
                <div className="DemoProjects-roleBadge">
                  <span className="DemoProjects-roleLabel">Focus</span>
                  <span className="DemoProjects-roleValue">{proj.role}</span>
                </div>
              </div>

              {/* Media Showcase Row: Main (64%) + Side / Blueprint (36%) */}
              <div className="DemoProjects-mediaRow">
                {/* Main Media Viewport */}
                <a
                  className="DemoProjects-media DemoProjects-mediaMain"
                  data-work-media="true"
                  data-kind="main"
                  href={proj.url}
                  target={proj.isExternal ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={`${proj.title} — view live project`}
                  data-interactive="true"
                  data-cursor-label="VISIT"
                  onMouseEnter={() => triggerCursor("viewcase")}
                  onMouseLeave={() => triggerCursor("default")}
                >
                  <div
                    className="DemoProjects-innerFrame"
                    style={{ background: proj.mainImage.bg || "#080c14" }}
                  >
                    <img
                      alt={proj.mainImage.alt}
                      loading="lazy"
                      src={proj.mainImage.src}
                      className="DemoProjects-img"
                      style={{
                        objectFit: proj.mainImage.fit || "cover",
                      }}
                    />
                    {proj.mainImage.badge && (
                      <span className="DemoProjects-mediaBadge">
                        {proj.mainImage.badge}
                      </span>
                    )}
                  </div>
                </a>

                {/* Side Media Viewport (Details / Blueprint / Diagnostics) */}
                <a
                  className="DemoProjects-media DemoProjects-mediaSide"
                  data-work-media="true"
                  data-kind="side"
                  href={proj.url}
                  target={proj.isExternal ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  aria-label={`${proj.title} — technical view`}
                  tabIndex={-1}
                  data-interactive="true"
                  data-cursor-label="VISIT"
                  onMouseEnter={() => triggerCursor("viewcase")}
                  onMouseLeave={() => triggerCursor("default")}
                >
                  <div
                    className="DemoProjects-innerFrame DemoProjects-innerFrameSide"
                    style={{ background: proj.sideImage.bg || "#080c14" }}
                  >
                    <img
                      alt={proj.sideImage.alt}
                      loading="lazy"
                      src={proj.sideImage.src}
                      className="DemoProjects-img"
                      style={{
                        objectFit: proj.sideImage.fit || "cover",
                        padding: proj.sideImage.padding || 0,
                      }}
                    />
                    {proj.sideImage.caption && (
                      <span className="DemoProjects-sideCaption">
                        {proj.sideImage.caption}
                      </span>
                    )}
                  </div>
                </a>
              </div>

              {/* Technology Badges Row */}
              <div className="DemoProjects-techRow">
                <div className="DemoProjects-techGroup">
                  {proj.tech.map((t) => (
                    <span key={t} className="DemoProjects-techBadge">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
