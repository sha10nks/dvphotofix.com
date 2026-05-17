"use client"

import Link from "next/link"

import { useLocale, useTranslations } from "@/i18n/I18nClientProvider"
import { withLocale } from "@/i18n/paths"
import { AdSlot } from "@/components/AdSlot"

export function SiteFooter() {
  const locale = useLocale()
  const tCommon = useTranslations("common")

  return (
    <footer className="border-t border-blue-900/10 bg-blue-900 text-white">
      <div className="mx-auto max-w-[1300px] px-6 py-12 lg:px-8">
        <div className="mb-12">
          <AdSlot variant="footer" slot="footer" minHeight={120} className="bg-white/5 text-white" />
        </div>

        <div className="grid gap-10 md:grid-cols-[1fr_1fr_1fr]">
          <div className="space-y-3">
            <div className="text-base font-semibold tracking-tight">{tCommon("nav.brand")}</div>
            <p className="max-w-sm text-[15px] leading-7 text-blue-50/90">{tCommon("footer.tagline")}</p>
          </div>

          <div className="space-y-3">
            <div className="text-[13px] font-semibold uppercase tracking-wider text-blue-100/90">{tCommon("footer.pages")}</div>
            <div className="grid gap-2 text-[15px]">
              <Link href={withLocale(locale, "/about/")} className="text-white/90 hover:text-white">
                {tCommon("footer.about")}
              </Link>
              <Link href={withLocale(locale, "/privacy/")} className="text-white/90 hover:text-white">
                {tCommon("footer.privacy")}
              </Link>
              <Link href={withLocale(locale, "/terms/")} className="text-white/90 hover:text-white">
                {tCommon("footer.terms")}
              </Link>
              <Link href={withLocale(locale, "/disclaimer/")} className="text-white/90 hover:text-white">
                {tCommon("footer.disclaimer")}
              </Link>
              <Link href={withLocale(locale, "/contact/")} className="text-white/90 hover:text-white">
                {tCommon("footer.contact")}
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <div className="text-[13px] font-semibold uppercase tracking-wider text-blue-100/90">{tCommon("footer.resources")}</div>
            <div className="grid gap-2 text-[15px]">
              <Link href={withLocale(locale, "/updates/")} className="text-white/90 hover:text-white">
                {tCommon("nav.updates")}
              </Link>
              <Link href={withLocale(locale, "/faq/")} className="text-white/90 hover:text-white">
                {tCommon("nav.faq")}
              </Link>
              <Link href={withLocale(locale, "/editorial/")} className="text-white/90 hover:text-white">
                {tCommon("footer.editorial")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
