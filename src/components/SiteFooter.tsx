import { useTranslations } from "next-intl"

import { Link } from "@/i18n/navigation"
import { AdSlot } from "@/components/AdSlot"

export function SiteFooter() {
  const tNav = useTranslations("nav")

  return (
    <footer className="border-t border-blue-900/10 bg-blue-900 text-white">
      <div className="mx-auto max-w-[1300px] px-6 py-12 lg:px-8">
        <div className="mb-12">
          <AdSlot variant="footer" slot="footer" minHeight={120} className="bg-white/5 text-white" />
        </div>

        <div className="grid gap-10 md:grid-cols-[1fr_1fr_1fr]">
          <div className="space-y-3">
            <div className="text-base font-semibold tracking-tight">DV Photo Fix</div>
            <p className="max-w-sm text-[15px] leading-7 text-blue-50/90">Privacy-first DV photo utility.</p>
          </div>

          <div className="space-y-3">
            <div className="text-[13px] font-semibold uppercase tracking-wider text-blue-100/90">Pages</div>
            <div className="grid gap-2 text-[15px]">
              <Link href="/about" className="text-white/90 hover:text-white">
                {tNav("about")}
              </Link>
              <Link href="/privacy" className="text-white/90 hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-white/90 hover:text-white">
                Terms
              </Link>
              <Link href="/disclaimer" className="text-white/90 hover:text-white">
                Disclaimer
              </Link>
              <Link href="/contact" className="text-white/90 hover:text-white">
                {tNav("contact")}
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-[13px] font-semibold uppercase tracking-wider text-blue-100/90">Resources</div>
            <div className="grid gap-2 text-[15px]">
              <Link href="/updates" className="text-white/90 hover:text-white">
                {tNav("updates")}
              </Link>
              <Link href="/faq" className="text-white/90 hover:text-white">
                {tNav("faq")}
              </Link>
              <Link href="/editorial" className="text-white/90 hover:text-white">
                Editorial & Sources
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
