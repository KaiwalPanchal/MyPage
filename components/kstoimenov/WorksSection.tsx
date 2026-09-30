"use client";

import React from "react";

interface WorkProject {
  key: string;
  tag: string;
  title: string;
  href: string;
  main: { src: string; bg?: string };
  side?: { src: string; bg?: string };
  gallery?: { src: string; bg?: string }[];
}

const PROJECTS: WorkProject[] = [
  {
    key: "acronis",
    tag: "Cyber security",
    title: "Acronis Cyber Protect",
    href: "#acronis",
    main: { src: "/MyPage/assets/works/acronis-main.avif" },
    side: { src: "/MyPage/assets/works/acronis-side.avif", bg: "#01218f" },
    gallery: [
      { src: "/MyPage/assets/works/acronis-g1.avif", bg: "#000a3d" },
      { src: "/MyPage/assets/works/acronis-g2.avif", bg: "#001353" },
      { src: "/MyPage/assets/works/acronis-g3.avif", bg: "#828282" },
    ],
  },
  {
    key: "polygon",
    tag: "Finance",
    title: "Polygon",
    href: "#polygon",
    main: { src: "/MyPage/assets/works/polygon-main.avif", bg: "#0e131f" },
    side: { src: "/MyPage/assets/works/polygon-side.avif", bg: "#1a1a1a" },
  },
  {
    key: "db",
    tag: "Finance",
    title: "DB Digital Wallet",
    href: "#db",
    main: { src: "/MyPage/assets/works/db-main.avif" },
    side: { src: "/MyPage/assets/works/db-side.avif", bg: "#828282" },
    gallery: [
      { src: "/MyPage/assets/works/db-g1.avif", bg: "#828282" },
      { src: "/MyPage/assets/works/db-g2.avif", bg: "#2bbfff" },
      { src: "/MyPage/assets/works/db-g3.avif", bg: "#9a8ff7" },
    ],
  },
  {
    key: "wp",
    tag: "Hosting",
    title: "WP Engine",
    href: "#wp",
    main: { src: "/MyPage/assets/works/wpengine/w1.avif" },
    side: { src: "/MyPage/assets/works/wpengine/w2.avif" },
  },
  {
    key: "macmillan",
    tag: "Healthcare",
    title: "Macmillan Cancer Support",
    href: "#macmillan",
    main: { src: "/MyPage/assets/works/macmillan-main.avif" },
    side: { src: "/MyPage/assets/works/macmillan-side.avif" },
  },
  {
    key: "orion",
    tag: "Finance",
    title: "Orion",
    href: "#orion",
    main: { src: "/MyPage/assets/works/orion-main.avif" },
    side: { src: "/MyPage/assets/works/orion-side.avif" },
    gallery: [
      { src: "/MyPage/assets/works/orion-g1.avif" },
      { src: "/MyPage/assets/works/orion-g2.avif" },
      { src: "/MyPage/assets/works/orion-g3.avif" },
    ],
  },
];

export default function WorksSection() {
  const triggerCursor = (type: string) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("cursorvariant", { detail: type })
      );
    }
  };

  return (
    <section className="Works-module__1r4-Aa__works" id="works">
      <div className="Works-module__1r4-Aa__grid">
        {PROJECTS.map((proj, pIdx) => (
          <div key={proj.key} style={{ position: "relative", marginBottom: "8rem" }}>
            {pIdx > 0 && <div className="Works-module__1r4-Aa__divider" />}

            <span className="Works-module__1r4-Aa__tag">{proj.tag}</span>
            <p className="Works-module__1r4-Aa__title">{proj.title}</p>
            <a
              className="Works-module__1r4-Aa__link Works-module__1r4-Aa__linkView"
              href={proj.href}
            >
              View project
            </a>

            {/* Media Row: Main + Side */}
            <div
              style={{
                display: "flex",
                gap: "2.25rem",
                marginTop: "2.5rem",
                flexWrap: "wrap",
              }}
            >
              {/* Main Media */}
              <a
                className="Works-module__1r4-Aa__media"
                data-work-media="true"
                data-kind="main"
                style={{
                  width: proj.side ? "56.25rem" : "85.75rem",
                  height: "32.9375rem",
                  position: "relative",
                  display: "block",
                }}
                href={proj.href}
                aria-label={`${proj.title} — view case study`}
                onMouseEnter={() => triggerCursor("viewcase")}
                onMouseLeave={() => triggerCursor("default")}
              >
                <div
                  className="Works-module__1r4-Aa__inner"
                  style={{ background: proj.main.bg || "#000" }}
                >
                  <img
                    alt={proj.title}
                    loading="lazy"
                    src={proj.main.src}
                    style={{
                      position: "absolute",
                      height: "100%",
                      width: "100%",
                      inset: 0,
                      objectFit: "cover",
                    }}
                  />
                </div>
              </a>

              {/* Side Media */}
              {proj.side && (
                <a
                  className="Works-module__1r4-Aa__media"
                  data-work-media="true"
                  data-kind="side"
                  style={{
                    width: "27.25rem",
                    height: "32.9375rem",
                    position: "relative",
                    display: "block",
                  }}
                  href={proj.href}
                  aria-hidden="true"
                  tabIndex={-1}
                  onMouseEnter={() => triggerCursor("viewcase")}
                  onMouseLeave={() => triggerCursor("default")}
                >
                  <div
                    className="Works-module__1r4-Aa__inner"
                    style={{ background: proj.side.bg || "#1a1a1a" }}
                  >
                    <img
                      alt=""
                      loading="lazy"
                      src={proj.side.src}
                      style={{
                        position: "absolute",
                        height: "100%",
                        width: "100%",
                        inset: 0,
                        objectFit: "cover",
                      }}
                    />
                  </div>
                </a>
              )}
            </div>

            {/* Gallery Row (if any) */}
            {proj.gallery && proj.gallery.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: "2rem",
                  marginTop: "2rem",
                  flexWrap: "wrap",
                }}
              >
                {proj.gallery.map((g, gIdx) => (
                  <a
                    key={gIdx}
                    className="Works-module__1r4-Aa__media"
                    data-work-media="true"
                    data-kind="g"
                    style={{
                      width: "27.25rem",
                      height: "18.9375rem",
                      position: "relative",
                      display: "block",
                    }}
                    href={proj.href}
                    aria-hidden="true"
                    tabIndex={-1}
                    onMouseEnter={() => triggerCursor("viewcase")}
                    onMouseLeave={() => triggerCursor("default")}
                  >
                    <div
                      className="Works-module__1r4-Aa__inner"
                      style={{ background: g.bg || "#000" }}
                    >
                      <img
                        alt=""
                        loading="lazy"
                        src={g.src}
                        style={{
                          position: "absolute",
                          height: "100%",
                          width: "100%",
                          inset: 0,
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
