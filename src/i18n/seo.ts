import { LOCALES, type Locale } from "@/i18n/config"

const BASE_URL = "https://dvphotofix.netlify.app"

function ensureTrailingSlash(path: string) {
  if (!path.startsWith("/")) path = `/${path}`
  return path.endsWith("/") ? path : `${path}/`
}

export function getCanonical(locale: Locale, path: string) {
  return `${BASE_URL}/${locale}${ensureTrailingSlash(path)}`.replaceAll("//", "/").replace("https:/", "https://")
}

export function getHreflang(localePath: string) {
  const p = ensureTrailingSlash(localePath)
  const languages: Record<string, string> = {}
  for (const l of LOCALES) {
    languages[l] = `${BASE_URL}/${l}${p}`.replaceAll("//", "/").replace("https:/", "https://")
  }
  languages["x-default"] = `${BASE_URL}/en${p}`.replaceAll("//", "/").replace("https:/", "https://")
  return languages
}

