import type { Metadata } from "next";
import "../kstoimenov/kstoimenov.css";

export const metadata: Metadata = {
  title: "Archive: Kire Stoimenov Reference Clone · UX Portfolio",
  description:
    "Archived interactive clone of kstoimenov.com preserved for WebGL shader, editorial typography, and micro-interaction study.",
};

export default function ArchiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="kstoimenov-wrapper lausanne_ab5f6f82-module__LmRndG__variable manier_e4673499-module__kwnfHq__variable">
      {children}
    </div>
  );
}
