"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function WorksCtaSection() {
  const containerRef = useRef<HTMLElement | null>(null);
  const eyeRef = useRef<HTMLImageElement | null>(null);
  const toggleRef = useRef<HTMLDivElement | null>(null);
  const knobRef = useRef<HTMLSpanElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      if (knobRef.current) {
        gsap.set(knobRef.current, { xPercent: 135.56 });
      }
      toggleRef.current?.classList.add("greenGrain");
      return;
    }

    // Eye blink
    if (eyeRef.current) {
      gsap.timeline({ delay: 0.9 })
        .to(eyeRef.current, { scaleY: 0.06, duration: 0.13, ease: "power2.in" })
        .to(eyeRef.current, { scaleY: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" });
    }

    // Toggle slide and green grain
    if (knobRef.current) {
      gsap.timeline({ delay: 1.25 })
        .add(() => toggleRef.current?.classList.add("greenGrain"), 0)
        .to(knobRef.current, {
          xPercent: 135.56,
          duration: 0.7,
          ease: "power3.out",
        });
    }
  }, [inView]);

  return (
    <section
      ref={containerRef}
      className={`WorksCta-module__F5CAGa__cta ${
        inView ? "WorksCta-module__F5CAGa__inView" : ""
      }`}
    >
      <div className="WorksCta-module__F5CAGa__lineMask">
        <p className="WorksCta-module__F5CAGa__lineInner">
          <span className="WorksCta-module__F5CAGa__sans">
            Ready to ship something
          </span>{" "}
          <span className="WorksCta-module__F5CAGa__serif">exceptional?</span>
        </p>
      </div>

      <div className="WorksCta-module__F5CAGa__descMask">
        <p className="WorksCta-module__F5CAGa__desc">
          No endless stakeholder alignments. Direct product design leadership.
        </p>
      </div>

      <div className="WorksCta-module__F5CAGa__buttonGroup">
        <div ref={toggleRef} className="WorksCta-module__F5CAGa__toggle">
          <img
            ref={eyeRef}
            className="WorksCta-module__F5CAGa__eye"
            src="/MyPage/assets/cta-eye.svg"
            alt=""
          />
          <span ref={knobRef} className="WorksCta-module__F5CAGa__knob" />
        </div>

        <a className="WorksCta-module__F5CAGa__viewWorks" href="#works">
          View all works
        </a>

        <a
          className="WorksCta-module__F5CAGa__arrowBtn"
          href="#works"
          aria-label="View all works"
        >
          <img src="/MyPage/assets/cta-arrow.svg" alt="" />
        </a>
      </div>
    </section>
  );
}
