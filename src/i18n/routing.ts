import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  locales: ["en", "ar", "es", "fr", "ru", "tr", "fa", "pt"],
  defaultLocale: "en",
})

export type AppLocale = (typeof routing.locales)[number]

