"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Crosshair,
  Square,
  Copy,
  Trash2,
  X,
  Check,
  Sparkles,
  MousePointer,
  ChevronUp,
  ChevronDown,
  Layers,
} from "lucide-react";

export interface SelectedEffect {
  id: string;
  name: string;
  category: string;
  note: string;
  tags: string[];
  rect: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  scrollOffset: number;
}

const QUICK_TAGS = [
  "⭐ Love this animation",
  "✨ Want this shader/effect",
  "🎨 Love the typography",
  "⚡ Great micro-interaction",
  "🌊 Smooth motion/easing",
];

// Helper to identify the effect based on DOM element
function identifyElementEffect(el: HTMLElement): { name: string; category: string } {
  if (el.closest("[data-hero-shader]")) {
    return { name: "Hero Lenticular Glass Shader", category: "WebGL Shader" };
  }
  if (el.closest(".Hero-module___w2HtG__logo") || el.tagName === "CANVAS") {
    return { name: "Dual-Frequency Waving Logo Canvas", category: "2D Canvas Animation" };
  }
  if (el.closest("[data-scramble]")) {
    return { name: "Text Scramble ('remarkable')", category: "Text Animation" };
  }
  if (el.closest(".Hero-module___w2HtG__banner") || el.closest("[data-split]")) {
    return { name: "Hero Staggered Typography Reveal", category: "Typography Animation" };
  }
  if (el.closest(".Hero-module___w2HtG__cta")) {
    return { name: "Hero 'Book a call' Magnetic Button", category: "UI Component" };
  }
  if (el.closest(".ScrollNav-module__7VkX4q__nav")) {
    return { name: "Morphing Floating Navigation Pill", category: "Navigation & Scroll" };
  }
  if (el.closest(".ScrollNav-module__7VkX4q__themeBtn")) {
    return { name: "Dark / Light Theme Toggle", category: "Theme Switcher" };
  }
  if (el.closest(".About-module__RHteCa__rail")) {
    return { name: "28-Tick Scroll Measurement Rail", category: "Scroll Indicator" };
  }
  if (el.closest("[data-glyph]")) {
    const anim = (el.closest("[data-glyph]") as HTMLElement).dataset.anim;
    return { name: `Animated About Glyph (${anim || "pop"})`, category: "Physics Micro-interaction" };
  }
  if (el.closest("[data-ubar]") || el.closest(".About-module__RHteCa__u")) {
    return { name: "Scroll-Driven Underline Reveal", category: "Typography Interaction" };
  }
  if (el.closest(".About-module__RHteCa__about") || el.closest("[data-w]")) {
    return { name: "Word-by-Word Scroll Opacity Reading Flow", category: "Scroll Typography" };
  }
  if (el.closest(".PlayReal-module__DHAyZG__marquee") || el.closest(".PlayReal-module__DHAyZG__track")) {
    return { name: "Infinite Dual-Font Marquee ('Play Real')", category: "Marquee Animation" };
  }
  if (el.closest(".PlayReal-module__DHAyZG__real") || el.closest("video")) {
    return { name: "Viewport-Driven Zoom Showreel Stage", category: "Video & Scroll Motion" };
  }
  if (el.closest(".Metrics-module__XDldpW__metrics") || el.closest(".Metrics-module__XDldpW__card")) {
    return { name: "Staggered Sliding Metrics Cards", category: "Data Display" };
  }
  if (el.closest(".Services-module__uj7JVa__row")) {
    return { name: "Rolling Service Row with Masked Icon", category: "Hover Interaction" };
  }
  if (el.closest(".Works-module__1r4-Aa__media") || el.closest(".Works-module__1r4-Aa__works")) {
    return { name: "Case Study Media Card & View Case Hover", category: "Portfolio Grid" };
  }
  if (el.closest(".WorksCta-module__F5CAGa__toggle") || el.closest(".WorksCta-module__F5CAGa__cta")) {
    return { name: "Blinking Eye Widget & Green Grain Switch", category: "Interactive Widget" };
  }
  if (el.closest(".Testimonials-module__X7R5sW__deck") || el.closest(".Testimonials-module__X7R5sW__card")) {
    return { name: "Testimonial Swipeable Card Deck", category: "Card Carousel" };
  }
  if (el.closest(".Quote-module__MD2jyW__icon") || el.closest(".Quote-module__MD2jyW__quote")) {
    return { name: "Parallax Typography & Floating Ornaments", category: "Parallax Scrolling" };
  }
  if (el.closest(".Partners-module__R2wEiG__grid") || el.closest(".Partners-module__R2wEiG__partners")) {
    return { name: "17-Partner Logo Grid with Borders", category: "Client Showcase" };
  }
  if (el.closest(".Footer-module__KWgBSG__footer")) {
    return { name: "Footer & Back-To-Top Button", category: "Footer Interaction" };
  }

  return {
    name: el.tagName.toLowerCase() + (el.className ? `.${el.className.split(" ")[0]}` : ""),
    category: "Custom Selection",
  };
}

