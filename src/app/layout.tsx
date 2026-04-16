import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dvphotofix.com"),
  verification: {
    google: "utgZdG4Ae0y6EJkTxB1n-t6_yIcp5SrjBsBj6k-E7VQ",
  },
  title: {
    default: "DV Photo Fix — Browser DV Lottery Photo Tool",
    template: "%s | DV Photo Fix",
  },
  description:
    "A fast, browser-side DV Lottery photo checker and safe fixer. Not affiliated with the U.S. government.",
  openGraph: {
    type: "website",
    siteName: "DV Photo Fix",
    title: "DV Photo Fix — Browser DV Lottery Photo Tool",
    description:
      "Check issues, apply safe fixes, and export a DV-ready JPEG in your browser. Not affiliated with the U.S. government.",
  },
  twitter: {
    card: "summary_large_image",
    title: "DV Photo Fix — Browser DV Lottery Photo Tool",
    description:
      "Check issues, apply safe fixes, and export a DV-ready JPEG in your browser. Not affiliated with the U.S. government.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-white text-slate-900">{children}</body>
    </html>
  )
}
