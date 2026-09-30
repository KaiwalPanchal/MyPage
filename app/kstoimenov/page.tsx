"use client";

import React, { useState } from "react";
import Preloader from "@/components/kstoimenov/Preloader";
import CustomCursor from "@/components/kstoimenov/CustomCursor";
import ScrollNav from "@/components/kstoimenov/ScrollNav";
import HeroSection from "@/components/kstoimenov/HeroSection";
import AboutSection from "@/components/kstoimenov/AboutSection";
import PlayRealSection from "@/components/kstoimenov/PlayRealSection";
import MetricsSection from "@/components/kstoimenov/MetricsSection";
import ServicesSection from "@/components/kstoimenov/ServicesSection";
import WorksSection from "@/components/kstoimenov/WorksSection";
import WorksCtaSection from "@/components/kstoimenov/WorksCtaSection";
import TestimonialsSection from "@/components/kstoimenov/TestimonialsSection";
import QuoteSection from "@/components/kstoimenov/QuoteSection";
import PartnersSection from "@/components/kstoimenov/PartnersSection";
import FooterSection from "@/components/kstoimenov/FooterSection";
import EffectAnnotator from "@/components/kstoimenov/EffectAnnotator";

export default function KStoimenovPage() {
  const [heroReady, setHeroReady] = useState(false);

  return (
    <>
      {/* 6-Panel Page Transition Overlay */}
      <div className="pt-overlay" aria-hidden="true">
        <div className="pt-panel" />
        <div className="pt-panel" />
        <div className="pt-panel" />
        <div className="pt-panel" />
        <div className="pt-panel" />
        <div className="pt-panel" />
      </div>

      {/* SVG Chromatic Aberration & Liquid Glass Filter */}
      <svg
        aria-hidden="true"
        width="0"
        height="0"
        style={{ position: "absolute" }}
      >
        <filter
          id="liquid-glass"
          x="-35%"
          y="-35%"
          width="170%"
          height="170%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.011 0.011"
            numOctaves="2"
            seed="14"
            result="noise"
          />
          <feGaussianBlur in="noise" stdDeviation="3.2" result="map" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="map"
            scale="57.1"
            xChannelSelector="R"
            yChannelSelector="G"
            result="dR"
          />
          <feColorMatrix
            in="dR"
            type="matrix"
            values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
            result="cR"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="map"
            scale="49"
            xChannelSelector="R"
            yChannelSelector="G"
            result="dG"
          />
          <feColorMatrix
            in="dG"
            type="matrix"
            values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
            result="cG"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="map"
            scale="40.9"
            xChannelSelector="R"
            yChannelSelector="G"
            result="dB"
          />
          <feColorMatrix
            in="dB"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
            result="cB"
          />
          <feBlend in="cR" in2="cG" mode="screen" result="rg" />
          <feBlend in="rg" in2="cB" mode="screen" />
        </filter>
      </svg>

      {/* Intro Preloader */}
      <Preloader onComplete={() => setHeroReady(true)} />

      {/* Custom Trailing Cursor */}
      <CustomCursor />

      {/* Floating Morphing Navigation */}
      <ScrollNav />

      {/* Main Content Sections */}
      <main style={{ background: "var(--bg)", minHeight: "100vh" }}>
        <HeroSection isReady={heroReady} />
        <AboutSection />
        <PlayRealSection />
        <MetricsSection />
        <ServicesSection />
        <WorksSection />
        <WorksCtaSection />
        <TestimonialsSection />
        <QuoteSection />
        <PartnersSection />
      </main>

      {/* Footer */}
      <FooterSection />

      {/* Visual Effects Feedback & Marking Tool */}
      <EffectAnnotator />
    </>
  );
}
