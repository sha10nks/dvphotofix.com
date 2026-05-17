export const LOCALES = ["en", "ar", "es", "fr", "ru", "tr", "fa", "pt"] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = "en"
export const RTL_LOCALES: Locale[] = ["ar", "fa"]

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
  es: "Español",
  fr: "Français",
  ru: "Русский",
  tr: "Türkçe",
  fa: "فارسی",
  pt: "Português",
}

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value)
}

export function getDir(locale: Locale) {
  return RTL_LOCALES.includes(locale) ? "rtl" : "ltr"
}
