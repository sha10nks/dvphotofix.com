import { Cairo, Inter, Vazirmatn } from "next/font/google"
import Script from "next/script"

import "@/app/globals.css"

const inter = Inter({
  variable: "--font-sans-latin",
  subsets: ["latin"],
  display: "swap",
})

const cairo = Cairo({
  variable: "--font-sans-arabic",
  subsets: ["arabic", "latin"],
  display: "swap",
})

const vazirmatn = Vazirmatn({
  variable: "--font-sans-persian",
  subsets: ["arabic", "latin"],
  display: "swap",
})

const GA_ID = "G-K57ZYYHBTS"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fontVars = `${inter.variable} ${cairo.variable} ${vazirmatn.variable}`
  return (
    <html lang="en" dir="ltr" className={`${fontVars} h-full antialiased`}>
      <body className="min-h-full bg-transparent text-inherit">
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="ga-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\n\ngtag('config', '${GA_ID}');`}
        </Script>
        {children}
      </body>
    </html>
  )
}

