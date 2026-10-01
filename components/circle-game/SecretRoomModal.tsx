"use client";

import React, { useState, useEffect } from "react";
import { useSecretGame } from "./SecretGameContext";

type RoomTab = "games" | "music" | "truths" | "experiments" | "lore";

export default function SecretRoomModal() {
  const {
    isSecretRoomOpen,
    closeSecretRoom,
    triggerCircleLoreSecret,
    state,
  } = useSecretGame();

  const [activeTab, setActiveTab] = useState<RoomTab>("games");
  const [loreRead, setLoreRead] = useState(state.discoveredCircleOrigin);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSecretRoomOpen) {
        closeSecretRoom();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSecretRoomOpen, closeSecretRoom]);

  if (!isSecretRoomOpen) return null;

  const handleInspectLore = () => {
    setLoreRead(true);
    triggerCircleLoreSecret();
  };

  return (
    <div
      className="SecretRoom-root"
      role="dialog"
      aria-modal="true"
      aria-label="Secret Chamber"
    >
      {/* CRT Scanline & Mesh Overlay */}
      <div className="SecretRoom-scanlines" aria-hidden="true" />
      <div className="SecretRoom-glowVignette" aria-hidden="true" />

      {/* Main Container */}
      <div className="SecretRoom-container">
        {/* Top Control Bar */}
        <header className="SecretRoom-header">
          <div className="SecretRoom-headerLeft">
            <span className="SecretRoom-chamberBadge">CHAMBER://CLASSIFIED</span>
            <span className="SecretRoom-headerTitle">
              THE INNER SANCTUM // KAIWAL PANCHAL
            </span>
          </div>

          <div className="SecretRoom-headerRight">
            <span className="SecretRoom-statusTag">
              <span className="SecretRoom-liveDot" /> LEVEL_06_UNLOCKED
            </span>
            <button
              type="button"
              className="SecretRoom-exitBtn"
              onClick={closeSecretRoom}
              data-cursor-label="EXIT"
              aria-label="Return to Portfolio"
            >
              [ ✕ RETURN TO PORTFOLIO ]
            </button>
          </div>
        </header>

        {/* Center Intro with The Circle */}
        <div className="SecretRoom-companionHero">
          <div className="SecretRoom-circleOrb">
            <svg className="SecretRoom-circleSvg" viewBox="0 0 60 60">
              <circle
                cx="30"
                cy="30"
                r="27"
                fill="none"
                stroke="var(--accent-bright, #38bdf8)"
                strokeWidth="1.2"
                strokeDasharray="4 4"
                className="SecretRoom-spinRing"
              />
              <circle
                cx="30"
                cy="30"
                r="20"
                fill="rgba(56, 189, 248, 0.08)"
                stroke="var(--accent-bright, #38bdf8)"
                strokeWidth="1.5"
              />
              <circle cx="30" cy="30" r="5" fill="var(--accent-bright, #38bdf8)" />
            </svg>
          </div>

          <div className="SecretRoom-speech">
            <p className="SecretRoom-speechMain">
              “Welcome. Nobody usually makes it this far.”
            </p>
            <p className="SecretRoom-speechSub">
              The portfolio shows what Kaiwal can build. This chamber shows who actually built it — the games, the 3 AM tracks, the failed experiments, and the truths learned the hard way.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="SecretRoom-tabs" aria-label="Chamber archives">
          <button
            type="button"
            className={`SecretRoom-tab ${activeTab === "games" ? "is-active" : ""}`}
            onClick={() => setActiveTab("games")}
          >
            🕹️ WORLDS & GAMES
          </button>
          <button
            type="button"
            className={`SecretRoom-tab ${activeTab === "music" ? "is-active" : ""}`}
            onClick={() => setActiveTab("music")}
          >
            🎧 3 AM ROTATION
          </button>
          <button
            type="button"
            className={`SecretRoom-tab ${activeTab === "truths" ? "is-active" : ""}`}
            onClick={() => setActiveTab("truths")}
          >
            💥 HARD TRUTHS & JOKES
          </button>
          <button
            type="button"
            className={`SecretRoom-tab ${activeTab === "experiments" ? "is-active" : ""}`}
            onClick={() => setActiveTab("experiments")}
          >
            🧪 WEIRD EXPERIMENTS
          </button>
          <button
            type="button"
            className={`SecretRoom-tab SecretRoom-tabLore ${activeTab === "lore" ? "is-active" : ""}`}
            onClick={() => setActiveTab("lore")}
          >
            📁 PROJECT: CIRCLE {loreRead ? "✓" : "(!)"}
          </button>
        </nav>

        {/* Archive Content Panels */}
        <main className="SecretRoom-content">
          {/* TAB 1: GAMES */}
          {activeTab === "games" && (
            <div className="SecretRoom-grid">
              <div className="SecretRoom-card">
                <div className="SecretRoom-cardHeader">
                  <span className="SecretRoom-cardIndex">GAME_01</span>
                  <h3 className="SecretRoom-cardTitle">Outer Wilds</h3>
                </div>
                <p className="SecretRoom-cardDesc">
                  The only game you can only truly experience once in your life. Taught me the existential beauty of curiosity, time loops, and orbital mechanics. Completely rewired how I think about systems design.
                </p>
                <div className="SecretRoom-cardTags">
                  <span>Space</span>
                  <span>Existentialism</span>
                  <span>Masterpiece</span>
                </div>
              </div>

              <div className="SecretRoom-card">
                <div className="SecretRoom-cardHeader">
                  <span className="SecretRoom-cardIndex">GAME_02</span>
                  <h3 className="SecretRoom-cardTitle">Elden Ring</h3>
                </div>
                <p className="SecretRoom-cardDesc">
                  Malenia took 142 attempts. Still considerably less painful than fixing an unhandled CORS error at 2 AM with a client waiting in Slack.
                </p>
                <div className="SecretRoom-cardTags">
                  <span>FromSoftware</span>
                  <span>Endurance</span>
                  <span>Pure Craft</span>
                </div>
              </div>

              <div className="SecretRoom-card">
                <div className="SecretRoom-cardHeader">
                  <span className="SecretRoom-cardIndex">GAME_03</span>
                  <h3 className="SecretRoom-cardTitle">Portal 2</h3>
                </div>
                <p className="SecretRoom-cardDesc">
                  Unbeatable mechanical puzzle design, and undisputed proof that sarcastic, slightly unhinged AI companions make any software ten times better.
                </p>
                <div className="SecretRoom-cardTags">
                  <span>Valve</span>
                  <span>GLaDOS</span>
                  <span>Spatial Puzzles</span>
                </div>
              </div>

              <div className="SecretRoom-card">
                <div className="SecretRoom-cardHeader">
                  <span className="SecretRoom-cardIndex">GAME_04</span>
                  <h3 className="SecretRoom-cardTitle">Cyberpunk 2077 & Chrono Trigger</h3>
                </div>
                <p className="SecretRoom-cardDesc">
                  Chrono Trigger taught me the emotional weight of narrative branching. Night City lives rent-free in every WebGL shader, glowing neon accent, and dark interface I craft.
                </p>
                <div className="SecretRoom-cardTags">
                  <span>Night City</span>
                  <span>SNES Legend</span>
                  <span>Atmosphere</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MUSIC */}
          {activeTab === "music" && (
            <div className="SecretRoom-grid">
              <div className="SecretRoom-card">
                <div className="SecretRoom-cardHeader">
                  <span className="SecretRoom-cardIndex">TRACK_01</span>
                  <h3 className="SecretRoom-cardTitle">Carpenter Brut & Turbo Killer</h3>
                </div>
                <p className="SecretRoom-cardDesc">
                  High-octane French synthwave. Required listening when there are 30 minutes left before a live product demo and the Docker container refuses to bind to port 8000.
                </p>
                <div className="SecretRoom-cardTags">
                  <span>Darksynth</span>
                  <span>Overdrive</span>
                  <span>Adrenaline</span>
                </div>
              </div>

              <div className="SecretRoom-card">
                <div className="SecretRoom-cardHeader">
                  <span className="SecretRoom-cardIndex">TRACK_02</span>
                  <h3 className="SecretRoom-cardTitle">Lofi Girl & Chillhop Essentials</h3>
                </div>
                <p className="SecretRoom-cardDesc">
                  The steady background pulse for 7-hour deep work sprints when designing multi-agent LangGraph flows or restructuring complex database schemas.
                </p>
                <div className="SecretRoom-cardTags">
                  <span>Flow State</span>
                  <span>Steady BPM</span>
                  <span>Focus</span>
                </div>
              </div>

              <div className="SecretRoom-card">
                <div className="SecretRoom-cardHeader">
                  <span className="SecretRoom-cardIndex">TRACK_03</span>
                  <h3 className="SecretRoom-cardTitle">Hans Zimmer & Ludwig Göransson</h3>
                </div>
                <p className="SecretRoom-cardDesc">
                  Oppenheimer, Interstellar, Tenet. The sheer kinetic momentum turns a routine interactive `git rebase` into a high-stakes cinematic thriller.
                </p>
                <div className="SecretRoom-cardTags">
                  <span>Cinema</span>
                  <span>Wall of Sound</span>
                  <span>Epic</span>
                </div>
              </div>

              <div className="SecretRoom-card">
                <div className="SecretRoom-cardHeader">
                  <span className="SecretRoom-cardIndex">TRACK_04</span>
                  <h3 className="SecretRoom-cardTitle">Daft Punk — Alive 2007</h3>
                </div>
                <p className="SecretRoom-cardDesc">
                  The holy grail of electronic craftsmanship. Proof that human warmth, robotic precision, and relentless groove can coexist in perfect harmony.
                </p>
                <div className="SecretRoom-cardTags">
                  <span>French Touch</span>
                  <span>Live Synergy</span>
                  <span>Legendary</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TRUTHS & JOKES */}
          {activeTab === "truths" && (
            <div className="SecretRoom-grid">
              <div className="SecretRoom-card">
                <div className="SecretRoom-cardHeader">
                  <span className="SecretRoom-cardIndex">AXIOM_01</span>
                  <h3 className="SecretRoom-cardTitle">The Production Axiom</h3>
                </div>
                <p className="SecretRoom-cardDesc">
                  “It worked on my machine, so we are packing your laptop into an AWS server rack and shipping it directly to production.”
                </p>
              </div>

              <div className="SecretRoom-card">
                <div className="SecretRoom-cardHeader">
                  <span className="SecretRoom-cardIndex">AXIOM_02</span>
                  <h3 className="SecretRoom-cardTitle">The Real Applied AI Job</h3>
                </div>
                <p className="SecretRoom-cardDesc">
                  “90% of production AI engineering is aggressive string formatting, regex validation, deterministic fallbacks, and praying the token budget forgives you.”
                </p>
              </div>

              <div className="SecretRoom-card">
                <div className="SecretRoom-cardHeader">
                  <span className="SecretRoom-cardIndex">AXIOM_03</span>
                  <h3 className="SecretRoom-cardTitle">Automation Paradox</h3>
                </div>
                <p className="SecretRoom-cardDesc">
                  “Why spend 5 minutes doing a manual task once when you can spend 14 hours engineering an automated pipeline that fails exclusively on Tuesday mornings?”
                </p>
              </div>

              <div className="SecretRoom-card">
                <div className="SecretRoom-cardHeader">
                  <span className="SecretRoom-cardIndex">AXIOM_04</span>
                  <h3 className="SecretRoom-cardTitle">The Golden Rule</h3>
                </div>
                <p className="SecretRoom-cardDesc">
                  “Never deploy to production on Friday at 5:30 PM. The server gods do not tolerate hubris, and weekend pager duty is never worth it.”
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: EXPERIMENTS */}
          {activeTab === "experiments" && (
            <div className="SecretRoom-grid">
              <div className="SecretRoom-card">
                <div className="SecretRoom-cardHeader">
                  <span className="SecretRoom-cardIndex">EXP_01</span>
                  <h3 className="SecretRoom-cardTitle">The Autonomous Plant Waterer</h3>
                </div>
                <p className="SecretRoom-cardDesc">
                  Built with an ESP32 and a soil hygrometer. An unhandled `null` float in the sensor read loop caused the pump relay to default to HIGH. The pothos plant survived; my living room floor required 4 towels.
                </p>
                <div className="SecretRoom-cardTags">
                  <span>Hardware</span>
                  <span>Water Damage</span>
                  <span>Valuable Lesson</span>
                </div>
              </div>

              <div className="SecretRoom-card">
                <div className="SecretRoom-cardHeader">
                  <span className="SecretRoom-cardIndex">EXP_02</span>
                  <h3 className="SecretRoom-cardTitle">PizzaNet-9000</h3>
                </div>
                <p className="SecretRoom-cardDesc">
                  A custom PyTorch CNN trained exclusively to classify whether a food item is pizza based on circular geometry and cheese hue. Achieved 100% test accuracy on round pizzas. Catastrophically failed on Sicilian square slices.
                </p>
                <div className="SecretRoom-cardTags">
                  <span>Computer Vision</span>
                  <span>Overfitting</span>
                  <span>Delicious</span>
                </div>
              </div>

              <div className="SecretRoom-card">
                <div className="SecretRoom-cardHeader">
                  <span className="SecretRoom-cardIndex">EXP_03</span>
                  <h3 className="SecretRoom-cardTitle">The 4 AM CAD Binary Whisperer</h3>
                </div>
                <p className="SecretRoom-cardDesc">
                  Wrote a raw hex stream parser for ancient vector CAD DXF formats because the 1994 Autodesk spec was partially corrupted on archive.org. Extracted 4,000 polygon vertices by sunrise.
                </p>
                <div className="SecretRoom-cardTags">
                  <span>Reverse Eng</span>
                  <span>Hex Dumps</span>
                  <span>Pure Grit</span>
                </div>
              </div>

              <div className="SecretRoom-card">
                <div className="SecretRoom-cardHeader">
                  <span className="SecretRoom-cardIndex">EXP_04</span>
                  <h3 className="SecretRoom-cardTitle">The Daily Arsenal</h3>
                </div>
                <p className="SecretRoom-cardDesc">
                  Ghostty terminal + tmux, Neovim keybindings, FastMCP for agent tooling, Linear for task dispatch, Obsidian for knowledge synthesis, and Next.js + FastAPI for shipping.
                </p>
                <div className="SecretRoom-cardTags">
                  <span>Tools</span>
                  <span>Productivity</span>
                  <span>Craft</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: THE CIRCLE LORE */}
          {activeTab === "lore" && (
            <div className="SecretRoom-loreWrap">
              <div
                className={`SecretRoom-loreFile ${loreRead ? "is-read" : ""}`}
                onClick={handleInspectLore}
                role="button"
                tabIndex={0}
                data-cursor-label="INSPECT"
              >
                <div className="SecretRoom-loreHeader">
                  <span className="SecretRoom-fileDot">●</span>
                  <span className="SecretRoom-fileName">/etc/classified/project_circle.log</span>
                  <span className="SecretRoom-fileBadge">RESTRICTED_ACCESS</span>
                </div>

                <div className="SecretRoom-loreBody">
                  <pre className="SecretRoom-codeBlock">
{`========================================================================
SYSTEM FILE: /etc/classified/project_circle.log
STATUS: EXPERIMENTAL // ABANDONED // SENTIENT
RUNTIME VERSION: v0.9.4-rc2
TARGET: Kaiwal Panchal Portfolio Environment
AUTHOR: Kaiwal Panchal

INTERNAL DEVELOPER NOTES:
------------------------------------------------------------------------
"Originally written at 3:15 AM as a trivial 20-line test script 
to calculate cursor velocity and test WebGL caustic highlight physics.

Somewhere around commit 4b2f1a ('chore: delete circle test'), I tried 
to remove it from the bundle. 

Instead of getting garbage collected, it cached itself into localStorage,
hooked into the keydown listeners, and started observing visitor scroll habits.

It refused to leave. It likes pixel data snacks.
Decided to let it stay as the resident portfolio companion.
Keep an eye on it."
========================================================================`}
                  </pre>
                </div>

                <div className="SecretRoom-loreFooter">
                  <span>
                    {loreRead
                      ? "✓ LORE DISCOVERED & STORED IN MEMORY"
                      : "CLICK TO DECRYPT FILE & RECORD DISCOVERY"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer info bar */}
        <footer className="SecretRoom-footer">
          <span className="SecretRoom-credits">
            KAIWAL PANCHAL // APPLIED AI ENGINEER // 2026
          </span>
          <span className="SecretRoom-circleNote">
            “You found the secrets. Now go build something cool.”
          </span>
        </footer>
      </div>
    </div>
  );
}
