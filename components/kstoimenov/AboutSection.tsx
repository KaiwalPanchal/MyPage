"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const TICKS = Array.from({ length: 28 }, (_, e) => {
  const isMajor = e % 9 === 0;
  return {
    top: (19.25 * e) / 16, // in rem
    w: (isMajor ? 8 : 3) / 16,
    h: (e % 2 === 0 ? 1.6 : 1.07) / 16,
    c:
      e < 2
        ? e === 0
          ? "#929292"
          : "#878787"
        : isMajor || e % 2 === 0
        ? "#f6f6f6"
        : "#878787",
  };
});

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const railCapRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const words = Array.from(
      section.querySelectorAll<HTMLElement>("[data-w]")
    ).filter(
      (el) => el.offsetParent !== null && (el.offsetWidth > 0 || el.offsetHeight > 0)
    );

    const rem =
      parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    const lineHeight = 2.1875 * rem;

    const sortedWords = words
      .map((el) => {
        const rect = el.getBoundingClientRect();
        return {
          el,
          line: Math.round((rect.top + window.scrollY) / lineHeight),
          left: rect.left,
        };
      })
      .sort((a, b) => a.line - b.line || a.left - b.left)
      .map((item) => item.el);

    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const baseOpacity = isMobile ? 0.28 : 0.12;

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const u = Math.min(
        1,
        Math.max(0, (0.85 * vh - rect.top) / (rect.height + 0.35 * vh))
      );
      const activeCount = u * (sortedWords.length + 6);

      sortedWords.forEach((el, idx) => {
        const factor = Math.min(1, Math.max(0, (activeCount - idx) / 6));
        el.style.opacity = (baseOpacity + (1 - baseOpacity) * factor).toFixed(3);

        const isLit = factor >= 0.85;
        const uBar = el.querySelector(".About-module__RHteCa__uBar");
        if (uBar) {
          uBar.classList.toggle("About-module__RHteCa__uRevealed", isLit);
        }

        if (el.hasAttribute("data-glyph")) {
          const wasLit = el.dataset.lit === "1";
          if (isLit && !wasLit) {
            el.dataset.lit = "1";
            const anim = el.dataset.anim;
            gsap.killTweensOf(el, "rotation,scale");
            if (anim === "spin") {
              gsap.to(el, {
                rotation: "+=180",
                duration: 0.7,
                ease: "back.out(1.8)",
              });
            } else if (anim === "pop") {
              gsap.timeline()
                .to(el, {
                  scale: 1.3,
                  rotation: "+=45",
                  duration: 0.22,
                  ease: "power3.out",
                })
                .to(el, {
                  scale: 1,
                  duration: 0.55,
                  ease: "elastic.out(1, 0.45)",
                });
            } else if (anim === "burst") {
              gsap.timeline()
                .to(el, {
                  scale: 0.7,
                  rotation: "-=30",
                  duration: 0.15,
                  ease: "power2.in",
                })
                .to(el, {
                  scale: 1,
                  rotation: "+=150",
                  duration: 0.6,
                  ease: "back.out(2)",
                });
            }
          } else if (!isLit && wasLit) {
            el.dataset.lit = "0";
          }
        }
      });

      const railCap = railCapRef.current;
      if (railCap) {
        if (isMobile) {
          const parent = railCap.parentElement;
          const maxTravel = parent
            ? Math.max(0, parent.clientHeight - railCap.offsetHeight)
            : 0;
          railCap.style.transform = `translateY(${(u * maxTravel).toFixed(2)}px)`;
        } else {
          railCap.style.transform = `translateY(${(28.6875 * u).toFixed(3)}rem)`;
        }
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section className="About-module__RHteCa__about" id="about" ref={sectionRef}>
      <div className="About-module__RHteCa__textBlock">
        <p className="About-module__RHteCa__flow">
          <span className="About-module__RHteCa__w" data-w="">With </span>
          <span className="About-module__RHteCa__w" data-w="">a </span>
          <span className="About-module__RHteCa__w" data-w="">holistic </span>
          <span className="About-module__RHteCa__w" data-w="">approach </span>
          <span className="About-module__RHteCa__w" data-w="">that </span>
          <span className="About-module__RHteCa__w" data-w="">balances </span>
          <span className="About-module__RHteCa__w" data-w="">aesthetics </span>
          <span className="About-module__RHteCa__w" data-w="">with </span>
          <span
            className="About-module__RHteCa__glyph About-module__RHteCa__flowGlyph"
            data-w=""
            data-glyph=""
            data-anim="pop"
            style={{
              maskImage: "url(/assets/about-glyph-subtract.svg)",
              WebkitMaskImage: "url(/assets/about-glyph-subtract.svg)",
            }}
            aria-hidden="true"
          />
          <span className="About-module__RHteCa__w" data-w="">usability, </span>
          <span className="About-module__RHteCa__w" data-w="">I </span>
          <span className="About-module__RHteCa__w" data-w="">craft </span>
          <span className="About-module__RHteCa__w" data-w="">digital </span>
          <span className="About-module__RHteCa__w" data-w="">
            <span className="About-module__RHteCa__u">
              products
              <i className="About-module__RHteCa__uBar" data-ubar="true" aria-hidden="true" />
            </span>{" "}
          </span>
          <span className="About-module__RHteCa__w" data-w="">that </span>
          <span className="About-module__RHteCa__w" data-w="">deliver </span>
          <span className="About-module__RHteCa__w" data-w="">exceptional </span>
          <span className="About-module__RHteCa__w" data-w="">user </span>
          <span className="About-module__RHteCa__w" data-w="">experiences. </span>
          <span className="About-module__RHteCa__w" data-w="">Specialising </span>
          <span className="About-module__RHteCa__w" data-w="">in </span>
          <span className="About-module__RHteCa__w" data-w="">turning </span>
          <span className="About-module__RHteCa__w" data-w="">complex </span>
          <span className="About-module__RHteCa__w" data-w="">challenges </span>
          <span className="About-module__RHteCa__w" data-w="">into </span>
          <span className="About-module__RHteCa__w" data-w="">intuitive </span>
          <span className="About-module__RHteCa__w" data-w="">
            <span className="About-module__RHteCa__u">
              solutions
              <i className="About-module__RHteCa__uBar" data-ubar="true" aria-hidden="true" />
            </span>
            ,{" "}
          </span>
          <span
            className="About-module__RHteCa__glyph About-module__RHteCa__flowGlyph"
            data-w=""
            data-glyph=""
            data-anim="spin"
            style={{
              maskImage: "url(/assets/about-glyph-shape.svg)",
              WebkitMaskImage: "url(/assets/about-glyph-shape.svg)",
            }}
            aria-hidden="true"
          />
          <span className="About-module__RHteCa__w" data-w="">I </span>
          <span className="About-module__RHteCa__w" data-w="">offer </span>
          <span className="About-module__RHteCa__w" data-w="">a </span>
          <span className="About-module__RHteCa__w" data-w="">suite </span>
          <span className="About-module__RHteCa__w" data-w="">of </span>
          <span className="About-module__RHteCa__w" data-w="">design </span>
          <span className="About-module__RHteCa__w" data-w="">services </span>
          <span className="About-module__RHteCa__w" data-w="">that </span>
          <span className="About-module__RHteCa__w" data-w="">breathe </span>
          <span className="About-module__RHteCa__w" data-w="">life </span>
          <span className="About-module__RHteCa__w" data-w="">into </span>
          <span className="About-module__RHteCa__w" data-w="">your </span>
          <span className="About-module__RHteCa__w" data-w="">vision. </span>
          <span className="About-module__RHteCa__w" data-w="">Through </span>
          <span className="About-module__RHteCa__w" data-w="">collaborative </span>
          <span className="About-module__RHteCa__w" data-w="">ideation, </span>
          <span className="About-module__RHteCa__w" data-w="">rigorous </span>
          <span className="About-module__RHteCa__w" data-w="">research, </span>
          <span className="About-module__RHteCa__w" data-w="">and </span>
          <span className="About-module__RHteCa__w" data-w="">iterative </span>
          <span className="About-module__RHteCa__w" data-w="">design </span>
          <span className="About-module__RHteCa__w" data-w="">
            <span className="About-module__RHteCa__u">
              processes
              <i className="About-module__RHteCa__uBar" data-ubar="true" aria-hidden="true" />
            </span>
            ,{" "}
          </span>
          <span
            className="About-module__RHteCa__glyph About-module__RHteCa__flowGlyph"
            data-w=""
            data-glyph=""
            data-anim="burst"
            style={{
              maskImage: "url(/assets/about-glyph-flower.png)",
              WebkitMaskImage: "url(/assets/about-glyph-flower.png)",
            }}
            aria-hidden="true"
          />
          <span className="About-module__RHteCa__w" data-w="">I </span>
          <span className="About-module__RHteCa__w" data-w="">ensure </span>
          <span className="About-module__RHteCa__w" data-w="">that </span>
          <span className="About-module__RHteCa__w" data-w="">every </span>
          <span className="About-module__RHteCa__w" data-w="">detail </span>
          <span className="About-module__RHteCa__w" data-w="">aligns </span>
          <span className="About-module__RHteCa__w" data-w="">with </span>
          <span className="About-module__RHteCa__w" data-w="">your </span>
          <span className="About-module__RHteCa__w" data-w="">goals, </span>
          <span className="About-module__RHteCa__w" data-w="">enriching </span>
          <span className="About-module__RHteCa__w" data-w="">the </span>
          <span className="About-module__RHteCa__w" data-w="">lives </span>
          <span className="About-module__RHteCa__w" data-w="">of </span>
          <span className="About-module__RHteCa__w" data-w="">your </span>
          <span className="About-module__RHteCa__w" data-w="">users </span>
          <span className="About-module__RHteCa__w" data-w="">with </span>
          <span className="About-module__RHteCa__w" data-w="">every </span>
          <span className="About-module__RHteCa__w" data-w="">interaction. </span>
        </p>

        {/* Desktop absolute positions matching original layout */}
        <p className="About-module__RHteCa__nowrap" style={{ left: 0, top: 0 }}>
          <span className="About-module__RHteCa__w" data-w="">With </span>
          <span className="About-module__RHteCa__w" data-w="">a </span>
          <span className="About-module__RHteCa__w" data-w="">holistic </span>
          <span className="About-module__RHteCa__w" data-w="">approach </span>
          <span className="About-module__RHteCa__w" data-w="">that </span>
          <span className="About-module__RHteCa__w" data-w="">balances </span>
          <span className="About-module__RHteCa__w" data-w="">aesthetics </span>
        </p>
        <p style={{ left: 0, top: "4.375rem", width: "85.75rem" }}>
          <span className="About-module__RHteCa__w" data-w="">usability, </span>
          <span className="About-module__RHteCa__w" data-w="">I </span>
          <span className="About-module__RHteCa__w" data-w="">craft </span>
          <span className="About-module__RHteCa__w" data-w="">digital </span>
          <span className="About-module__RHteCa__w" data-w="">
            <span className="About-module__RHteCa__u">
              products
              <i className="About-module__RHteCa__uBar" data-ubar="true" aria-hidden="true" />
            </span>{" "}
          </span>
          <span className="About-module__RHteCa__w" data-w="">that </span>
          <span className="About-module__RHteCa__w" data-w="">deliver </span>
          <span className="About-module__RHteCa__w" data-w="">exceptional </span>
          <span className="About-module__RHteCa__w" data-w="">user </span>
          <span className="About-module__RHteCa__w" data-w="">experiences. </span>
          <span className="About-module__RHteCa__w" data-w="">Specialising </span>
          <span className="About-module__RHteCa__w" data-w="">in </span>
          <span className="About-module__RHteCa__w" data-w="">turning </span>
          <span className="About-module__RHteCa__w" data-w="">complex </span>
          <span className="About-module__RHteCa__w" data-w="">challenges </span>
          <span className="About-module__RHteCa__w" data-w="">into </span>
          <span className="About-module__RHteCa__w" data-w="">intuitive </span>
          <span className="About-module__RHteCa__w" data-w="">
            <span className="About-module__RHteCa__u">
              solutions
              <i className="About-module__RHteCa__uBar" data-ubar="true" aria-hidden="true" />
            </span>
            ,{" "}
          </span>
        </p>
        <p style={{ left: 0, top: "17.3125rem", width: "85.75rem" }}>
          <span className="About-module__RHteCa__w" data-w="">breathe </span>
          <span className="About-module__RHteCa__w" data-w="">life </span>
          <span className="About-module__RHteCa__w" data-w="">into </span>
          <span className="About-module__RHteCa__w" data-w="">your </span>
          <span className="About-module__RHteCa__w" data-w="">vision. </span>
          <span className="About-module__RHteCa__w" data-w="">Through </span>
          <span className="About-module__RHteCa__w" data-w="">collaborative </span>
          <span className="About-module__RHteCa__w" data-w="">ideation, </span>
          <span className="About-module__RHteCa__w" data-w="">rigorous </span>
          <span className="About-module__RHteCa__w" data-w="">research, </span>
          <span className="About-module__RHteCa__w" data-w="">and </span>
          <span className="About-module__RHteCa__w" data-w="">iterative </span>
          <span className="About-module__RHteCa__w" data-w="">design </span>
          <span className="About-module__RHteCa__w" data-w="">
            <span className="About-module__RHteCa__u">
              processes
              <i className="About-module__RHteCa__uBar" data-ubar="true" aria-hidden="true" />
            </span>{" "}
          </span>
        </p>
        <p className="About-module__RHteCa__nowrap" style={{ left: "29.375rem", top: "13.125rem" }}>
          <span className="About-module__RHteCa__w" data-w="">I </span>
          <span className="About-module__RHteCa__w" data-w="">offer </span>
          <span className="About-module__RHteCa__w" data-w="">a </span>
          <span className="About-module__RHteCa__w" data-w="">suite </span>
          <span className="About-module__RHteCa__w" data-w="">of </span>
          <span className="About-module__RHteCa__w" data-w="">design </span>
          <span className="About-module__RHteCa__w" data-w="">services </span>
          <span className="About-module__RHteCa__w" data-w="">that </span>
        </p>
        <p className="About-module__RHteCa__nowrap" style={{ left: "72.75rem", top: 0 }}>
          <span className="About-module__RHteCa__w" data-w="">with </span>
        </p>
        <p className="About-module__RHteCa__nowrap" style={{ left: "72.9375rem", top: "21.6875rem" }}>
          <span className="About-module__RHteCa__w" data-w="">,I </span>
          <span className="About-module__RHteCa__w" data-w="">ensure </span>
        </p>
        <p style={{ left: 0, top: "26.0625rem", width: "85.75rem" }}>
          <span className="About-module__RHteCa__w" data-w="">that </span>
          <span className="About-module__RHteCa__w" data-w="">every </span>
          <span className="About-module__RHteCa__w" data-w="">detail </span>
          <span className="About-module__RHteCa__w" data-w="">aligns </span>
          <span className="About-module__RHteCa__w" data-w="">with </span>
          <span className="About-module__RHteCa__w" data-w="">your </span>
          <span className="About-module__RHteCa__w" data-w="">goals, </span>
          <span className="About-module__RHteCa__w" data-w="">enriching </span>
          <span className="About-module__RHteCa__w" data-w="">the </span>
          <span className="About-module__RHteCa__w" data-w="">lives </span>
          <span className="About-module__RHteCa__w" data-w="">of </span>
          <span className="About-module__RHteCa__w" data-w="">your </span>
          <span className="About-module__RHteCa__w" data-w="">users </span>
          <span className="About-module__RHteCa__w" data-w="">with </span>
          <span className="About-module__RHteCa__w" data-w="">every </span>
          <span className="About-module__RHteCa__w" data-w="">interaction. </span>
        </p>

        {/* Floating animated glyphs */}
        <span
          className="About-module__RHteCa__glyph"
          data-w=""
          data-glyph=""
          data-anim="pop"
          style={{
            left: "68.625rem",
            top: "0.25rem",
            maskImage: "url(/assets/about-glyph-subtract.svg)",
            WebkitMaskImage: "url(/assets/about-glyph-subtract.svg)",
          }}
          aria-hidden="true"
        />
        <span
          className="About-module__RHteCa__glyph"
          data-w=""
          data-glyph=""
          data-anim="spin"
          style={{
            left: "25.4375rem",
            top: "13.5rem",
            width: "3.1875rem",
            maskImage: "url(/assets/about-glyph-shape.svg)",
            WebkitMaskImage: "url(/assets/about-glyph-shape.svg)",
          }}
          aria-hidden="true"
        />
        <span
          className="About-module__RHteCa__glyph"
          data-w=""
          data-glyph=""
          data-anim="burst"
          style={{
            left: "68.8125rem",
            top: "22.3125rem",
            maskImage: "url(/assets/about-glyph-flower.png)",
            WebkitMaskImage: "url(/assets/about-glyph-flower.png)",
          }}
          aria-hidden="true"
        />
      </div>

      {/* Measurement Rail */}
      <div className="About-module__RHteCa__rail" aria-hidden="true">
        <div className="About-module__RHteCa__railTicks">
          {TICKS.map((t, idx) => (
            <div
              key={idx}
              className="About-module__RHteCa__tick"
              style={{
                top: `${t.top}rem`,
                width: `${t.w}rem`,
                height: `${t.h}rem`,
                background: t.c,
              }}
            />
          ))}
        </div>
        <img
          ref={railCapRef}
          className="About-module__RHteCa__railCap"
          src="/MyPage/assets/about-rail-cap.svg"
          alt=""
        />
      </div>
    </section>
  );
}
