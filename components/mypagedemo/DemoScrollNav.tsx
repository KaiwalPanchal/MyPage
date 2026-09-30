"use client";

import React, { useEffect, useState } from "react";

interface DemoScrollNavProps {
  currentTheme: "cyan" | "green";
  onToggleTheme: () => void;
}

export default function DemoScrollNav({
  currentTheme,
  onToggleTheme,
}: DemoScrollNavProps) {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "works", "blog", "quote", "footer"];
      const scrollPos = window.scrollY + window.innerHeight * 0.35;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="DemoNav-nav" aria-label="Portfolio navigation">
      <a
        href="#home"
        className={`DemoNav-item ${activeSection === "home" ? "active" : ""}`}
        data-cursor-label="TOP"
      >
        Home
      </a>
      <a
        href="#about"
        className={`DemoNav-item ${activeSection === "about" ? "active" : ""}`}
        data-cursor-label="ABOUT"
      >
        About
      </a>
      <a
        href="#works"
        className={`DemoNav-item ${activeSection === "works" ? "active" : ""}`}
        data-cursor-label="CAREER"
      >
        Experience
      </a>
      <a
        href="#blog"
        className={`DemoNav-item ${activeSection === "blog" ? "active" : ""}`}
        data-cursor-label="PAPERS"
      >
        Articles
      </a>
      <a
        href="#quote"
        className={`DemoNav-item ${activeSection === "quote" ? "active" : ""}`}
        data-cursor-label="SCALE"
      >
        Scale
      </a>
      <a
        href="#footer"
        className={`DemoNav-item ${activeSection === "footer" ? "active" : ""}`}
        data-cursor-label="CONTACT"
      >
        Contact
      </a>

      {/* Real-time Color Theme Switcher */}
      <button
        type="button"
        onClick={onToggleTheme}
        className="DemoNav-themeToggle"
        title="Toggle between Frosted Silver and Emerald Green"
        data-cursor-label="THEME"
      >
        <span>●</span>
        <span>{currentTheme === "cyan" ? "Silver" : "Green"}</span>
      </button>
    </nav>
  );
}
