"use client"

import * as React from "react"

import { DEFAULT_LOCALE, LOCALES, type Locale } from "@/i18n/config"

const STORAGE_KEY = "dvpf:locale"
const COOKIE_KEY = "dvpf_locale"

function readCookie(name: string) {
  if (typeof document === "undefined") return null
  const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`))
  return m ? decodeURIComponent(m[1]) : null
}

function writeCookie(name: string, value: string) {
  if (typeof document === "undefined") return
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=31536000; samesite=lax`
}

function normalizeLocale(raw: string | null): Locale {
  if (!raw) return DEFAULT_LOCALE
  return (LOCALES as readonly string[]).includes(raw) ? (raw as Locale) : DEFAULT_LOCALE
}

export function LocaleAutoRedirect() {
  React.useEffect(() => {
    const stored = (() => {
      try {
        return window.localStorage.getItem(STORAGE_KEY)
      } catch {
        return null
      }
    })()
    const cookie = readCookie(COOKIE_KEY)
    const locale = normalizeLocale(stored ?? cookie)
    try {
      window.localStorage.setItem(STORAGE_KEY, locale)
    } catch {
    }
    writeCookie(COOKIE_KEY, locale)
    window.location.replace(`/${locale}/tool/`)
  }, [])

  return null
}

