"use client";

import React from "react";
import { useSecretGame } from "./SecretGameContext";

export default function FooterHiddenGlyph() {
  const { state, triggerFooterSecret, sayMessage } = useSecretGame();

  const isHidingHere = state.activeLocation === "footer";
  const isFound = state.foundFooter;

  const handleClick = () => {
    if (!isFound) {
      triggerFooterSecret();
    } else {
      sayMessage("This rune coordinate is already recorded in my memory.", "idle", undefined, 3500);
    }
  };

  return (
    <div className="FooterSecret-wrap" aria-label="Suspicious footer rune">
      {/* If the Circle is hiding here after Konami code */}
      {isHidingHere && (
        <div className="FooterSecret-hidingCallout">
          <span className="FooterSecret-circleGaze">●</span>
          <span className="FooterSecret-hidingBubble">
            “Psst. Down here.”
          </span>
        </div>
      )}

      {/* The Suspicious Glyph Button */}
      <button
        type="button"
        className={`FooterSecret-glyphBtn ${isFound ? "is-active" : ""} ${
          isHidingHere ? "is-hiding-target" : ""
        }`}
        onClick={handleClick}
        data-interactive="true"
        data-cursor-label={isFound ? "SOLVED" : "INSPECT"}
        title={isFound ? "Deep End Glyph (Discovered)" : "Suspicious coordinate marker"}
      >
        <svg
          className="FooterSecret-glyphIcon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <circle cx="12" cy="12" r="9" strokeDasharray="3 3" />
          <circle cx="12" cy="12" r="4" fill={isFound ? "var(--accent-bright, #38bdf8)" : "none"} />
          <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
        </svg>
        <span className="FooterSecret-label">
          {isFound ? "COORD://FOUND" : "COORD://04_ABYSS"}
        </span>
      </button>
    </div>
  );
}
