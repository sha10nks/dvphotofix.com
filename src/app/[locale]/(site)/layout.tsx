import { SiteFooter } from "@/components/SiteFooter"
import { SiteHeader } from "@/components/SiteHeader"
import { TopEmailCaptureBar } from "@/components/TopEmailCaptureBar"
import { TrustBanner } from "@/components/TrustBanner"

import { routing, type AppLocale } from "@/i18n/routing"

export default async function SiteLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale: rawLocale } = await params
  const locale = (routing.locales.includes(rawLocale as never) ? rawLocale : routing.defaultLocale) as AppLocale
  return (
    <div className="min-h-dvh">
      <TrustBanner />
      <SiteHeader />
      <TopEmailCaptureBar locale={locale} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
