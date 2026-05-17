import type { Metadata } from "next"
import { Cairo, Inter, Vazirmatn } from "next/font/google"
import Script from "next/script"

import "@/app/globals.css"

import { DEFAULT_LOCALE, getDir, isLocale, type Locale } from "@/i18n/config"
import { loadNamespaces } from "@/i18n/loadMessages"
import { createTranslator } from "@/i18n/translator"
import { I18nClientProvider } from "@/i18n/I18nClientProvider"

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

export function generateStaticParams() {
  return ["en", "ar", "es", "fr", "ru", "tr", "fa", "pt"].map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: rawLocale } = await params
  const locale = (isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE) as Locale
  const messages = await loadNamespaces(locale, ["metadata"])
  const { tn } = createTranslator(messages)
  const tMeta = tn("metadata")
  return {
    metadataBase: new URL("https://dvphotofix.netlify.app"),
    title: {
      default: tMeta("site.defaultTitle"),
      template: `%s | ${tMeta("site.name")}`,
    },
    description: tMeta("site.defaultDescription"),
  }
}

export const dynamic = "force-static"
export const revalidate = false

export default async function LocaleRootLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale: rawLocale } = await params
  const locale = (isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE) as Locale
  const dir = getDir(locale)

  const messages = await loadNamespaces(locale, ["common", "errors"])

  const fontVars = `${inter.variable} ${cairo.variable} ${vazirmatn.variable}`

  return (
    <html lang={locale} dir={dir} className={`${fontVars} h-full antialiased`}>
      <body className="min-h-full bg-transparent text-inherit">
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
        <Script id="ga-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];\nfunction gtag(){dataLayer.push(arguments);}\ngtag('js', new Date());\n\ngtag('config', '${GA_ID}');`}
        </Script>
        <I18nClientProvider locale={locale} messages={messages}>
          {children}
        </I18nClientProvider>
      </body>
    </html>
  )
}

