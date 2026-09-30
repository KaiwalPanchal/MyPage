"use client";

import React from "react";

const PARTNERS = [
  {
    name: "Acronis",
    src: "/MyPage/assets/partners/acronis.svg",
    w: "6.0802rem",
    h: "1.2974rem",
    classes: "Partners-module__R2wEiG__bt Partners-module__R2wEiG__bb Partners-module__R2wEiG__br",
  },
  {
    name: "Constructor",
    src: "/MyPage/assets/partners/constructor.svg",
    w: "9.756rem",
    h: "0.8795rem",
    classes: "Partners-module__R2wEiG__bt Partners-module__R2wEiG__bb Partners-module__R2wEiG__br",
  },
  {
    name: "Ringier",
    src: "/MyPage/assets/partners/ringier.svg",
    w: "8.5691rem",
    h: "1.6423rem",
    classes: "Partners-module__R2wEiG__bt Partners-module__R2wEiG__bb Partners-module__R2wEiG__br",
  },
  {
    name: "Macmillan Cancer Support",
    src: "/MyPage/assets/partners/macmillan.svg",
    w: "9.2425rem",
    h: "1.9789rem",
    classes: "Partners-module__R2wEiG__bt Partners-module__R2wEiG__bb Partners-module__R2wEiG__br",
  },
  {
    name: "Endava",
    src: "/MyPage/assets/partners/endava.svg",
    w: "8.7581rem",
    h: "2.9317rem",
    classes: "Partners-module__R2wEiG__bt Partners-module__R2wEiG__bb",
  },
  {
    name: "Simplebet",
    src: "/MyPage/assets/partners/simplebet.svg",
    w: "9.5359rem",
    h: "2.0226rem",
    classes: "Partners-module__R2wEiG__bb Partners-module__R2wEiG__br",
  },
  {
    name: "Jeton",
    src: "/MyPage/assets/partners/jeton.svg",
    w: "7.0419rem",
    h: "2.0521rem",
    classes: "Partners-module__R2wEiG__bb Partners-module__R2wEiG__br",
  },
  {
    name: "Lottoland",
    src: "/MyPage/assets/partners/lottoland.svg",
    w: "7.7719rem",
    h: "2.4259rem",
    classes: "Partners-module__R2wEiG__bb Partners-module__R2wEiG__br",
  },
  {
    name: "Dojo",
    src: "/MyPage/assets/partners/dojo.svg",
    w: "5.9808rem",
    h: "2.6239rem",
    classes: "Partners-module__R2wEiG__bb Partners-module__R2wEiG__br",
  },
  {
    name: "TELUS",
    src: "/MyPage/assets/partners/telus.svg",
    w: "9.8293rem",
    h: "1.825rem",
    classes: "Partners-module__R2wEiG__bb",
  },
  {
    name: "Claim Compass",
    src: "/MyPage/assets/partners/claimcompass.svg",
    w: "9.6463rem",
    h: "3.2989rem",
    classes: "Partners-module__R2wEiG__bb Partners-module__R2wEiG__br",
  },
  {
    name: "Brand Quadergy",
    src: "/MyPage/assets/partners/brandquadergy.svg",
    w: "9.2691rem",
    h: "2.5109rem",
    classes: "Partners-module__R2wEiG__bb Partners-module__R2wEiG__br",
  },
  {
    name: "polygon.io",
    src: "/MyPage/assets/partners/polygon.svg",
    w: "8.9937rem",
    h: "1.759rem",
    classes: "Partners-module__R2wEiG__bb Partners-module__R2wEiG__br",
  },
  {
    name: "Efes Club",
    src: "/MyPage/assets/partners/efes.svg",
    w: "2.7496rem",
    h: "5.5217rem",
    classes: "Partners-module__R2wEiG__bb Partners-module__R2wEiG__br",
  },
  {
    name: "jobpal",
    src: "/MyPage/assets/partners/jobpal.svg",
    w: "6.7484rem",
    h: "2.419rem",
    classes: "Partners-module__R2wEiG__bb",
  },
  {
    name: "Partner",
    src: "/MyPage/assets/partners/blogo.svg",
    w: "3.5654rem",
    h: "4.2776rem",
    classes: "Partners-module__R2wEiG__br",
  },
  {
    name: "Unilever",
    src: "/MyPage/assets/partners/unilever.svg",
    w: "4.8875rem",
    h: "5.5217rem",
    classes: "Partners-module__R2wEiG__br",
  },
];

export default function PartnersSection() {
  return (
    <section className="Partners-module__R2wEiG__partners">
      <div className="Partners-module__R2wEiG__inner">
        <p className="Partners-module__R2wEiG__title">
          Valuable
          <br />
          <em>Partners</em>
        </p>
        <p className="Partners-module__R2wEiG__desc">
          Trusted by teams from pre-seed start-ups to the Fortune 500.
        </p>
        <div className="Partners-module__R2wEiG__grid">
          {PARTNERS.map((p, idx) => (
            <div
              key={idx}
              className={`Partners-module__R2wEiG__cell ${p.classes}`}
            >
              <img
                className="Partners-module__R2wEiG__logo"
                src={p.src}
                alt={p.name}
                style={{ width: p.w, height: p.h }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
