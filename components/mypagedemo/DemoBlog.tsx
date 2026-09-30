"use client";

import React from "react";
import Link from "next/link";

interface BlogPostItem {
  slug: string;
  title: string;
  date: string;
  readTime: string;
  badge: string;
  category?: string;
  description: string;
}

const DEFAULT_POSTS: BlogPostItem[] = [
  {
    slug: "autocad-llm-controller",
    title: "Automating AutoCAD Entity Extraction with LLMs",
    date: "Mar 2025",
    readTime: "10 min read",
    badge: "FDE Case Study",
    category: "Computer Vision & LLMs",
    description:
      "Reverse-engineering AutoCAD LT over Windows COM via pyautocad to extract cadastral plot dimensions, vertex coordinates, and municipal zoning details using spatial clustering and 5-pass structured prompts.",
  },
  {
    slug: "fluid-design",
    title: "Fluid Design & Interactive WebGL Shaders",
    date: "Feb 2025",
    readTime: "5 min read",
    badge: "Creative Engineering",
    category: "GLSL & Interaction",
    description:
      "Exploring organic fluid dynamics, GLSL chromatic caustics, and hardware-accelerated tactile micro-interactions on modern web interfaces.",
  },
];

export default function DemoBlog({ posts = DEFAULT_POSTS }: { posts?: BlogPostItem[] }) {
  const displayPosts = posts.length > 0 ? posts : DEFAULT_POSTS;

  return (
    <section className="DemoBlog-section" id="blog">
      <div className="DemoBlog-inner">
        {/* Header with Hairline Divider */}
        <div className="DemoBlog-header">
          <div>
            <h2 className="DemoBlog-title">
              Technical <em>Articles</em>
            </h2>
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

        {/* 2-Column Editorial Grid with Read Time & Silver Highlights */}
        <div className="DemoBlog-grid">
          {displayPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="DemoBlog-card"
              data-interactive="true"
              data-cursor-label="READ"
            >
              <div className="space-y-4">
                <div className="DemoBlog-meta">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="DemoBlog-badge">{post.badge}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <span>{post.date}</span>
                </div>

                <h3 className="DemoBlog-cardTitle">{post.title}</h3>
                <p className="DemoBlog-cardExcerpt">{post.description}</p>
              </div>

              <div className="DemoBlog-readMore">
                <span>Read paper</span>
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
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
