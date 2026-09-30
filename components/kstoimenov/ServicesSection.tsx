"use client";

import React from "react";

const SERVICES = [
  {
    key: "product-design",
    title: "Product design",
    badge1: "Product",
    badge2: "Design",
    iconMask: "/MyPage/assets/svc-product-design.svg",
    iconLeft: "21.8125rem",
    iconW: "4.375rem",
    iconH: "4.375rem",
    titleLeft: "27.1875rem",
  },
  {
    key: "digital-strategy",
    title: "Digital strategy",
    badge1: "Digital",
    badge2: "Strategy",
    iconMask: "/MyPage/assets/svc-digital-strategy.png",
    iconLeft: "20.625rem",
    iconW: "4.375rem",
    iconH: "4.375rem",
    titleLeft: "26rem",
  },
  {
    key: "web-design",
    title: "Web design",
    badge1: "Web",
    badge2: "Design",
    iconMask: "/MyPage/assets/svc-web-design.svg",
    iconLeft: "29.9375rem",
    iconW: "4.375rem",
    iconH: "4.375rem",
    titleLeft: "35.3125rem",
  },
  {
    key: "brand-identity",
    title: "Brand identity",
    badge1: "Brand",
    badge2: "Identity",
    iconMask: "/MyPage/assets/svc-brand-identity.svg",
    iconLeft: "26.6875rem",
    iconW: "4.375rem",
    iconH: "2.36rem",
    titleLeft: "32.0625rem",
  },
  {
    key: "service-design",
    title: "Service design",
    badge1: "Service",
    badge2: "Design",
    iconMask: "/MyPage/assets/svc-service-design.svg",
    iconLeft: "23.625rem",
    iconW: "4.375rem",
    iconH: "4.375rem",
    titleLeft: "29rem",
  },
];

export default function ServicesSection() {
  return (
    <section className="Services-module__uj7JVa__services" id="services">
      <div className="Services-module__uj7JVa__header">
        <p className="Services-module__uj7JVa__headerTitle">
          <em>Services</em>+ for better digital products
        </p>
        <p className="Services-module__uj7JVa__headerDesc">
          Six disciplines, one person on the hook for the outcome. I take
          products from rough idea to something people actually use, without
          the agency overhead.
        </p>
        <a className="Services-module__uj7JVa__headerBtn" href="#services">
          View services
        </a>
      </div>

      <div className="Services-module__uj7JVa__list">
        {SERVICES.map((s) => (
          <a
            key={s.key}
            className="Services-module__uj7JVa__row"
            href={`#${s.key}`}
          >
            <span
              className="Services-module__uj7JVa__rowIcon"
              data-icon=""
              style={{
                left: s.iconLeft,
                width: s.iconW,
                height: s.iconH,
                maskImage: `url(${s.iconMask})`,
                WebkitMaskImage: `url(${s.iconMask})`,
              }}
              aria-hidden="true"
            />
            <p
              className="Services-module__uj7JVa__rowTitle"
              style={{ left: s.titleLeft, top: 0 }}
            >
              <span className="Services-module__uj7JVa__rollInner">
                {s.title}
                <span
                  className="Services-module__uj7JVa__rollDup"
                  aria-hidden="true"
                >
                  {s.title}
                </span>
              </span>
            </p>
            <div
              className="Services-module__uj7JVa__indicator"
              style={{ top: "2.875rem" }}
            >
              <span>{s.badge1}</span>
              <span>{s.badge2}</span>
            </div>
          </a>
        ))}
      </div>

      <div className="Services-module__uj7JVa__clients">
        <p className="Services-module__uj7JVa__clientsHeader">
          Who I build for
        </p>
        <p className="Services-module__uj7JVa__clientsDesc">
          From corporate giants to pre-seed founders, I’ve built for both, and
          I’ll get you there too.
        </p>
        <p className="Services-module__uj7JVa__clientsSub">
          A decade of shipping innovative, tailored work.
        </p>
      </div>
    </section>
  );
}
