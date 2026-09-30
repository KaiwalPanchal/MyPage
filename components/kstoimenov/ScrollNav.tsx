"use client";

import React, { useEffect, useRef, useState } from "react";

interface ScrollNavProps {
  active?: string;
}

export default function ScrollNav({ active = "home" }: ScrollNavProps) {
  const navRef = useRef<HTMLElement | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  // Sync theme
  useEffect(() => {
    try {
      const stored = localStorage.getItem("theme");
      if (stored === "light") {
        setTheme("light");
        document.documentElement.dataset.theme = "light";
      }
    } catch {}
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (next === "light") {
      document.documentElement.dataset.theme = "light";
    } else {
      delete document.documentElement.dataset.theme;
    }
    try {
      localStorage.setItem("theme", next);
    } catch {}
  };

  // Prevent scroll when mobile menu open
  useEffect(() => {
    if (!mobileOpen) return;
    const orig = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.documentElement.style.overflow = orig;
      window.removeEventListener("keydown", onKey);
    };
  }, [mobileOpen]);

  // Desktop morphing pill
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const items = Array.from(
      nav.querySelectorAll<HTMLElement>("[data-morph]")
    );

    const updateMorphPositions = () => {
      const navW = nav.offsetWidth;
      const widths = items.map((el) => el.offsetWidth);
      const totalW = widths.reduce((a, b) => a + b, 0);
      const rem =
        parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      const targetW = Math.min(85.75 * rem, window.innerWidth - 3 * rem);
      const spacing = (targetW - totalW) / (items.length - 1);
      let left = 0;

      items.forEach((el, idx) => {
        const targetCenter = left + widths[idx] / 2 - targetW / 2;
        const currentCenter = el.offsetLeft + widths[idx] / 2 - navW / 2;
        el.style.setProperty(
          "--dx",
          `${(targetCenter - currentCenter).toFixed(2)}px`
        );
        left += widths[idx] + spacing;
      });
    };

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let p = window.scrollY > 4 ? 1 : 0;
    let animId = 0;
    let prevTime = 0;

    const applyP = () => nav.style.setProperty("--p", p.toFixed(4));

    const step = (now: number) => {
      const target = window.scrollY > 4 ? 1 : 0;
      const dt = Math.min(64, now - prevTime);
      prevTime = now;

      p = prefersReduced
        ? target
        : p + (target - p) * (1 - Math.exp(-dt / 204));

      if (Math.abs(target - p) < 0.001) {
        p = target;
        applyP();
        animId = 0;
        return;
      }
      applyP();
      animId = requestAnimationFrame(step);
    };

    const onScroll = () => {
      if (!animId) {
        prevTime = performance.now();
        animId = requestAnimationFrame(step);
      }
    };

    const onResize = () => {
      updateMorphPositions();
      onScroll();
    };

    updateMorphPositions();
    applyP();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <>
      <nav ref={navRef} className="ScrollNav-module__7VkX4q__nav">
        <div className="ScrollNav-module__7VkX4q__pill" aria-hidden="true" />
        <div className="ScrollNav-module__7VkX4q__iconGroup" data-morph="true">
          <button
            type="button"
            className="ScrollNav-module__7VkX4q__themeBtn"
            aria-label="Switch theme"
            onClick={toggleTheme}
          >
            <span
              className="ScrollNav-module__7VkX4q__themeIcons"
              aria-hidden="true"
            >
              <img
                className="ScrollNav-module__7VkX4q__iconSun"
                src="/MyPage/assets/icon-sun.svg"
                alt=""
              />
              <img
                className="ScrollNav-module__7VkX4q__iconMoon"
                src="/MyPage/assets/icon-moon.svg"
                alt=""
              />
            </span>
          </button>
        </div>

        <a
          className={`ScrollNav-module__7VkX4q__item ${
            active === "work" ? "ScrollNav-module__7VkX4q__itemActive" : ""
          }`}
          data-morph="true"
          href="#works"
        >
          Work
        </a>
        <a
          className={`ScrollNav-module__7VkX4q__item ${
            active === "services" ? "ScrollNav-module__7VkX4q__itemActive" : ""
          }`}
          data-morph="true"
          href="#services"
        >
          Services+
        </a>
        <a
          className={`ScrollNav-module__7VkX4q__item ${
            active === "pricing" ? "ScrollNav-module__7VkX4q__itemActive" : ""
          }`}
          data-morph="true"
          href="#footer"
        >
          Pricing
        </a>
        <a
          className={`ScrollNav-module__7VkX4q__item ${
            active === "about" ? "ScrollNav-module__7VkX4q__itemActive" : ""
          }`}
          data-morph="true"
          href="#about"
        >
          About
        </a>
        <a
          className="ScrollNav-module__7VkX4q__item ScrollNav-module__7VkX4q__talk"
          data-morph="true"
          href="https://cal.eu/krs.design/30min"
          target="_blank"
          rel="noopener noreferrer"
        >
          Let’s talk
          <img src="/MyPage/assets/icon-arrow-outward.svg" alt="" />
        </a>
      </nav>

      {/* Mobile Drawer Overlay */}
      <div
        className={`ScrollNav-module__7VkX4q__mOverlay ${
          mobileOpen ? "ScrollNav-module__7VkX4q__mOpen" : ""
        }`}
        aria-hidden={!mobileOpen}
      >
        <div className="ScrollNav-module__7VkX4q__mPanel">
          <a
            href="#home"
            aria-label="Home"
            className="ScrollNav-module__7VkX4q__mLogo"
            onClick={() => setMobileOpen(false)}
          >
            <img src="/MyPage/assets/logo.svg" alt="" />
          </a>
          <div className="ScrollNav-module__7VkX4q__mMenu">
            <button
              type="button"
              className="ScrollNav-module__7VkX4q__mItem ScrollNav-module__7VkX4q__mItemActive"
              onClick={() => {
                setMobileOpen(false);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              Home
              <img
                className="ScrollNav-module__7VkX4q__mEye"
                src="/MyPage/assets/menu-eye.svg"
                alt=""
              />
            </button>
            <a
              className="ScrollNav-module__7VkX4q__mItem"
              href="#works"
              onClick={() => setMobileOpen(false)}
            >
              Work
            </a>
            <a
              className="ScrollNav-module__7VkX4q__mItem"
              href="#services"
              onClick={() => setMobileOpen(false)}
            >
              Services+
            </a>
            <a
              className="ScrollNav-module__7VkX4q__mItem"
              href="#footer"
              onClick={() => setMobileOpen(false)}
            >
              Pricing
            </a>
            <a
              className="ScrollNav-module__7VkX4q__mItem"
              href="#about"
              onClick={() => setMobileOpen(false)}
            >
              About
            </a>
            <a
              className="ScrollNav-module__7VkX4q__mItem"
              href="https://cal.eu/krs.design/30min"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
            >
              Let’s talk
              <img
                className="ScrollNav-module__7VkX4q__mTalkArrow"
                src="/MyPage/assets/icon-arrow-outward.svg"
                alt=""
              />
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bar */}
      <div className="ScrollNav-module__7VkX4q__mBar">
        <button
          type="button"
          className="ScrollNav-module__7VkX4q__mThemeBtn"
          aria-label="Switch theme"
          onClick={toggleTheme}
        >
          <span
            className="ScrollNav-module__7VkX4q__themeIcons"
            aria-hidden="true"
          >
            <img
              className="ScrollNav-module__7VkX4q__iconSun"
              src="/MyPage/assets/icon-sun.svg"
              alt=""
            />
            <img
              className="ScrollNav-module__7VkX4q__iconMoon"
              src="/MyPage/assets/icon-moon.svg"
              alt=""
            />
          </span>
        </button>

        <button
          type="button"
          className={`ScrollNav-module__7VkX4q__mBarMain ${
            mobileOpen ? "ScrollNav-module__7VkX4q__mBarOpen" : ""
          }`}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span className="ScrollNav-module__7VkX4q__mLabel">
            {mobileOpen ? "Close" : "Menu"}
          </span>
          <span
            className="ScrollNav-module__7VkX4q__mBurger"
            aria-hidden="true"
          >
            <i />
            <i />
          </span>
        </button>
      </div>
    </>
  );
}
