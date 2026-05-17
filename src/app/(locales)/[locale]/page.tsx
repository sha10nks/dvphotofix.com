import { redirect } from "next/navigation"

import { DEFAULT_LOCALE, isLocale } from "@/i18n/config"

export default async function LocaleIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE
  redirect(`/${locale}/tool/`)
}

