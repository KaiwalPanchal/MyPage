"use client";

import React, { useEffect, useRef, useState } from "react";

export default function FooterSection() {
  const footerRef = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = footerRef.current;
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      ref={footerRef}
      className={`Footer-module__KWgBSG__footer ${
        inView ? "Footer-module__KWgBSG__inView" : ""
      }`}
      id="footer"
    >
      <div className="Footer-module__KWgBSG__inner">
        <div className="Footer-module__KWgBSG__headingMask">
          <h2 className="Footer-module__KWgBSG__heading">Get in touch</h2>
        </div>

        <p className="Footer-module__KWgBSG__mission">
          I build products that move people, and move the business.{" "}
          <a
            href="mailto:contact@kstoimenov.com"
            className="Footer-module__KWgBSG__writeLink"
          >
            Prefer to write? Send a note.
          </a>
        </p>

        <a
          className="Footer-module__KWgBSG__contact"
          data-cal-link="krs.design/30min"
          data-cal-namespace="30min"
          href="https://cal.eu/krs.design/30min"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact — book a call"
        >
          Contact
          <img src="/MyPage/assets/footer-contact-arrow.svg" alt="" />
        </a>

        <div className="Footer-module__KWgBSG__socialRow">
          <a
            className="Footer-module__KWgBSG__card"
            href="https://www.linkedin.com/in/krasimir-stoimenov/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <span
              className="Footer-module__KWgBSG__cardIcon"
              style={{
                maskImage: "url(/assets/social-linkedin.svg)",
                WebkitMaskImage: "url(/assets/social-linkedin.svg)",
              }}
              aria-hidden="true"
            />
            <span className="Footer-module__KWgBSG__cardLabel">LinkedIn</span>
          </a>

          <a
            className="Footer-module__KWgBSG__card"
            href="https://x.com/tldr_lorem"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
          >
            <span
              className="Footer-module__KWgBSG__cardIcon"
              style={{
                maskImage: "url(/assets/social-x.svg)",
                WebkitMaskImage: "url(/assets/social-x.svg)",
              }}
              aria-hidden="true"
            />
            <span className="Footer-module__KWgBSG__cardLabel">X</span>
          </a>

          <a
            className="Footer-module__KWgBSG__card"
            href="https://www.behance.net/Azarel"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Behance"
          >
            <span
              className="Footer-module__KWgBSG__cardIcon"
              style={{
                maskImage: "url(/assets/social-behance.svg)",
                WebkitMaskImage: "url(/assets/social-behance.svg)",
              }}
              aria-hidden="true"
            />
            <span className="Footer-module__KWgBSG__cardLabel">Behance</span>
          </a>

          <a
            className="Footer-module__KWgBSG__card"
            href="https://dribbble.com/Krasi90"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Dribbble"
          >
            <span
              className="Footer-module__KWgBSG__cardIcon"
              style={{
                maskImage: "url(/assets/social-dribbble.svg)",
                WebkitMaskImage: "url(/assets/social-dribbble.svg)",
              }}
              aria-hidden="true"
            />
            <span className="Footer-module__KWgBSG__cardLabel">Dribbble</span>
          </a>

          <a
            className="Footer-module__KWgBSG__card"
            href="https://www.awwwards.com/KRS_Krasi/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Awwwards"
          >
            <span
              className="Footer-module__KWgBSG__cardIcon"
              style={{
                maskImage: "url(/assets/social-awwwards.svg)",
                WebkitMaskImage: "url(/assets/social-awwwards.svg)",
              }}
              aria-hidden="true"
            />
            <span className="Footer-module__KWgBSG__cardLabel">Awwwards</span>
          </a>
        </div>

        <p className="Footer-module__KWgBSG__copyright">
          ©2026 KRS - All rights reserved
        </p>

        <div className="Footer-module__KWgBSG__legal">
          <a href="#footer">Privacy policy</a>
          <a href="#footer">Terms &amp; Conditions</a>
        </div>

        <button
          type="button"
          className="Footer-module__KWgBSG__logoBtn"
          aria-label="Back to top"
          onClick={scrollToTop}
        >
          <img
            className="Footer-module__KWgBSG__logoImg"
            src="/MyPage/assets/logo-registered.svg"
            alt="KRS logo"
          />
          <img src="/MyPage/assets/footer-arrow-up.svg" alt="" />
        </button>
      </div>
    </footer>
  );
}
