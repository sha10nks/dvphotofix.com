import { DEFAULT_LOCALE, type Locale } from "@/i18n/config"

import type { Messages } from "@/i18n/translator"

const cache = new Map<string, Messages>()

async function importJson(locale: Locale, namespace: string): Promise<Messages> {
  const key = `${locale}:${namespace}`
  const hit = cache.get(key)
  if (hit) return hit

  const mod = (await import(`../../locales/${locale}/${namespace}.json`)) as { default: Messages }
  cache.set(key, mod.default)
  return mod.default
}

export async function loadNamespaces(locale: Locale, namespaces: string[]) {
  const out: Record<string, Messages> = {}
  await Promise.all(
    namespaces.map(async (ns) => {
      try {
        out[ns] = await importJson(locale, ns)
      } catch {
        out[ns] = await importJson(DEFAULT_LOCALE, ns)
      }
    }),
  )
  return out
}