export default function EffectAnnotator() {
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"element" | "box">("element");
  const [selections, setSelections] = useState<SelectedEffect[]>([]);
  const [hoveredRect, setHoveredRect] = useState<{
    rect: DOMRect;
    name: string;
    category: string;
  } | null>(null);

  // Box drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [currentBox, setCurrentBox] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  // Dialog for editing selected item note
  const [pendingSelection, setPendingSelection] = useState<SelectedEffect | null>(null);
  const [noteInput, setNoteInput] = useState("");
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load selections from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("krs_user_selections");
      if (saved) {
        setSelections(JSON.parse(saved));
      }
    } catch {}
  }, []);

  // Save selections
  const saveSelections = (updated: SelectedEffect[]) => {
    setSelections(updated);
    try {
      localStorage.setItem("krs_user_selections", JSON.stringify(updated));
    } catch {}
  };

  // Hover detection in element mode
  useEffect(() => {
    if (!isActive || mode !== "element" || pendingSelection) {
      setHoveredRect(null);
      return;
    }

    const onPointerMove = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || target.closest("#effect-annotator-toolbar") || target.closest("#effect-annotator-modal")) {
        setHoveredRect(null);
        return;
      }

      // Find suitable parent element that represents a feature or section
      const feature =
        target.closest(
          "[data-hero-shader], .Hero-module___w2HtG__logo, [data-scramble], [data-split], .Hero-module___w2HtG__cta, .ScrollNav-module__7VkX4q__nav, [data-glyph], [data-ubar], .About-module__RHteCa__rail, .About-module__RHteCa__textBlock, .PlayReal-module__DHAyZG__real, .Metrics-module__XDldpW__card, .Services-module__uj7JVa__row, .Works-module__1r4-Aa__media, .WorksCta-module__F5CAGa__cta, .Testimonials-module__X7R5sW__deck, .Quote-module__MD2jyW__quote, .Partners-module__R2wEiG__grid, .Footer-module__KWgBSG__footer"
        ) as HTMLElement || target;

      const rect = feature.getBoundingClientRect();
      const meta = identifyElementEffect(feature);
      setHoveredRect({ rect, name: meta.name, category: meta.category });
    };

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target || target.closest("#effect-annotator-toolbar") || target.closest("#effect-annotator-modal")) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();

      const feature =
        target.closest(
          "[data-hero-shader], .Hero-module___w2HtG__logo, [data-scramble], [data-split], .Hero-module___w2HtG__cta, .ScrollNav-module__7VkX4q__nav, [data-glyph], [data-ubar], .About-module__RHteCa__rail, .About-module__RHteCa__textBlock, .PlayReal-module__DHAyZG__real, .Metrics-module__XDldpW__card, .Services-module__uj7JVa__row, .Works-module__1r4-Aa__media, .WorksCta-module__F5CAGa__cta, .Testimonials-module__X7R5sW__deck, .Quote-module__MD2jyW__quote, .Partners-module__R2wEiG__grid, .Footer-module__KWgBSG__footer"
        ) as HTMLElement || target;

      const rect = feature.getBoundingClientRect();
      const meta = identifyElementEffect(feature);

      const newSel: SelectedEffect = {
        id: "sel_" + Date.now(),
        name: meta.name,
        category: meta.category,
        note: "",
        tags: [],
        rect: {
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX,
          width: rect.width,
          height: rect.height,
        },
        scrollOffset: window.scrollY,
      };

      setPendingSelection(newSel);
      setNoteInput("");
      setActiveTags([]);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("click", onClick, { capture: true });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("click", onClick, { capture: true });
    };
  }, [isActive, mode, pendingSelection]);

  // Box drawing mode
  const onMouseDown = (e: React.MouseEvent) => {
    if (!isActive || mode !== "box" || pendingSelection) return;
    const target = e.target as HTMLElement;
    if (target.closest("#effect-annotator-toolbar") || target.closest("#effect-annotator-modal")) return;

    setIsDrawing(true);
    setDrawStart({ x: e.clientX, y: e.clientY });
    setCurrentBox({
      left: e.clientX + window.scrollX,
      top: e.clientY + window.scrollY,
      width: 0,
      height: 0,
    });
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !drawStart) return;

    const left = Math.min(drawStart.x, e.clientX) + window.scrollX;
    const top = Math.min(drawStart.y, e.clientY) + window.scrollY;
    const width = Math.abs(e.clientX - drawStart.x);
    const height = Math.abs(e.clientY - drawStart.y);

    setCurrentBox({ left, top, width, height });
  };

  const onMouseUp = (e: React.MouseEvent) => {
    if (!isDrawing || !currentBox) return;
    setIsDrawing(false);

    if (currentBox.width > 25 && currentBox.height > 25) {
      // Determine what was under the center of the box
      const cx = currentBox.left - window.scrollX + currentBox.width / 2;
      const cy = currentBox.top - window.scrollY + currentBox.height / 2;
      const elementAtPoint = document.elementFromPoint(cx, cy) as HTMLElement | null;
      const meta = elementAtPoint ? identifyElementEffect(elementAtPoint) : { name: "Custom Area Selection", category: "Custom Area" };

      const newSel: SelectedEffect = {
        id: "sel_" + Date.now(),
        name: meta.name,
        category: meta.category,
        note: "",
        tags: [],
        rect: currentBox,
        scrollOffset: window.scrollY,
      };

      setPendingSelection(newSel);
      setNoteInput("");
      setActiveTags([]);
    }

    setCurrentBox(null);
    setDrawStart(null);
  };

  const confirmPending = () => {
    if (!pendingSelection) return;
    const finalSel: SelectedEffect = {
      ...pendingSelection,
      note: noteInput,
      tags: activeTags,
    };
    saveSelections([...selections, finalSel]);
    setPendingSelection(null);
    setDrawerOpen(true);
  };

  const deleteSelection = (id: string) => {
    saveSelections(selections.filter((s) => s.id !== id));
  };

  const toggleTag = (tag: string) => {
    if (activeTags.includes(tag)) {
      setActiveTags(activeTags.filter((t) => t !== tag));
    } else {
      setActiveTags([...activeTags, tag]);
    }
  };

  // Generate markdown feedback to paste in chat
  const copyFeedback = () => {
    if (selections.length === 0) return;

    let text = `### 🎯 Effects & Components I Liked on https://kstoimenov.com/:\n\n`;
    selections.forEach((s, idx) => {
      text += `${idx + 1}. **${s.name}** (${s.category})\n`;
      if (s.tags.length > 0) {
        text += `   - **Tags:** ${s.tags.join(", ")}\n`;
      }
      if (s.note.trim()) {
        text += `   - **My Notes:** ${s.note.trim()}\n`;
      }
      text += `   - **Position:** [top: ${Math.round(s.rect.top)}px, left: ${Math.round(s.rect.left)}px, ${Math.round(s.rect.width)}x${Math.round(s.rect.height)}px]\n\n`;
    });

    text += `Please refine / prioritize these specific elements in our project!`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      {/* Box Drawing Canvas Overlay (when in box mode) */}
      {isActive && mode === "box" && (
        <div
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9000,
            cursor: "crosshair",
            pointerEvents: pendingSelection ? "none" : "auto",
          }}
        />
      )}

      {/* Real-time Drawing Box Preview */}
      {currentBox && (
        <div
          style={{
            position: "absolute",
            left: `${currentBox.left}px`,
            top: `${currentBox.top}px`,
            width: `${currentBox.width}px`,
            height: `${currentBox.height}px`,
            border: "2px dashed #6fff54",
            backgroundColor: "rgba(111, 255, 84, 0.15)",
            boxShadow: "0 0 20px rgba(111, 255, 84, 0.4)",
            pointerEvents: "none",
            zIndex: 9500,
            borderRadius: "6px",
          }}
        />
      )}

      {/* Hovered Element Snapping Highlight */}
      {isActive && mode === "element" && hoveredRect && !pendingSelection && (
        <div
          style={{
            position: "absolute",
            left: `${hoveredRect.rect.left + window.scrollX}px`,
            top: `${hoveredRect.rect.top + window.scrollY}px`,
            width: `${hoveredRect.rect.width}px`,
            height: `${hoveredRect.rect.height}px`,
            border: "2px solid #6fff54",
            backgroundColor: "rgba(111, 255, 84, 0.08)",
            boxShadow: "0 0 25px rgba(111, 255, 84, 0.35)",
            pointerEvents: "none",
            zIndex: 9500,
            borderRadius: "6px",
            transition: "all 0.1s ease-out",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-28px",
              left: "0",
              background: "#121212",
              color: "#6fff54",
              border: "1px solid #6fff54",
              fontSize: "12px",
              fontWeight: 500,
              padding: "2px 8px",
              borderRadius: "4px",
              whiteSpace: "nowrap",
              boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Sparkles size={12} />
            <span>{hoveredRect.name}</span>
            <span style={{ color: "#828282", fontSize: "10px" }}>
              ({hoveredRect.category})
            </span>
          </div>
        </div>
      )}

      {/* Render Saved Boxes & Highlight Pins */}
      {selections.map((sel, idx) => (
        <div
          key={sel.id}
          style={{
            position: "absolute",
            left: `${sel.rect.left}px`,
            top: `${sel.rect.top}px`,
            width: `${sel.rect.width}px`,
            height: `${sel.rect.height}px`,
            border: "2px solid #6fff54",
            backgroundColor: "rgba(111, 255, 84, 0.12)",
            boxShadow: "0 0 15px rgba(111, 255, 84, 0.3)",
            pointerEvents: "none",
            zIndex: 8900,
            borderRadius: "6px",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-26px",
              left: "4px",
              background: "#6fff54",
              color: "#000",
              fontSize: "11px",
              fontWeight: 700,
              padding: "2px 8px",
              borderRadius: "4px",
              display: "flex",
              alignItems: "center",
              gap: "4px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.4)",
            }}
          >
            <span>#{idx + 1} {sel.name}</span>
          </div>
        </div>
      ))}

      {/* Floating Bottom Toolbar */}
      <div
        id="effect-annotator-toolbar"
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 99999,
          display: "flex",
          alignItems: "center",
          gap: "12px",
          background: "#181818ee",
          backdropFilter: "blur(16px)",
          border: "1px solid #333",
          padding: "8px 14px",
          borderRadius: "9999px",
          boxShadow: "0 10px 35px rgba(0,0,0,0.6), 0 0 20px rgba(111,255,84,0.15)",
        }}
      >
        <button
          type="button"
          onClick={() => setIsActive(!isActive)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: isActive ? "#6fff54" : "#2a2a2a",
            color: isActive ? "#000" : "#fff",
            border: "none",
            padding: "8px 16px",
            borderRadius: "9999px",
            fontWeight: 600,
            fontSize: "13px",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          <Crosshair size={16} />
          <span>{isActive ? "Selector Active" : "Select Effects I Like"}</span>
          {selections.length > 0 && (
            <span
              style={{
                background: isActive ? "#000" : "#6fff54",
                color: isActive ? "#6fff54" : "#000",
                fontSize: "11px",
                fontWeight: 700,
                padding: "1px 7px",
                borderRadius: "9999px",
              }}
            >
              {selections.length}
            </span>
          )}
        </button>

        {isActive && (
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <button
              type="button"
              onClick={() => setMode("element")}
              title="Click on any element/section to select"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: mode === "element" ? "#383838" : "transparent",
                color: mode === "element" ? "#6fff54" : "#888",
                border: "1px solid",
                borderColor: mode === "element" ? "#6fff54" : "#444",
                padding: "6px 12px",
                borderRadius: "9999px",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              <MousePointer size={14} />
              <span>Snap Element</span>
            </button>

            <button
              type="button"
              onClick={() => setMode("box")}
              title="Drag a custom box anywhere"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                background: mode === "box" ? "#383838" : "transparent",
                color: mode === "box" ? "#6fff54" : "#888",
                border: "1px solid",
                borderColor: mode === "box" ? "#6fff54" : "#444",
                padding: "6px 12px",
                borderRadius: "9999px",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              <Square size={14} />
              <span>Draw Box</span>
            </button>
          </div>
        )}

        {selections.length > 0 && (
          <button
            type="button"
            onClick={() => setDrawerOpen(!drawerOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "#222",
              color: "#fff",
              border: "1px solid #444",
              padding: "6px 12px",
              borderRadius: "9999px",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            <Layers size={14} />
            <span>List ({selections.length})</span>
            {drawerOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>
        )}
      </div>

      {/* Note & Tagging Modal (appears when a selection is made) */}
      {pendingSelection && (
        <div
          id="effect-annotator-modal"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100000,
            background: "rgba(0,0,0,0.65)",
            backdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              background: "#181818",
              border: "1px solid #333",
              borderRadius: "16px",
              width: "100%",
              maxWidth: "480px",
              padding: "24px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(111,255,84,0.15)",
              color: "#fff",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span
                  style={{
                    color: "#6fff54",
                    fontSize: "11px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  {pendingSelection.category}
                </span>
                <h3 style={{ margin: "4px 0 0", fontSize: "18px", fontWeight: 600 }}>
                  {pendingSelection.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPendingSelection(null)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#888",
                  cursor: "pointer",
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  color: "#aaa",
                  marginBottom: "8px",
                  fontWeight: 500,
                }}
              >
                Quick Tags:
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {QUICK_TAGS.map((tag) => {
                  const selected = activeTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      style={{
                        background: selected ? "rgba(111,255,84,0.2)" : "#222",
                        color: selected ? "#6fff54" : "#bbb",
                        border: selected ? "1px solid #6fff54" : "1px solid #333",
                        fontSize: "12px",
                        padding: "5px 10px",
                        borderRadius: "9999px",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                      }}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  color: "#aaa",
                  marginBottom: "6px",
                  fontWeight: 500,
                }}
              >
                What specifically do you like about this? (Optional)
              </label>
              <textarea
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="e.g. Love how it ripples when hovered, or the color gradient..."
                rows={3}
                style={{
                  width: "100%",
                  background: "#111",
                  border: "1px solid #333",
                  color: "#fff",
                  borderRadius: "8px",
                  padding: "10px",
                  fontSize: "13px",
                  resize: "none",
                  outline: "none",
                  fontFamily: "inherit",
                }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "8px" }}>
              <button
                type="button"
                onClick={() => setPendingSelection(null)}
                style={{
                  background: "#222",
                  color: "#ccc",
                  border: "1px solid #444",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmPending}
                style={{
                  background: "#6fff54",
                  color: "#000",
                  fontWeight: 600,
                  border: "none",
                  padding: "8px 20px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <Check size={16} />
                <span>Save Selection</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selected Effects Summary Drawer */}
      {drawerOpen && selections.length > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: "80px",
            right: "24px",
            zIndex: 99998,
            width: "380px",
            maxHeight: "520px",
            background: "#181818f2",
            backdropFilter: "blur(20px)",
            border: "1px solid #333",
            borderRadius: "16px",
            padding: "18px",
            boxShadow: "0 20px 50px rgba(0,0,0,0.7), 0 0 30px rgba(111,255,84,0.12)",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <h4 style={{ margin: 0, fontSize: "15px", fontWeight: 600 }}>
                My Marked Effects ({selections.length})
              </h4>
            </div>
            <button
              type="button"
              onClick={() => setDrawerOpen(false)}
              style={{ background: "transparent", border: "none", color: "#888", cursor: "pointer" }}
            >
              <X size={16} />
            </button>
          </div>

          <div
            style={{
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              maxHeight: "320px",
              paddingRight: "4px",
            }}
          >
            {selections.map((sel, idx) => (
              <div
                key={sel.id}
                style={{
                  background: "#111",
                  border: "1px solid #282828",
                  borderRadius: "10px",
                  padding: "10px 12px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "10px",
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span
                      style={{
                        background: "#6fff54",
                        color: "#000",
                        fontSize: "10px",
                        fontWeight: 700,
                        padding: "1px 5px",
                        borderRadius: "4px",
                      }}
                    >
                      #{idx + 1}
                    </span>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#fff" }}>
                      {sel.name}
                    </span>
                  </div>

                  {sel.tags.length > 0 && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "2px" }}>
                      {sel.tags.map((t) => (
                        <span
                          key={t}
                          style={{
                            background: "rgba(111,255,84,0.12)",
                            color: "#6fff54",
                            fontSize: "10px",
                            padding: "2px 6px",
                            borderRadius: "4px",
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {sel.note && (
                    <p style={{ margin: "2px 0 0", fontSize: "12px", color: "#aaa", fontStyle: "italic" }}>
                      “{sel.note}”
                    </p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => deleteSelection(sel.id)}
                  title="Remove"
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#666",
                    cursor: "pointer",
                    padding: "4px",
                  }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "auto" }}>
            <button
              type="button"
              onClick={copyFeedback}
              style={{
                background: copied ? "#22c55e" : "#6fff54",
                color: "#000",
                fontWeight: 700,
                border: "none",
                padding: "10px 16px",
                borderRadius: "10px",
                fontSize: "13px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "all 0.2s ease",
              }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}
              <span>{copied ? "Copied! Paste directly in chat" : "Copy Feedback for Chat"}</span>
            </button>

            <button
              type="button"
              onClick={() => saveSelections([])}
              style={{
                background: "transparent",
                color: "#777",
                border: "none",
                fontSize: "11px",
                cursor: "pointer",
                padding: "4px",
              }}
            >
              Clear all marks
            </button>
          </div>
        </div>
      )}
    </>
  );
}
