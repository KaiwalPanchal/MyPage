"use client";

import React, { useState } from "react";

const TESTIMONIALS = [
  {
    quote:
      "He treated a cancer-support product with the care it deserved: clearer journeys, less friction, and a system our whole team could finally build on.",
    name: "Richard Dood",
    role: "Digital Director @Macmillan",
  },
  {
    quote:
      "He turned a developer-first product into something anyone could navigate. Sharp, fast, and grounded in how our users actually work.",
    name: "Peter Stacho",
    role: "COO @Polygon.io",
  },
  {
    quote:
      "Krasi moves at the pace of the idea, not the org chart. He prototyped, tested, and refined faster than our roadmap could keep up.",
    name: "Amori Langstaff",
    role: "Product Innovation @WP Engine",
  },
  {
    quote:
      "We handed Krasi a rough idea and got back a fundable product. Fast, opinionated, and genuinely invested in whether we won.",
    name: "Carlos Strazzer",
    role: "CEO @Ventures Lab",
  },
];

export default function TestimonialsSection() {
  const [activeIdx, setActiveIdx] = useState(0);

  const nextCard = () => {
    setActiveIdx((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  return (
    <section className="Testimonials-module__X7R5sW__testimonials">
      <div className="Testimonials-module__X7R5sW__inner">
        <div className="Testimonials-module__X7R5sW__left">
          <h2 className="Testimonials-module__X7R5sW__heading">
            What <em>partners</em> say
          </h2>
          <p className="Testimonials-module__X7R5sW__leftDesc">
            Direct feedback from founders, product leaders, and engineering teams
            I’ve shipped with.
          </p>
        </div>

        <div
          className="Testimonials-module__X7R5sW__deck"
          onClick={nextCard}
          style={{ cursor: "pointer" }}
        >
          {TESTIMONIALS.map((t, idx) => {
            const offset =
              (idx - activeIdx + TESTIMONIALS.length) % TESTIMONIALS.length;
            const isVisible = offset < 3;
            if (!isVisible) return null;

            return (
              <div
                key={idx}
                className="Testimonials-module__X7R5sW__card"
                style={{
                  transform: `translateY(${offset * 16}px) scale(${
                    1 - offset * 0.05
                  })`,
                  opacity: 1 - offset * 0.25,
                  zIndex: TESTIMONIALS.length - offset,
                  transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <p className="Testimonials-module__X7R5sW__quote">
                  “{t.quote}”
                </p>
                <p className="Testimonials-module__X7R5sW__author">
                  <strong>{t.name}</strong> ·{" "}
                  <span className="Testimonials-module__X7R5sW__authorRole">
                    {t.role}
                  </span>
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
