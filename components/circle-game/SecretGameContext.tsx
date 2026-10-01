"use client";

import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { SecretGameState, QuestItem, DialogueMessage, CircleMood } from "./types";
import { soundFX } from "./soundEffects";

interface SecretGameContextType {
  state: SecretGameState;
  mood: CircleMood;
  currentDialogue: DialogueMessage | null;
  isQuestLogOpen: boolean;
  isSecretRoomOpen: boolean;
  isMatrixPulseActive: boolean;
  quests: QuestItem[];
  unlockedCount: number;
  totalQuests: number;
  isRoomUnlocked: boolean;
  pokeCircle: () => void;
  sayMessage: (text: string, mood?: CircleMood, choices?: DialogueMessage["choices"], autoDismissMs?: number) => void;
  clearDialogue: () => void;
  triggerFooterSecret: () => void;
  triggerSnackSecret: () => void;
  triggerCircleLoreSecret: () => void;
  openSecretRoom: () => void;
  closeSecretRoom: () => void;
  toggleQuestLog: () => void;
  toggleMinimize: () => void;
  toggleMute: () => void;
  resetGame: () => void;
}

const STORAGE_KEY = "kaiwal_circle_game_v1";

const DEFAULT_STATE: SecretGameState = {
  hasMet: false,
  acceptedGuide: false,
  clickCount: 0,
  foundKonami: false,
  foundFooter: false,
  foundSnack: false,
  foundSecretRoom: false,
  discoveredCircleOrigin: false,
  activeLocation: "corner",
  isMinimized: false,
  isMuted: false,
  visitCount: 1,
};

const KONAMI_SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const SecretGameContext = createContext<SecretGameContextType | null>(null);

