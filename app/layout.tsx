import type React from "react"
import type { Metadata } from "next"
import { Geist } from "next/font/google"
import "./globals.css"
import { Analytics } from "@vercel/analytics/next"

const geist = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist",
})

export const metadata: Metadata = {
  metadataBase: new URL('https://KaiwalPanchal.github.io/MyPage'),
  title: "Kaiwal Panchal - Machine Learning/AI engineer",
  description: "Machine Learning/AI engineer specialized in intelligent systems, CV, NLP, and scalable deployment.",
  generator: "v0.app",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} dark`}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
