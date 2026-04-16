import { redirect } from "@/i18n/navigation"
import { routing, type AppLocale } from "@/i18n/routing"

export default async function LocaleHomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale = (routing.locales.includes(rawLocale as never) ? rawLocale : routing.defaultLocale) as AppLocale
  redirect({ href: "/tool", locale })
}
