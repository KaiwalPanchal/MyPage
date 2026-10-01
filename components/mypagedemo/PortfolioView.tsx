"use client";

import React, { useState } from "react";
import DemoCursor from "@/components/mypagedemo/DemoCursor";
import DemoHero from "@/components/mypagedemo/DemoHero";
import DemoAbout from "@/components/mypagedemo/DemoAbout";
import DemoExperience from "@/components/mypagedemo/DemoExperience";
import DemoBlog from "@/components/mypagedemo/DemoBlog";
import DemoParallaxQuote from "@/components/mypagedemo/DemoParallaxQuote";
import DemoFooterReveal from "@/components/mypagedemo/DemoFooterReveal";
import DemoFooter from "@/components/mypagedemo/DemoFooter";
import SecretGameLayer from "@/components/circle-game/SecretGameLayer";

export default function PortfolioView() {
  const [theme] = useState<"cyan" | "green">("cyan");

  return (
    <SecretGameLayer>
      <div className="mypagedemo-root" data-mypage-theme={theme}>
        {/* Precision Centered Trailing Cursor */}
        <DemoCursor />

        {/* Main Experience Flow */}
        <main>
          {/* Effect 1: Hero Staggered Typography Reveal + Scramble + WebGL Caustic Wave Shader */}
          <DemoHero theme={theme} isReady={true} />

          {/* Effect 2: Word-by-Word Scroll Opacity Reading Flow + Builder Narrative + AI Glyphs + Telemetry Rail */}
          <DemoAbout />

          {/* Vertical Job Experience Stack with Hairline Dividers, Sliding Text & Silver Grain Highlights */}
          <DemoExperience />

          {/* Technical Articles & Publications (Staggered Sliding Card Deck) */}
          <DemoBlog />

          {/* Effect 4: Parallax Drifting Typography + Floating Tech Badges */}
          <DemoParallaxQuote />

          {/* Living Background Shader at Bottom */}
          <DemoFooterReveal theme={theme} />

          {/* Effect 5: Footer & Back-To-Top Button + Masked Social Cards */}
          <DemoFooter />
        </main>
      </div>
    </SecretGameLayer>
  );
}
