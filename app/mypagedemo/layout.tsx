import type { Metadata } from "next";
import "./mypagedemo.css";

export const metadata: Metadata = {
  title: "Kaiwal Panchal — Applied AI Engineer (Demo)",
  description:
    "Applied AI Engineer & Lead Engineer at Sylvr. Building production LLM systems, deterministic grounding guardrails, and cost-aware multi-agent architectures.",
};

export default function MyPageDemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
