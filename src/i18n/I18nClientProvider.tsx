"use client"

import * as React from "react"

import type { Locale } from "@/i18n/config"
import { createTranslator, type Messages } from "@/i18n/translator"

type I18nContextValue = {
  locale: Locale
  messages: Record<string, Messages>
}

const I18nContext = React.createContext<I18nContextValue | null>(null)

export function I18nClientProvider({
  locale,
  messages,
  children,
}: {
  locale: Locale
  messages: Record<string, Messages>
  children: React.ReactNode
}) {
  return <I18nContext.Provider value={{ locale, messages }}>{children}</I18nContext.Provider>
}

export function useLocale() {
  const ctx = React.useContext(I18nContext)
  if (!ctx) throw new Error("useLocale must be used within I18nClientProvider")
  return ctx.locale
}

export function useTranslations(namespace: string) {
  const ctx = React.useContext(I18nContext)
  if (!ctx) throw new Error("useTranslations must be used within I18nClientProvider")
  const { tn } = React.useMemo(() => createTranslator(ctx.messages), [ctx.messages])
  return tn(namespace)
}
