import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"

import { routing, type AppLocale } from "@/i18n/routing"

const rtlLocales: AppLocale[] = ["ar", "fa"]

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale: rawLocale } = await params
  const locale = (routing.locales.includes(rawLocale as never) ? rawLocale : routing.defaultLocale) as AppLocale
  const messages = await getMessages()
  const dir = rtlLocales.includes(locale) ? "rtl" : "ltr"

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <div lang={locale} dir={dir} className="min-h-dvh">
        {children}
      </div>
    </NextIntlClientProvider>
  )
}
