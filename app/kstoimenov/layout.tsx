import type { Metadata } from "next";
import "./kstoimenov.css";

export const metadata: Metadata = {
  title: "From Wireframes to Wow’s · UX Portfolio",
  description:
    "Elevating UX to the remarkable. Product design, digital strategy, web design, brand identity and service design.",
};

export default function KStoimenovLayout({
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
