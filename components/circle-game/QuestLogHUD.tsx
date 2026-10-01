"use client";

import React from "react";
import { useSecretGame } from "./SecretGameContext";

export default function QuestLogHUD() {
  const {
    isQuestLogOpen,
    toggleQuestLog,
    quests,
    unlockedCount,
    totalQuests,
    isRoomUnlocked,
    openSecretRoom,
    resetGame,
  } = useSecretGame();

  if (!isQuestLogOpen) return null;

  const progressPercent = Math.round((unlockedCount / totalQuests) * 100);

  return (
    <div className="CircleQuest-backdrop" onClick={toggleQuestLog}>
      <div
        className="CircleQuest-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Circle Memory Bank"
      >
        {/* Header */}
        <div className="CircleQuest-header">
          <div className="CircleQuest-titleWrap">
            <span className="CircleQuest-dot">●</span>
            <div>
              <h2 className="CircleQuest-title">THINGS I REMEMBER...</h2>
              <p className="CircleQuest-subtitle">
                Fragmented secrets observed across the portfolio
              </p>
            </div>
          </div>
          <button
            type="button"
            className="CircleQuest-close"
            onClick={toggleQuestLog}
            aria-label="Close Quest Log"
            data-cursor-label="CLOSE"
          >
            ✕
          </button>
        </div>

        {/* Progress Tracker */}
        <div className="CircleQuest-progressWrap">
          <div className="CircleQuest-progressLabels">
            <span className="CircleQuest-progressText">
              SYNAPSE COHERENCE: {unlockedCount} / {totalQuests} SECRETS
            </span>
            <span className="CircleQuest-progressPercent">{progressPercent}%</span>
          </div>
          <div className="CircleQuest-progressBar">
            <div
              className="CircleQuest-progressFill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Quest / Memory List */}
        <div className="CircleQuest-list">
          {quests.map((q) => (
            <div
              key={q.id}
              className={`CircleQuest-card ${q.discovered ? "is-discovered" : "is-hidden"}`}
            >
              <div className="CircleQuest-cardIcon">
                {q.discovered ? (
                  <span className="CircleQuest-check">✓</span>
                ) : (
                  <span className="CircleQuest-question">?</span>
                )}
              </div>
              <div className="CircleQuest-cardContent">
                <div className="CircleQuest-cardHeader">
                  <span className="CircleQuest-codeName">{q.codeName}</span>
                  <h3 className="CircleQuest-cardTitle">
                    {q.discovered ? q.title : "Unrecorded Memory"}
                  </h3>
                </div>
                <p className="CircleQuest-cardDesc">
                  {q.discovered ? `“${q.discoveredDialogue}”` : q.hint}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Secret Room Call to Action */}
        <div className="CircleQuest-footer">
          {isRoomUnlocked ? (
            <button
              type="button"
              className="CircleQuest-roomLaunchBtn"
              onClick={openSecretRoom}
              data-cursor-label="OPEN"
            >
              <span className="CircleQuest-roomStar">✦</span>
              <span>ENTER SECRET CHAMBER</span>
              <span className="CircleQuest-roomStar">✦</span>
            </button>
          ) : (
            <div className="CircleQuest-roomLocked">
              <span className="CircleQuest-lockIcon">🔒</span>
              <span>SECRET CHAMBER SEALED (Discover at least 3 secrets)</span>
            </div>
          )}

          <div className="CircleQuest-metaRow">
            <span className="CircleQuest-versionTag">PROJECT: CIRCLE v0.9.4b</span>
            <button
              type="button"
              className="CircleQuest-resetBtn"
              onClick={() => {
                if (window.confirm("Purge Circle memory and replay from the beginning?")) {
                  resetGame();
                }
              }}
            >
              [ Purge Memory ]
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
