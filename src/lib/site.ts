export const SITE = {
  domain: "dvphotofix.com",
  name: "DV Photo Fix",
  lastReviewedISO: "2026-04-14",
}

export const LOCALES = ["en", "ar", "es", "fr", "ru", "tr", "fa", "pt"] as const
export type Locale = (typeof LOCALES)[number]

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

export const RTL_LOCALES: Locale[] = ["ar", "fa"]

export const DV_SOURCES = {
  programHome: "https://dvprogram.state.gov/",
  travelDv: "https://travel.state.gov/content/travel/en/us-visas/immigrate/diversity-visa-program-entry.html",
}

