"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

import { DEFAULT_LOCALE, LOCALE_LABELS, LOCALES, type Locale } from "@/i18n/config"
import { useTranslations } from "@/i18n/I18nClientProvider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const STORAGE_KEY = "dvpf:locale"
const COOKIE_KEY = "dvpf_locale"

function normalizeLocale(raw: string | null): Locale {
  if (!raw) return DEFAULT_LOCALE
  return (LOCALES as readonly string[]).includes(raw) ? (raw as Locale) : DEFAULT_LOCALE
}

function writeCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=31536000; samesite=lax`
}

function getCurrentLocale(pathname: string): Locale {
  const seg = pathname.split("/").filter(Boolean)[0] ?? ""
  return normalizeLocale(seg)
}

function replaceLocaleInPath(pathname: string, locale: Locale) {
  const parts = pathname.split("/").filter(Boolean)
  if (!parts.length) return `/${locale}/`
  parts[0] = locale
  return `/${parts.join("/")}${pathname.endsWith("/") ? "/" : "/"}`
}

export function LanguageSwitcher() {
  const tCommon = useTranslations("common")
  const router = useRouter()
  const pathname = usePathname() ?? "/"
  const search = useSearchParams()
  const current = getCurrentLocale(pathname)

  const query = search?.toString()

  return (
    <Select
      value={current}
      onValueChange={(v) => {
        const nextLocale = normalizeLocale(v)
        try {
          window.localStorage.setItem(STORAGE_KEY, nextLocale)
        } catch {
        }
        writeCookie(COOKIE_KEY, nextLocale)
        const nextPath = replaceLocaleInPath(pathname, nextLocale)
        router.push(query ? `${nextPath}?${query}` : nextPath)
      }}
    >
      <SelectTrigger aria-label={tCommon("language.ariaLabel")} className="h-9 w-[150px] rounded-[14px] border border-white/15 bg-white/10 px-3 text-[13px] text-white shadow-none focus-visible:ring-white/60">
        <SelectValue placeholder={tCommon("language.label")} />
      </SelectTrigger>
      <SelectContent className="border border-[#D7E0EA] bg-white text-[#0F172A]">
        {LOCALES.map((l) => (
          <SelectItem key={l} value={l}>
            {LOCALE_LABELS[l]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

