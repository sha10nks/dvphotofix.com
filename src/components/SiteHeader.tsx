"use client"

import { Camera, ShieldCheck } from "lucide-react"
import Link from "next/link"

import { useLocale, useTranslations } from "@/i18n/I18nClientProvider"
import { withLocale } from "@/i18n/paths"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { Button } from "@/components/ui/button"

export function SiteHeader() {
  const locale = useLocale()
  const tCommon = useTranslations("common")

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#1E3A8A] text-white">
      <div className="mx-auto flex max-w-[1300px] items-center gap-4 px-6 py-3 lg:px-8">
        <Link href={withLocale(locale, "/tool/")} className="flex items-center gap-2 font-semibold tracking-tight">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-white/10">
            <Camera className="h-4 w-4" />
          </div>
          <span>{tCommon("nav.brand")}</span>
        </Link>

        <nav className="hidden items-center gap-4 md:flex">
          <Link href={withLocale(locale, "/tool/")} className="text-sm text-white/90 hover:text-[#BFDBFE]">
            {tCommon("nav.tool")}
          </Link>
          <Link href={withLocale(locale, "/photo-requirements/")} className="text-sm text-white/90 hover:text-[#BFDBFE]">
            {tCommon("nav.requirements")}
          </Link>
          <Link href={withLocale(locale, "/faq/")} className="text-sm text-white/90 hover:text-[#BFDBFE]">
            {tCommon("nav.faq")}
          </Link>
          <Link href={withLocale(locale, "/updates/")} className="text-sm text-white/90 hover:text-[#BFDBFE]">
            {tCommon("nav.updates")}
          </Link>
          <Link href={withLocale(locale, "/blog/")} className="text-sm text-white/90 hover:text-[#BFDBFE]">
            {tCommon("nav.blog")}
          </Link>
        </nav>

        <div className="ml-auto hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          <Button asChild variant="secondary" size="sm">
            <Link href={withLocale(locale, "/tool/")} className="gap-2">
              <ShieldCheck className="h-4 w-4" />
              {tCommon("nav.tool")}
            </Link>
          </Button>
        </div>

        <div className="ml-auto flex items-center gap-2 md:hidden">
          <LanguageSwitcher />
          <Button asChild variant="secondary" size="icon" aria-label={tCommon("nav.tool")}>
            <Link href={withLocale(locale, "/tool/")}>
              <ShieldCheck className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
