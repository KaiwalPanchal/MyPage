"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ArchiveNotice() {
  const [collapsed, setCollapsed] = useState(false);

  if (collapsed) {
    return (
      <div
        style={{
          position: "fixed",
          top: "16px",
          right: "16px",
          zIndex: 99990,
        }}
      >
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          style={{
            background: "rgba(18, 18, 18, 0.88)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "#facc15",
            padding: "8px 16px",
            borderRadius: "9999px",
            fontSize: "12px",
            fontFamily: "var(--font-sans, system-ui, sans-serif)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#facc15",
              boxShadow: "0 0 6px #facc15",
            }}
          />
          <span style={{ fontWeight: 600, letterSpacing: "0.05em" }}>ARCHIVE NOTICE</span>
        </button>
      </div>
    );
  }

  return (
    <aside
      aria-label="Archive notice"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 99990,
        background: "rgba(14, 14, 14, 0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
        padding: "10px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        color: "#d4d4d4",
        fontSize: "13px",
        fontFamily: "var(--font-sans, system-ui, sans-serif)",
        letterSpacing: "0.01em",
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.4)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "rgba(234, 179, 8, 0.15)",
            border: "1px solid rgba(234, 179, 8, 0.4)",
            color: "#facc15",
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            padding: "2px 8px",
            borderRadius: "4px",
            textTransform: "uppercase",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: "#facc15",
              boxShadow: "0 0 6px #facc15",
            }}
          />
          Archive Reference
        </span>
        <span style={{ color: "#a3a3a3", fontSize: "12px" }}>
          Interactive clone of <strong style={{ color: "#e5e5e5" }}>kstoimenov.com</strong> preserved for design, WebGL shader &amp; micro-interaction study.
        </span>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "14px", flexShrink: 0 }}>
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "#ffffff",
            color: "#0a0a0a",
            fontWeight: 600,
            fontSize: "12px",
            padding: "6px 14px",
            borderRadius: "9999px",
            textDecoration: "none",
            transition: "all 0.2s ease",
          }}
        >
          <span>← Live Portfolio</span>
        </Link>
        <button
          type="button"
          onClick={() => setCollapsed(true)}
          style={{
            color: "#737373",
            background: "transparent",
            border: "none",
            fontSize: "14px",
            cursor: "pointer",
            padding: "4px",
            lineHeight: 1,
          }}
          title="Minimize archive banner"
        >
          ✕
        </button>
      </div>
    </aside>
  );
}
