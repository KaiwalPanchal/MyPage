import type React from "react"
import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import "./mypagedemo/mypagedemo.css"
import "lenis/dist/lenis.css"
import SmoothScroll from "@/components/SmoothScroll"

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
})

export const metadata: Metadata = {
  metadataBase: new URL('https://KaiwalPanchal.github.io/MyPage'),
  title: "Kaiwal Panchal — Forward Deployed & Applied AI Engineer",
  description: "Applied AI Engineer & Lead Engineer at Sylvr. Building production LLM systems, deterministic grounding guardrails, and cost-aware multi-agent architectures.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/MyPage/site.webmanifest",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} dark`}>
      <body className="font-sans antialiased">
        <SmoothScroll>
          {children}
        </SmoothScroll>
      </body>
    </html>
  )
}