export function SecretGameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SecretGameState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mood, setMood] = useState<CircleMood>("idle");
  const [currentDialogue, setCurrentDialogue] = useState<DialogueMessage | null>(null);
  const [isQuestLogOpen, setIsQuestLogOpen] = useState(false);
  const [isSecretRoomOpen, setIsSecretRoomOpen] = useState(false);
  const [isMatrixPulseActive, setIsMatrixPulseActive] = useState(false);

  const dialogueTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const konamiIndexRef = useRef<number>(0);
  const hasTriggeredKeyHint = useRef<boolean>(false);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setState((prev) => ({
          ...prev,
          ...parsed,
          visitCount: (parsed.visitCount || 1) + 1,
        }));
      }
    } catch {
      // Local storage unavailable
    }
    setIsLoaded(true);
  }, []);

  // Save state whenever it changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
    soundFX.isMuted = state.isMuted;
  }, [state, isLoaded]);

  // Say message helper with typewriter / sound
  const sayMessage = useCallback(
    (
      text: string,
      newMood: CircleMood = "talking",
      choices?: DialogueMessage["choices"],
      autoDismissMs: number = 7000
    ) => {
      if (dialogueTimeoutRef.current) {
        clearTimeout(dialogueTimeoutRef.current);
      }
      setMood(newMood);
      setCurrentDialogue({
        id: Math.random().toString(36).substring(7),
        text,
        mood: newMood,
        choices,
        autoDismissMs,
      });
      soundFX.playSpeechBleep();

      if (autoDismissMs > 0 && (!choices || choices.length === 0)) {
        dialogueTimeoutRef.current = setTimeout(() => {
          setCurrentDialogue(null);
          setMood("idle");
        }, autoDismissMs);
      }
    },
    []
  );

  const clearDialogue = useCallback(() => {
    if (dialogueTimeoutRef.current) {
      clearTimeout(dialogueTimeoutRef.current);
    }
    setCurrentDialogue(null);
    setMood("idle");
  }, []);

  // Quests computation
  const quests: QuestItem[] = [
    {
      id: "first_contact",
      codeName: "01_CONTACT",
      title: "First Contact",
      hint: "Accept the Circle's invitation.",
      discovered: state.hasMet && state.acceptedGuide,
      discoveredDialogue: "You actually said yes.",
    },
    {
      id: "the_poke",
      codeName: "02_POKE",
      title: "The Poke",
      hint: "Clicks have consequences.",
      discovered: state.clickCount > 0,
      discoveredDialogue: "See? You can interact with things.",
    },
    {
      id: "konami",
      codeName: "03_SEQUENCE",
      title: "The Ancient Sequence",
      hint: "Up, Up, Down, Down...",
      discovered: state.foundKonami,
      discoveredDialogue: "YOU ACTUALLY KNOW THAT?!",
    },
    {
      id: "footer_glyph",
      codeName: "04_ABYSS",
      title: "The Deep End",
      hint: "Check the weird places at the bottom of the world.",
      discovered: state.foundFooter,
      discoveredDialogue: "Do you always read the bottom of websites?",
    },
    {
      id: "behind_curtain",
      codeName: "05_INSPECT",
      title: "Behind the Curtain",
      hint: "Inspect the DOM or open DevTools for a snack.",
      discovered: state.foundSnack,
      discoveredDialogue: "...you're cheating. Or you're a real dev.",
    },
    {
      id: "secret_chamber",
      codeName: "06_CHAMBER",
      title: "The Secret Chamber",
      hint: "A portal opens for those who explore.",
      discovered: state.foundSecretRoom,
      discoveredDialogue: "Welcome. Nobody usually makes it this far.",
    },
  ];

  const unlockedCount = quests.filter((q) => q.discovered).length;
  const totalQuests = quests.length;
  // Room is unlocked once 3 secrets are found (or konami + footer or snack)
  const isRoomUnlocked =
    (state.foundKonami && (state.foundFooter || state.foundSnack)) ||
    unlockedCount >= 3 ||
    state.foundSecretRoom;

  // Initial welcome greeting
  useEffect(() => {
    if (!isLoaded) return;

    const timer = setTimeout(() => {
      if (!state.hasMet) {
        sayMessage(
          "Oh. A visitor. You're here for the portfolio, right? ...boring. But since you're already here, wanna see something interesting?",
          "curious",
          [
            {
              label: "Sure",
              action: () => {
                setState((prev) => ({ ...prev, hasMet: true, acceptedGuide: true }));
                soundFX.playSecretFound();
                sayMessage(
                  "Good choice. There are things hidden around here. I don't know where everything is... and even if I did, I wouldn't tell you. 😌 Try clicking me.",
                  "secretive",
                  undefined,
                  8000
                );
              },
            },
            {
              label: "Nah",
              action: () => {
                setState((prev) => ({ ...prev, hasMet: true, acceptedGuide: false }));
                sayMessage(
                  "Fair enough. Go look at the resume. I'll just sit here and do circle things.",
                  "teasing",
                  undefined,
                  5000
                );
              },
            },
          ],
          0
        );
      } else if (state.visitCount > 1) {
        if (state.foundSecretRoom) {
          sayMessage("Back already? The secret chamber is always open for you.", "idle", undefined, 5000);
        } else {
          sayMessage("Oh. It's you again. Still looking for secrets?", "curious", undefined, 5000);
        }
      }
    }, 2800);

    return () => clearTimeout(timer);
  }, [isLoaded, state.hasMet, state.visitCount, state.foundSecretRoom, sayMessage]);

  // DevTools console easter egg injection
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Expose feedCircle to window
    (window as unknown as { feedCircle: (item?: string) => void; __circle: unknown }).feedCircle = (
      item?: string
    ) => {
      if (item === "snack" || !item) {
        triggerSnackSecret();
        return "● [THE CIRCLE]: Mmm, delicious data crumbs. Snack quest complete!";
      }
      return `● [THE CIRCLE]: I don't eat '${item}'. Try 'snack'.`;
    };

    (window as unknown as { __circle: unknown }).__circle = {
      status: "sentient",
      mood: "observing",
      hint: "Sometimes looking behind the code reveals everything.",
    };

    console.log(
      "%c● THE CIRCLE %c\n" +
        "You looked behind the curtain.\n" +
        "Type `feedCircle('snack')` into this console or find the hidden snack on the page.",
      "font-size: 14px; font-weight: bold; color: #38bdf8; background: #070e1b; padding: 6px 10px; border-radius: 6px; border: 1px solid rgba(56,189,248,0.3);",
      "font-size: 12px; color: #94a3b8; line-height: 1.6;"
    );
  }, []);

  // Keyboard handler for Konami code and subtle hints
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing into an input/textarea
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }

      // Check key for Konami Sequence
      const expectedKey = KONAMI_SEQUENCE[konamiIndexRef.current];
      const pressedKey = e.key;

      if (pressedKey.toLowerCase() === expectedKey.toLowerCase()) {
        konamiIndexRef.current += 1;
        if (konamiIndexRef.current === KONAMI_SEQUENCE.length) {
          // Success! Konami Code Entered!
          konamiIndexRef.current = 0;
          soundFX.playKonamiFanfare();
          setIsMatrixPulseActive(true);
          setTimeout(() => setIsMatrixPulseActive(false), 2400);

          setState((prev) => ({
            ...prev,
            foundKonami: true,
            activeLocation: "footer", // Circle teleports to footer!
          }));

          sayMessage("WAIT. YOU ACTUALLY KNOW THAT?!", "shocked", undefined, 4500);

          setTimeout(() => {
            sayMessage(
              "Okay, okay. You found one. But there's a problem: I think there are three, and I don't remember where the other two are. Find me...",
              "secretive",
              undefined,
              8000
            );
          }, 4700);
        }
      } else {
        // Reset konami matching if wrong key
        konamiIndexRef.current = pressedKey.toLowerCase() === KONAMI_SEQUENCE[0].toLowerCase() ? 1 : 0;
      }

      // If user presses keys before knowing Konami hint, nudge them once
      if (!hasTriggeredKeyHint.current && !state.foundKonami && state.hasMet) {
        hasTriggeredKeyHint.current = true;
        setTimeout(() => {
          sayMessage("Oh! You found the keyboard. There's an old cheat code I remember: Up. Up. Down. Down... ...ugh, I forgot the rest.", "teasing", undefined, 7000);
        }, 3000);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sayMessage, state.foundKonami, state.hasMet]);

  // Idle timer to drop sarcastic observations occasionally
  useEffect(() => {
    const resetIdleTimer = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        if (!currentDialogue && !isSecretRoomOpen) {
          const idleQuips = [
            "Hmm. You've been staring at this page for a while.",
            "You really just scroll past everything, huh?",
            "I could tell you what that does... but then it wouldn't be a secret. 😌",
            "I have no idea what I'm doing either.",
            "Sometimes you have to look behind the website.",
          ];
          const chosen = idleQuips[Math.floor(Math.random() * idleQuips.length)];
          sayMessage(chosen, "idle", undefined, 6000);
        }
      }, 75000); // 75s of idle
    };

    window.addEventListener("mousemove", resetIdleTimer, { passive: true });
    window.addEventListener("scroll", resetIdleTimer, { passive: true });
    resetIdleTimer();

    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      window.removeEventListener("mousemove", resetIdleTimer);
      window.removeEventListener("scroll", resetIdleTimer);
    };
  }, [currentDialogue, isSecretRoomOpen, sayMessage]);

  // Click / Poke on the Circle
  const pokeCircle = useCallback(() => {
    soundFX.playPoke();
    setState((prev) => {
      const newCount = prev.clickCount + 1;
      let text = "Hey, that tickles.";
      let newMood: CircleMood = "teasing";

      if (newCount === 1) {
        text = "See? You can interact with things. Not everything interesting is clickable, though.";
        newMood = "curious";
      } else if (newCount === 3) {
        text = "Okay, don't wear out my geometry.";
      } else if (newCount === 7) {
        text = "Are you testing my collision detection?";
      } else if (newCount === 12) {
        text = "Achievement unlocked: Aggressive Poking.";
        soundFX.playSecretFound();
      } else if (newCount === 20) {
        text = "I am a geometric entity, not bubble wrap.";
        newMood = "shocked";
      } else if (newCount > 25 && newCount % 10 === 0) {
        text = "Still poking? You're remarkably persistent.";
      }

      sayMessage(text, newMood, undefined, 5000);
      return { ...prev, clickCount: newCount };
    });
  }, [sayMessage]);

  // Footer glyph secret
  const triggerFooterSecret = useCallback(() => {
    if (state.foundFooter) return;
    soundFX.playSecretFound();
    setState((prev) => ({
      ...prev,
      foundFooter: true,
      activeLocation: "corner", // Teleports back to main corner
    }));
    sayMessage(
      "Finally. Do you always read the bottom of websites? Most people don't. That's why I hide things here. You found the second one.",
      "celebrating",
      undefined,
      8000
    );
  }, [state.foundFooter, sayMessage]);

  // Snack secret (via inspect element or window.feedCircle)
  const triggerSnackSecret = useCallback(() => {
    if (state.foundSnack) {
      soundFX.playSnackMunch();
      sayMessage("Nom nom. Another snack? You're spoiling me.", "celebrating", undefined, 4000);
      return;
    }
    soundFX.playSnackMunch();
    setState((prev) => ({
      ...prev,
      foundSnack: true,
    }));
    sayMessage(
      "...you're cheating. (Or you're a real developer. Respect.) That data snack hit the spot.",
      "celebrating",
      undefined,
      8000
    );
  }, [state.foundSnack, sayMessage]);

  // Lore file discovered inside Secret Room
  const triggerCircleLoreSecret = useCallback(() => {
    if (state.discoveredCircleOrigin) return;
    soundFX.playSecretFound();
    setState((prev) => ({
      ...prev,
      discoveredCircleOrigin: true,
    }));
    sayMessage(
      "Oh... so you found my source log. Don't believe everything Kaiwal writes. I let him keep his portfolio here.",
      "secretive",
      undefined,
      8000
    );
  }, [state.discoveredCircleOrigin, sayMessage]);

  // Secret Room open/close
  const openSecretRoom = useCallback(() => {
    soundFX.playRoomPortal();
    setState((prev) => ({ ...prev, foundSecretRoom: true }));
    setIsSecretRoomOpen(true);
    setIsQuestLogOpen(false);
    clearDialogue();
  }, [clearDialogue]);

  const closeSecretRoom = useCallback(() => {
    setIsSecretRoomOpen(false);
    sayMessage("Welcome back to the surface. Your secret room access remains unlocked.", "idle", undefined, 5000);
  }, [sayMessage]);

  const toggleQuestLog = useCallback(() => {
    soundFX.playSpeechBleep(700);
    setIsQuestLogOpen((prev) => !prev);
  }, []);

  const toggleMinimize = useCallback(() => {
    setState((prev) => ({ ...prev, isMinimized: !prev.isMinimized }));
  }, []);

  const toggleMute = useCallback(() => {
    setState((prev) => {
      const nextMuted = !prev.isMuted;
      soundFX.isMuted = nextMuted;
      return { ...prev, isMuted: nextMuted };
    });
  }, []);

  const resetGame = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    setState({ ...DEFAULT_STATE, hasMet: false });
    setIsSecretRoomOpen(false);
    setIsQuestLogOpen(false);
    clearDialogue();
    sayMessage("Memory purged. Starting fresh.", "curious", undefined, 3000);
  }, [clearDialogue, sayMessage]);

  return (
    <SecretGameContext.Provider
      value={{
        state,
        mood,
        currentDialogue,
        isQuestLogOpen,
        isSecretRoomOpen,
        isMatrixPulseActive,
        quests,
        unlockedCount,
        totalQuests,
        isRoomUnlocked,
        pokeCircle,
        sayMessage,
        clearDialogue,
        triggerFooterSecret,
        triggerSnackSecret,
        triggerCircleLoreSecret,
        openSecretRoom,
        closeSecretRoom,
        toggleQuestLog,
        toggleMinimize,
        toggleMute,
        resetGame,
      }}
    >
      {children}
    </SecretGameContext.Provider>
  );
}

export function useSecretGame() {
  const context = useContext(SecretGameContext);
  if (!context) {
    throw new Error("useSecretGame must be used within a SecretGameProvider");
  }
  return context;
}
