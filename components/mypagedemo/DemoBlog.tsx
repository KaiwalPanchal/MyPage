"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

interface BlogPostItem {
  slug: string;
  index: string;
  title: string;
  titleAccent?: string;
  date: string;
  readTime: string;
  badge: string;
  category: string;
  tags: string[];
  description: string;
}

const DEFAULT_POSTS: BlogPostItem[] = [
  {
    slug: "autocad-llm-controller",
    index: "01",
    title: "Automating AutoCAD Entity Extraction",
    titleAccent: "with LLMs",
    date: "Mar 2025",
    readTime: "10 min read",
    badge: "FDE Case Study",
    category: "Cadastral Vision & LLMs",
    tags: ["PyAutoCAD", "Windows COM", "LangGraph", "FastAPI"],
    description:
      "Reverse-engineering AutoCAD LT over Windows COM via pyautocad to extract cadastral plot dimensions, vertex coordinates, and municipal zoning details using spatial clustering and 5-pass structured prompts.",
  },
  {
    slug: "fluid-design",
    index: "02",
    title: "Organic Fluid Dynamics &",
    titleAccent: "Interactive WebGL",
    date: "Feb 2025",
    readTime: "5 min read",
    badge: "Creative Engineering",
    category: "GLSL & Interaction",
    tags: ["GLSL Shaders", "WebGL", "Chromatic Dispersion", "GSAP"],
    description:
      "Exploring organic fluid dynamics, GLSL chromatic caustics, and hardware-accelerated tactile micro-interactions on modern web interfaces.",
  },
];

export default function DemoBlog({ posts = DEFAULT_POSTS }: { posts?: BlogPostItem[] }) {
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

  const displayPosts = posts.length > 0 ? posts : DEFAULT_POSTS;

  return (
    <section
      ref={sectionRef}
      className={`DemoBlog-section ${inView ? "DemoBlog-inView" : ""}`}
      id="blog"
    >
      <div className="DemoBlog-inner">
        {/* Header with Hairline Divider */}
        <div className="DemoBlog-header">
          <div className="DemoBlog-headerCol">
            <h2 className="DemoBlog-title">
              My 2 <em>Cents</em>
            </h2>
            <p className="DemoBlog-subtitle">
              Opinions, deep dives, and war stories from building AI pipelines, spatial systems, and creative interfaces
            </p>
          </div>
          <Link href="/blog" className="DemoBlog-viewAll" data-cursor-label="ALL">
            <span>View all publications</span>
            <svg
              width="16"
              height="16"
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
          </Link>
        </div>

        {/* Staggered Sliding Cards Grid (Inspired by kstoimenov.com Data Display) */}
        <div className="DemoBlog-grid">
          {displayPosts.map((post, idx) => {
            const baseDelay = idx * 0.15;
            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="DemoBlog-card"
                data-interactive="true"
                data-cursor-label="READ"
              >
                {/* Heroic Staggered Index & Floating Label */}
                <div className="DemoBlog-indexRow">
                  <div className="DemoBlog-valueWrap">
                    <p className="DemoBlog-indexNum">
                      <span
                        className="DemoBlog-slide"
                        style={{ transitionDelay: `${(baseDelay + 0.00).toFixed(2)}s` }}
                      >
                        {post.index}
                      </span>
                    </p>
                    <p className="DemoBlog-valueLabel">
                      <span
                        className="DemoBlog-slide"
                        style={{ transitionDelay: `${(baseDelay + 0.18).toFixed(2)}s` }}
                      >
                        {post.badge}
                      </span>
                    </p>
                  </div>

                  <div className="DemoBlog-metaRight">
                    <span
                      className="DemoBlog-slide"
                      style={{ transitionDelay: `${(baseDelay + 0.12).toFixed(2)}s` }}
                    >
                      {post.date} · {post.readTime}
                    </span>
                  </div>
                </div>

                {/* Article Content Block */}
                <div className="DemoBlog-contentBlock">
                  <div className="DemoBlog-titleWrap">
                    <h3 className="DemoBlog-cardTitle">
                      <span
                        className="DemoBlog-slide"
                        style={{ transitionDelay: `${(baseDelay + 0.22).toFixed(2)}s` }}
                      >
                        {post.title}{" "}
                        {post.titleAccent && <em>{post.titleAccent}</em>}
                      </span>
                    </h3>
                  </div>

                  <div className="DemoBlog-descWrap">
                    <p className="DemoBlog-cardExcerpt">
                      <span
                        className="DemoBlog-slide"
                        style={{ transitionDelay: `${(baseDelay + 0.32).toFixed(2)}s` }}
                      >
                        {post.description}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Tech Tags & Read Action Footer */}
                <div className="DemoBlog-cardFooter">
                  <div className="DemoBlog-tagGroup">
                    {post.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="DemoBlog-techTag"
                        style={{ transitionDelay: `${(baseDelay + 0.36 + tIdx * 0.04).toFixed(2)}s` }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="DemoBlog-readMore">
                    <span className="DemoBlog-readLabel">Read analysis</span>
                    <div className="DemoBlog-arrowCircle">
                      <svg
                        width="15"
                        height="15"
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
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
