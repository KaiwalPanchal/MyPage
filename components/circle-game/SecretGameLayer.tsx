"use client";

import React from "react";
import { SecretGameProvider, useSecretGame } from "./SecretGameContext";
import TheCircle from "./TheCircle";
import QuestLogHUD from "./QuestLogHUD";
import SecretRoomModal from "./SecretRoomModal";
import "./circleGame.css";

function SecretGameContent({ children }: { children: React.ReactNode }) {
  const { isMatrixPulseActive } = useSecretGame();

  return (
    <>
      {/* Konami Ripple Pulse on Screen */}
      {isMatrixPulseActive && <div className="CircleGame-matrixPulse" aria-hidden="true" />}

      {/* Main Page Content */}
      {children}

      {/* The Floating Living Geometric Circle */}
      <TheCircle />

      {/* Expandable Memory Bank HUD */}
      <QuestLogHUD />

      {/* Full Retro Chamber (Secret Room) */}
      <SecretRoomModal />
    </>
  );
}

export default function SecretGameLayer({ children }: { children: React.ReactNode }) {
  return (
    <SecretGameProvider>
      <SecretGameContent>{children}</SecretGameContent>
    </SecretGameProvider>
  );
}
