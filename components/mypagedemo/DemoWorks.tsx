"use client";

import React from "react";
import { portfolioData } from "@/data/portfolio";

export default function DemoWorks() {
  const works = portfolioData.work;

  return (
    <section className="DemoWorks-section" id="works">
      <div className="DemoWorks-inner">
        <div className="DemoWorks-header">
          <div>
            <h2 className="DemoWorks-title">Production Systems</h2>
            <p className="DemoWorks-sub">
              Engineering architectures deployed into high-throughput environments
            </p>
          </div>
          <span className="DemoHero-status" style={{ alignSelf: "flex-start" }}>
            3 Active Deployments
          </span>
        </div>

        <div className="DemoWorks-grid">
          {works.map((job, idx) => (
            <a
              key={idx}
              href={job.website}
              target="_blank"
              rel="noopener noreferrer"
              className="DemoWorks-card"
              data-cursor-label="VISIT"
            >
              <div className="DemoWorks-cardTop">
                <span className="DemoWorks-cardYear">{job.year}</span>
                <div>
                  <h3 className="DemoWorks-cardRole">{job.role}</h3>
                  <div className="DemoWorks-cardCompany">@ {job.company}</div>
                </div>
                <p className="DemoWorks-cardDesc">{job.description}</p>
              </div>

              <div className="DemoWorks-cardTech">
                {job.tech.map((t) => (
                  <span key={t} className="DemoWorks-techBadge">
                    {t}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
