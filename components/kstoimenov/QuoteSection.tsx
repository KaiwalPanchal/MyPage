"use client";

import React, { useEffect, useRef } from "react";

const ICONS = [
  {
    src: "/MyPage/assets/quote-star.svg",
    left: "116.4375rem",
    top: "2.875rem",
    drift: 200,
  },
  {
    src: "/MyPage/assets/quote-half.svg",
    left: "0rem",
    top: "18.8125rem",
    height: "5.1875rem",
    drift: -240,
  },
  {
    src: "/MyPage/assets/quote-icon-1.png",
    left: "104.8125rem",
    top: "2.9375rem",
    height: "9.5625rem",
    drift: 200,
  },
  {
    src: "/MyPage/assets/quote-icon-2.png",
    left: "83.1875rem",
    top: "30.0625rem",
    drift: 170,
  },
  {
    src: "/MyPage/assets/quote-icon-3.png",
    left: "94.8125rem",
    top: "30.0625rem",
    drift: 170,
  },
  {
    src: "/MyPage/assets/quote-icon-4.png",
    left: "106.4375rem",
    top: "30.0625rem",
    drift: 170,
  },
  {
    src: "/MyPage/assets/quote-icon-5.png",
    left: "118.0625rem",
    top: "30.0625rem",
    drift: 170,
  },
  {
    src: "/MyPage/assets/quote-icon-6.png",
    left: "13.875rem",
    top: "30.0625rem",
    drift: 170,
  },
  {
    src: "/MyPage/assets/quote-hourglass.svg",
    left: "2.25rem",
    top: "30.0625rem",
    drift: 170,
  },
];

export default function QuoteSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const line1Ref = useRef<HTMLParagraphElement | null>(null);
  const line2Ref = useRef<HTMLParagraphElement | null>(null);
  const line3Ref = useRef<HTMLParagraphElement | null>(null);
  const iconRefs = useRef<(HTMLImageElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) return;

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = (vh - rect.top) / (rect.height + vh) - 0.5; // -0.5 to 0.5

      if (line1Ref.current) {
        line1Ref.current.style.transform = `translateX(${progress * 200}px)`;
      }
      if (line2Ref.current) {
        line2Ref.current.style.transform = `translateX(${progress * -240}px)`;
      }
      if (line3Ref.current) {
        line3Ref.current.style.transform = `translateX(${progress * 170}px)`;
      }

      iconRefs.current.forEach((el, idx) => {
        if (!el) return;
        const drift = ICONS[idx]?.drift || 150;
        el.style.transform = `translateX(${progress * drift}px)`;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="Quote-module__MD2jyW__quote" ref={sectionRef}>
      <div className="Quote-module__MD2jyW__content">
        <p
          ref={line1Ref}
          className="Quote-module__MD2jyW__line"
          style={{ left: "9.25rem", top: 0 }}
        >
          Design to scale
        </p>

        <p
          ref={line2Ref}
          className="Quote-module__MD2jyW__line Quote-module__MD2jyW__lineSerif"
          style={{ left: "16.625rem", top: "13.5938rem" }}
        >
          drive experiences
        </p>

        <p
          ref={line3Ref}
          className="Quote-module__MD2jyW__line"
          style={{ left: "25.5rem", top: "27.1875rem" }}
        >
          with data
        </p>

        {ICONS.map((icon, idx) => (
          <img
            key={idx}
            ref={(el) => {
              iconRefs.current[idx] = el;
            }}
            className="Quote-module__MD2jyW__icon"
            src={icon.src}
            alt=""
            style={{
              left: icon.left,
              top: icon.top,
              height: icon.height,
              willChange: "transform",
            }}
          />
        ))}
      </div>
    </section>
  );
}
