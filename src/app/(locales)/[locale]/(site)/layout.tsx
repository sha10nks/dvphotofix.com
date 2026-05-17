import { SiteFooter } from "@/components/SiteFooter"
import { SiteHeader } from "@/components/SiteHeader"
import { TopEmailCaptureBar } from "@/components/TopEmailCaptureBar"
import { TrustBanner } from "@/components/TrustBanner"

export const dynamic = "force-static"
export const revalidate = false

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh">
      <TrustBanner />
      <SiteHeader />
      <TopEmailCaptureBar />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}

