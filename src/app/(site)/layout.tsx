import { SiteFooter } from "@/components/SiteFooter"
import { SiteHeader } from "@/components/SiteHeader"
import { TopEmailCaptureBar } from "@/components/TopEmailCaptureBar"
import { TrustBanner } from "@/components/TrustBanner"
import { I18nClientProvider } from "@/i18n/I18nClientProvider"
import { DEFAULT_LOCALE } from "@/i18n/config"
import { loadNamespaces } from "@/i18n/loadMessages"

export const dynamic = "force-static"
export const revalidate = false

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const messages = await loadNamespaces(DEFAULT_LOCALE, ["common", "errors", "tool", "blog", "faq", "metadata"])
  return (
    <I18nClientProvider locale={DEFAULT_LOCALE} messages={messages}>
      <div className="min-h-dvh">
        <TrustBanner />
        <SiteHeader />
        <TopEmailCaptureBar />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </I18nClientProvider>
  )
}
