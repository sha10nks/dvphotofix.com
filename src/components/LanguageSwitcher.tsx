"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import { useLocale } from "next-intl"

import { LOCALE_LABELS, LOCALES, type Locale } from "@/lib/site"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function replaceLeadingLocale(pathname: string, nextLocale: Locale) {
  const parts = pathname.split("/")
  if (parts.length >= 2 && (LOCALES as readonly string[]).includes(parts[1])) {
    parts[1] = nextLocale
    return parts.join("/") || "/"
  }
  return `/${nextLocale}${pathname.startsWith("/") ? pathname : `/${pathname}`}`
}

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const locale = useLocale() as Locale

  return (
    <div className="w-[180px]">
      <Select
        value={locale}
        onValueChange={(value) => {
          const nextLocale = value as Locale
          const nextPath = replaceLeadingLocale(pathname, nextLocale)
          router.replace(nextPath as never)
        }}
      >
        <SelectTrigger aria-label="Language">
          <SelectValue placeholder="Language" />
        </SelectTrigger>
        <SelectContent>
          {(LOCALES as readonly Locale[]).map((l) => (
            <SelectItem key={l} value={l}>
              {LOCALE_LABELS[l]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
