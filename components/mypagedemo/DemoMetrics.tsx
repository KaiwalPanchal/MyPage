"use client";

import React, { useEffect, useRef, useState } from "react";

const METRICS_DATA = [
  {
    val: "4",
    label: "Stage",
    desc: "News intelligence pipeline with automated\nPESTEL clustering & brandOS ingestion",
    delay: "0.00s",
    labelDelay: "0.20s",
  },
  {
    val: "3",
    label: "Tier",
    desc: "Deterministic source-quote verification\nengine eliminating LLM hallucinations",
    delay: "0.12s",
    labelDelay: "0.32s",
  },
  {
    val: "<1s",
    label: "Latency",
    desc: "Sub-second production inference via\nopen-weights Gemma & Claude Haiku",
    delay: "0.24s",
    labelDelay: "0.44s",
  },
  {
    val: "100k+",
    label: "Entities",
    desc: "Extracted across municipal vector CAD drawings,\nzoning PDFs & unstructured feeds",
    delay: "0.36s",
    labelDelay: "0.56s",
  },
];

export default function DemoMetrics() {
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
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`DemoMetrics-metrics ${inView ? "DemoMetrics-inView" : ""}`}
      id="metrics"
    >
      {METRICS_DATA.map((item, idx) => (
        <div key={idx} className="DemoMetrics-card" data-interactive="true">
          <div className="DemoMetrics-valueWrap">
            <p className="DemoMetrics-value">
              <span
                className="DemoMetrics-slide"
                style={{ transitionDelay: item.delay }}
              >
                {item.val}
              </span>
            </p>
            <p
              className="DemoMetrics-valueLabel"
              style={{
                left: item.val.length > 2 ? "13rem" : "9.5rem",
                top: "0.75rem",
              }}
            >
              <span
                className="DemoMetrics-slide"
                style={{ transitionDelay: item.labelDelay }}
              >
                {item.label}
              </span>
            </p>
          </div>
          <p className="DemoMetrics-desc">{item.desc}</p>
        </div>
      ))}
    </section>
  );
}
