"use client";

import React, { useEffect, useRef, useState } from "react";

export default function PlayRealSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const track = trackRef.current;
    const video = videoRef.current;
    if (!section || !stage || !track || !video) return;

    video.muted = true;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      stage.style.transform = "scale(1)";
      stage.style.borderRadius = "0rem";
    }

    let hasStartedLoop = false;

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.min(1, Math.max(0, (vh - rect.top) / (0.9 * vh)));
      const eased = progress * progress * (3 - 2 * progress);

      if (!prefersReduced) {
        stage.style.transform = `scale(${(0.62 + 0.38 * eased).toFixed(4)})`;
        stage.style.borderRadius = `${(2 * (1 - eased)).toFixed(3)}rem`;
      }

      const isFull = eased > 0.995;
      track.classList.toggle(
        "PlayReal-module__DHAyZG__trackRunning",
        isFull
      );

      if (isFull && !hasStartedLoop && !prefersReduced) {
        hasStartedLoop = true;
        video.muted = true;
        video.loop = true;
        video.play().catch(() => {});
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

  const handlePlayClick = () => {
    const video = videoRef.current;
    if (!video) return;
    if (!isPlaying) {
      setIsPlaying(true);
      video.muted = false;
      video.play().catch(() => {});
    } else {
      setIsPlaying(false);
      video.muted = true;
    }
  };

  return (
    <section className="PlayReal-module__DHAyZG__real" ref={sectionRef}>
      <div
        ref={stageRef}
        className={`PlayReal-module__DHAyZG__stage ${
          isPlaying ? "PlayReal-module__DHAyZG__stagePlaying" : ""
        }`}
      >
        <video
          ref={videoRef}
          className="PlayReal-module__DHAyZG__video"
          poster="/MyPage/assets/real-billboard.jpg"
          preload="metadata"
          playsInline
        >
          <source
            src="https://pub-c7582c931cdf4f86acceec21c154f4ce.r2.dev/real-reel.webm.webm"
            type="video/webm"
          />
        </video>

        <div
          className={`PlayReal-module__DHAyZG__overlay ${
            isPlaying ? "PlayReal-module__DHAyZG__overlayHidden" : ""
          }`}
          aria-hidden="true"
        />

        <div
          className={`PlayReal-module__DHAyZG__header ${
            isPlaying ? "PlayReal-module__DHAyZG__headerHidden" : ""
          }`}
          aria-hidden={isPlaying}
        >
          <div className="PlayReal-module__DHAyZG__marquee">
            <div ref={trackRef} className="PlayReal-module__DHAyZG__track">
              <div
                className="PlayReal-module__DHAyZG__group"
                aria-hidden="false"
              >
                <span className="PlayReal-module__DHAyZG__titleSans">
                  Play Real
                </span>
                <span className="PlayReal-module__DHAyZG__titleDisplay">
                  Play Real
                </span>
              </div>
              <div
                className="PlayReal-module__DHAyZG__group"
                aria-hidden="true"
              >
                <span className="PlayReal-module__DHAyZG__titleSans">
                  Play Real
                </span>
                <span className="PlayReal-module__DHAyZG__titleDisplay">
                  Play Real
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            className="PlayReal-module__DHAyZG__playButton"
            aria-label="Play showreel"
            onClick={handlePlayClick}
          >
            <img src="/MyPage/assets/real-play-triangle.svg" alt="" />
          </button>
        </div>
      </div>
    </section>
  );
}
