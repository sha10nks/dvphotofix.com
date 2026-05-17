import type { Locale } from "@/i18n/config"

export function withLocale(locale: Locale, path: string) {
  const p = path.startsWith("/") ? path : `/${path}`
  return `/${locale}${p}`.replaceAll("//", "/")
}
