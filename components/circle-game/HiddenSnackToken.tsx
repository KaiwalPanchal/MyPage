"use client";

import React from "react";
import { useSecretGame } from "./SecretGameContext";

export default function HiddenSnackToken() {
  const { state, triggerSnackSecret } = useSecretGame();

  return (
    <>
      {/* 
        hey.

        if you're reading this,
        the Circle was right.

        look for: "snack"
        or type `feedCircle('snack')` in the console.
      */}
      <div
        className={`HiddenSnack-token ${state.foundSnack ? "is-consumed" : ""}`}
        data-snack="true"
        onClick={triggerSnackSecret}
        title={
          state.foundSnack
            ? "Crumbs of a digital snack already consumed by The Circle."
            : "<!-- snack --> Click to feed The Circle or use console."
        }
        data-interactive="true"
        data-cursor-label="FEED"
        role="button"
        tabIndex={0}
      >
        <span className="HiddenSnack-coreDot" />
        <span className="HiddenSnack-label">
          {state.foundSnack ? "[ crumbs ]" : "[ snack ]"}
        </span>
      </div>
    </>
  );
}
