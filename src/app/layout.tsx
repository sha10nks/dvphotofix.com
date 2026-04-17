import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Script from "next/script"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const GA_ID = "G-K57ZYYHBTS"

export const metadata: Metadata = {
  metadataBase: new URL("https://dvphotofix.netlify.app"),
  verification: {
    google: "utgZdG4Ae0y6EJkTxB1n-t6_yIcp5SrjBsBj6k-E7VQ",
  },
  title: {
    default: "DV Photo Fix",
    template: "%s | DV Photo Fix",
  },
  description: "DV Lottery photo tool: crop, center, resize to 600x600 correctly.",
  openGraph: {
    type: "website",
    siteName: "DV Photo Fix",
    title: "DV Photo Fix",
    description: "DV Lottery photo tool: crop, center, resize to 600x600 correctly.",
  },
  twitter: {
    card: "summary_large_image",
    title: "DV Photo Fix",
    description: "DV Lottery photo tool: crop, center, resize to 600x600 correctly.",
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
      <body className="min-h-full bg-white text-slate-900">
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="ga-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\n\ngtag('config', '${GA_ID}');`}
        </Script>
        {children}
      </body>
    </html>
  )
}
