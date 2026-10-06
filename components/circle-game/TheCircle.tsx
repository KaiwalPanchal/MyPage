"use client";

import React, { useEffect, useRef, useState } from "react";
import { useSecretGame } from "./SecretGameContext";
import { CircleMood } from "./types";

export default function TheCircle() {
  const {
    state,
    mood,
    currentDialogue,
    isQuestLogOpen,
    isRoomUnlocked,
    unlockedCount,
    totalQuests,
    pokeCircle,
    clearDialogue,
    toggleQuestLog,
    toggleMinimize,
    toggleMute,
    openSecretRoom,
  } = useSecretGame();

  const circleRef = useRef<HTMLDivElement | null>(null);
  const [pupilPos, setPupilPos] = useState({ x: 0, y: 0 });
  const [isBlinking, setIsBlinking] = useState(false);
  const [isPoked, setIsPoked] = useState(false);

  // Mouse pupil tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!circleRef.current) return;
      const rect = circleRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      const dist = Math.hypot(deltaX, deltaY);
      const maxOffset = 5; // max px the pupil moves

      if (dist === 0) {
        setPupilPos({ x: 0, y: 0 });
      } else {
        const factor = Math.min(1, dist / 250);
        setPupilPos({
          x: (deltaX / dist) * maxOffset * factor,
          y: (deltaY / dist) * maxOffset * factor,
        });
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Geometric "blink" every few seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.4) {
        setIsBlinking(true);
        setTimeout(() => setIsBlinking(false), 140);
      }
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const handleCircleClick = () => {
    setIsPoked(true);
    setTimeout(() => setIsPoked(false), 300);
    if (state.isMinimized) {
      toggleMinimize();
    }
    pokeCircle();
  };

  const isHidingInFooter = state.activeLocation === "footer";

  return (
    <div
      className={`CircleGame-hud ${state.isMinimized ? "is-minimized" : ""} ${
        isHidingInFooter ? "is-hiding" : ""
      }`}
      aria-label="The Circle secret guide"
    >
      {/* Speech Bubble */}
      {currentDialogue && !state.isMinimized && (
        <div
          className={`CircleGame-dialogue ${currentDialogue.mood || mood}`}
          role="dialog"
          aria-live="polite"
        >
          <div className="CircleGame-dialogueHeader">
            <div className="CircleGame-dialogueBadge">
              <span className="CircleGame-dialogueDot" />
              <span>THE CIRCLE</span>
            </div>
            <button
              type="button"
              className="CircleGame-dialogueClose"
              onClick={clearDialogue}
              aria-label="Dismiss message"
              data-cursor-label="DISMISS"
            >
              ×
            </button>
          </div>

          <p className="CircleGame-dialogueText">{currentDialogue.text}</p>

          {/* Action choices if any */}
          {currentDialogue.choices && currentDialogue.choices.length > 0 && (
            <div className="CircleGame-choices">
              {currentDialogue.choices.map((choice, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="CircleGame-choiceBtn"
                  onClick={choice.action}
                  data-cursor-label="SELECT"
                >
                  [ {choice.label} ]
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Companion Orb & Controls */}
      <div className="CircleGame-companionWrap">
        {/* If hiding in footer, render faint ghost indicator */}
        {isHidingInFooter ? (
          <div
            className="CircleGame-ghostOrb"
            title="The Circle vanished... check the bottom of the page."
          >
            <div className="CircleGame-ghostRing" />
            <span className="CircleGame-ghostTrace">?</span>
          </div>
        ) : (
          <div
            ref={circleRef}
            className={`CircleGame-orb ${mood} ${isBlinking ? "is-blinking" : ""} ${
              isPoked ? "is-poked" : ""
            }`}
            onClick={handleCircleClick}
            data-interactive="true"
            data-cursor-label="POKE"
            role="button"
            tabIndex={0}
            aria-label="The Circle companion. Click to interact."
          >
            {/* Outer Rotating Hairline Dashed Ring */}
            <svg className="CircleGame-ringSvg" viewBox="0 0 54 54">
              <circle
                className="CircleGame-outerDash"
                cx="27"
                cy="27"
                r="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeDasharray="4 6"
              />
              <circle
                className="CircleGame-innerAura"
                cx="27"
                cy="27"
                r="19"
                fill="none"
                stroke="var(--accent-bright, #38bdf8)"
                strokeWidth="1.5"
                opacity="0.6"
              />
            </svg>

            {/* Glowing Core with Pupil Tracking */}
            <div className="CircleGame-core">
              <div
                className="CircleGame-pupil"
                style={{
                  transform: `translate(${pupilPos.x}px, ${pupilPos.y}px)`,
                }}
              />
            </div>

            {/* Micro ripple ping when clicked */}
            {isPoked && <div className="CircleGame-pokeRipple" />}
          </div>
        )}

        {/* Minimal Accessory Controls Dock */}
        <div className="CircleGame-dock">
          {/* Memory / Quest Log Button */}
          <button
            type="button"
            className={`CircleGame-dockBtn ${isQuestLogOpen ? "is-active" : ""}`}
            onClick={toggleQuestLog}
            title="Memory Bank (Secrets Log)"
            data-cursor-label="MEMORY"
            aria-label="Open Memory Bank"
          >
            <span className="CircleGame-dockIcon">≡</span>
            <span className="CircleGame-dockCount">
              {unlockedCount}/{totalQuests}
            </span>
          </button>

          {/* Secret Room Quick Shortcut (Glows when unlocked) */}
          {isRoomUnlocked && (
            <button
              type="button"
              className="CircleGame-dockBtn CircleGame-roomBtn"
              onClick={openSecretRoom}
              title="Enter Secret Chamber"
              data-cursor-label="ENTER"
              aria-label="Open Secret Chamber"
            >
              <span className="CircleGame-doorGlyph">✦</span>
              <span className="CircleGame-doorLabel">ROOM</span>
            </button>
          )}

          {/* Mute/Sound Toggle */}
          <button
            type="button"
            className="CircleGame-dockBtn CircleGame-dockMini"
            onClick={toggleMute}
            title={state.isMuted ? "Unmute audio chimes" : "Mute audio chimes"}
            aria-label="Toggle audio"
          >
            {state.isMuted ? "🔇" : "🔊"}
          </button>

          {/* Minimize / Expand Toggle */}
          <button
            type="button"
            className="CircleGame-dockBtn CircleGame-dockMini"
            onClick={toggleMinimize}
            title={state.isMinimized ? "Expand Circle" : "Minimize Circle"}
            aria-label="Toggle minimize"
          >
            {state.isMinimized ? "▲" : "▼"}
          </button>
        </div>
      </div>
    </div>
  );
}
