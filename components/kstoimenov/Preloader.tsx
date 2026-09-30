"use client";

import React, { useEffect, useRef, useState } from "react";

const PRELOADER_IMAGES = [
  "/MyPage/assets/works/acronis-main.avif",
  "/MyPage/assets/works/polygon-main.avif",
  "/MyPage/assets/works/db-main.avif",
  "/MyPage/assets/works/macmillan-main.avif",
  "/MyPage/assets/works/orion-main.avif",
  "/MyPage/assets/works/acronis-side.avif",
  "/MyPage/assets/works/db-side.avif",
  "/MyPage/assets/works/orion-side.avif",
];

const EASE_OUT = "cubic-bezier(0.16, 1, 0.3, 1)";
const EASE_INOUT = "cubic-bezier(0.65, 0, 0.35, 1)";

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  const [visible, setVisible] = useState(true);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const counterCellRef = useRef<HTMLDivElement | null>(null);
  const imgCellRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const logoCellRef = useRef<HTMLDivElement | null>(null);
  const riseRef = useRef<HTMLDivElement | null>(null);
  const numRef = useRef<HTMLSpanElement | null>(null);
  const darkCoverRef = useRef<HTMLDivElement | null>(null);
  const nameRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const stage = stageRef.current;
    const counterCell = counterCellRef.current;
    const imgCell = imgCellRef.current;
    const img = imgRef.current;
    const logoCell = logoCellRef.current;
    const rise = riseRef.current;
    const num = numRef.current;
    const darkCover = darkCoverRef.current;
    const name = nameRef.current;

    if (
      !overlay ||
      !stage ||
      !counterCell ||
      !imgCell ||
      !img ||
      !logoCell ||
      !rise ||
      !num ||
      !darkCover ||
      !name
    )
      return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let alreadyEntered = false;
    try {
      alreadyEntered = sessionStorage.getItem("krs:entered") === "1";
    } catch {}

    if (prefersReduced || alreadyEntered) {
      onComplete();
      setVisible(false);
      return;
    }

    try {
      sessionStorage.setItem("krs:entered", "1");
    } catch {}

    const E = counterCell.getBoundingClientRect().width || 140;
    const charRises = Array.from(
      name.querySelectorAll(".Preloader-module__M6H_RG__charRise")
    ) as HTMLElement[];

    let imgIndex = 0;
    img.src = PRELOADER_IMAGES[0];

    const timeouts: number[] = [];
    const setT = (ms: number, fn: () => void) => {
      timeouts.push(window.setTimeout(fn, ms));
    };

    const animateEl = (
      el: HTMLElement,
      keyframes: Keyframe[],
      options: KeyframeAnimationOptions
    ) => {
      return el.animate(keyframes, {
        duration: options.duration,
        delay: options.delay ?? 0,
        easing: options.easing,
        fill: options.fill ?? "both",
      });
    };

    counterCell.style.transform = "translateX(0px)";
    darkCover.style.left = `calc(50% - ${E / 2}px)`;
    darkCover.style.top = `calc(50% - ${E / 2}px)`;
    darkCover.style.height = `${E}px`;
    darkCover.style.width = "0px";
    name.style.left = `calc(50% - ${0.586 * E}px)`;

    // Step 1: Logo rises up
    animateEl(
      rise,
      [
        { transform: "translateY(115%)", opacity: 0 },
        { transform: "translateY(0)", opacity: 1 },
      ],
      { duration: 620, easing: EASE_OUT }
    );
    setT(620, () => {
      rise.style.transform = "translateY(0)";
      rise.style.opacity = "1";
    });

    let intervalId = 0;

    // Step 2: At 800ms, split into counter and image cells
    setT(800, () => {
      animateEl(
        counterCell,
        [{ transform: "translateX(0px)" }, { transform: `translateX(${-E}px)` }],
        { duration: 680, easing: EASE_INOUT }
      );
      setT(680, () => {
        counterCell.style.transform = `translateX(${-E}px)`;
      });

      animateEl(
        imgCell,
        [{ transform: "translateX(0px)" }, { transform: `translateX(${E}px)` }],
        { duration: 680, easing: EASE_INOUT }
      );
      setT(680, () => {
        imgCell.style.transform = `translateX(${E}px)`;
      });

      // Rapid thumbnail cycling
      intervalId = window.setInterval(() => {
        imgIndex = (imgIndex + 1) % PRELOADER_IMAGES.length;
        img.src = PRELOADER_IMAGES[imgIndex];
      }, 200);

      // Smooth percentage counting
      const startTime = performance.now();
      let lastVal = -1;
      const stepPct = (now: number) => {
        const progress = Math.min(1, (now - startTime) / 1800);
        const val = Math.floor((1 - Math.cos((progress * Math.PI) / 2)) * 100);
        if (val !== lastVal) {
          lastVal = val;
          num.textContent = String(val);
        }
        if (progress < 1) {
          requestAnimationFrame(stepPct);
        } else {
          num.textContent = "100";
          window.clearInterval(intervalId);
        }
      };
      requestAnimationFrame(stepPct);
    });

    // Step 3: At 2540ms, fade and drop image cell, wipe dark cover
    setT(2540, () => {
      window.clearInterval(intervalId);
      imgCell.style.zIndex = "6";
      animateEl(
        imgCell,
        [
          { opacity: 1, transform: `translateX(${E}px) translateY(0)` },
          {
            opacity: 0,
            transform: `translateX(${E}px) translateY(${Math.round(0.32 * E)}px)`,
          },
        ],
        { duration: 1000, easing: "cubic-bezier(0.22, 1, 0.3, 1)" }
      );

      animateEl(
        darkCover,
        [{ width: "0px" }, { width: `${2 * E}px` }],
        { duration: 680, delay: 60, easing: EASE_INOUT }
      );
      setT(740, () => {
        darkCover.style.width = `${2 * E}px`;
      });
    });

    // Step 4: Staggered reveal of KRASIMIR STOIMENOV
    const startName = 2790;
    charRises.forEach((el, idx) => {
      animateEl(
        el,
        [{ transform: "translateY(115%)" }, { transform: "translateY(0)" }],
        { duration: 400, delay: startName + 13 * idx, easing: EASE_OUT }
      );
      setT(startName + 13 * idx + 400, () => {
        el.style.transform = "translateY(0)";
      });
    });

    // Step 5: Final rise out and clipPath wipe
    const endName = startName + 400 + 13 * charRises.length + 190;
    setT(endName, () => {
      [rise, ...charRises].forEach((el, idx) => {
        animateEl(
          el,
          [
            { transform: "translateY(0)", opacity: 1 },
            { transform: "translateY(-130%)", opacity: 0 },
          ],
          { duration: 300, delay: 9 * idx, easing: "cubic-bezier(0.7, 0, 0.84, 0)" }
        );
      });

      setT(160, () => {
        onComplete();
        animateEl(
          overlay,
          [
            { clipPath: "inset(0 0 0 0)" },
            { clipPath: "inset(100% 0 0 0)" },
          ],
          { duration: 900, easing: "cubic-bezier(0.77, 0, 0.175, 1)" }
        );
        setT(900, () => {
          setVisible(false);
        });
      });
    });

    return () => {
      window.clearInterval(intervalId);
      timeouts.forEach(clearTimeout);
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      ref={overlayRef}
      className="Preloader-module__M6H_RG__overlay"
      aria-hidden="true"
    >
      <div ref={stageRef} className="Preloader-module__M6H_RG__stage">
        <div
          ref={counterCellRef}
          className="Preloader-module__M6H_RG__cell Preloader-module__M6H_RG__counterCell"
        >
          <span className="Preloader-module__M6H_RG__pct">
            [<span ref={numRef} className="Preloader-module__M6H_RG__num">0</span>%]
          </span>
        </div>

        <div
          ref={imgCellRef}
          className="Preloader-module__M6H_RG__cell Preloader-module__M6H_RG__imgCell"
        >
          <img ref={imgRef} alt="" src={PRELOADER_IMAGES[0]} />
        </div>

        <div
          ref={darkCoverRef}
          className="Preloader-module__M6H_RG__darkCover"
        />

        <div
          ref={logoCellRef}
          className="Preloader-module__M6H_RG__cell Preloader-module__M6H_RG__logoCell"
        >
          <div ref={riseRef} className="Preloader-module__M6H_RG__rise">
            <span className="Preloader-module__M6H_RG__logo">
              <svg
                preserveAspectRatio="xMidYMid meet"
                viewBox="0 0 175 151"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M166 10.0001V3.00009H168.454C168.956 3.00009 169.378 3.09352 169.719 3.28037C170.062 3.46722 170.32 3.72926 170.495 4.0665C170.672 4.40146 170.76 4.79225 170.76 5.23886C170.76 5.68776 170.671 6.07741 170.492 6.40781C170.315 6.73593 170.054 6.99 169.709 7.17002C169.364 7.34775 168.94 7.43662 168.438 7.43662H166.69V6.38388H168.278C168.572 6.38388 168.812 6.34059 169 6.254C169.187 6.16513 169.326 6.03639 169.415 5.86777C169.507 5.69687 169.553 5.48724 169.553 5.23886C169.553 4.99049 169.507 4.77858 169.415 4.60312C169.324 4.42539 169.184 4.29095 168.997 4.1998C168.809 4.10638 168.568 4.05966 168.271 4.05966H167.185V10.0001H166ZM169.38 6.82822L171 10.0001H169.677L168.086 6.82822H169.38Z"
                  fill="white"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M168.5 11.853C171.456 11.853 173.853 9.45644 173.853 6.50009C173.853 3.54375 171.456 1.14715 168.5 1.14715C165.544 1.14715 163.147 3.54375 163.147 6.50009C163.147 9.45644 165.544 11.853 168.5 11.853ZM168.5 13.0001C172.09 13.0001 175 10.0899 175 6.50009C175 2.91024 172.09 9.44138e-05 168.5 9.44138e-05C164.91 9.44138e-05 162 2.91024 162 6.50009C162 10.0899 164.91 13.0001 168.5 13.0001Z"
                  fill="white"
                />
                <path
                  d="M147.051 1.26314C153.649 0.236719 157.481 7.19463 153.636 13.2193L119.578 66.578C118.566 68.164 118.566 70.0866 119.578 71.3576L153.636 114.12C157.482 118.949 153.649 127.099 147.051 128.126L8.10375 149.74C3.62825 150.436 5.03202e-05 147.328 0 142.799V32.3389C0 27.8095 3.62822 23.5734 8.10375 22.8771L147.051 1.26314ZM14.9413 31.2961C12.7036 31.6443 10.8894 33.7624 10.8894 36.027V139.824L50.142 133.718V29.9211C50.142 27.6564 48.3279 26.1027 46.0901 26.4508L14.9413 31.2961Z"
                  fill="white"
                />
              </svg>
            </span>
          </div>
        </div>

        <div ref={nameRef} className="Preloader-module__M6H_RG__name">
          <div className="Preloader-module__M6H_RG__line">
            {"KRASIMIR".split("").map((c, i) => (
              <span key={i} className="Preloader-module__M6H_RG__charMask">
                <span className="Preloader-module__M6H_RG__charRise">{c}</span>
              </span>
            ))}
          </div>
          <div className="Preloader-module__M6H_RG__line">
            {"STOIMENOV".split("").map((c, i) => (
              <span key={i} className="Preloader-module__M6H_RG__charMask">
                <span className="Preloader-module__M6H_RG__charRise">{c}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
