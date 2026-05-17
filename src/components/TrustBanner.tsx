"use client"

import * as React from "react"
import { Info } from "lucide-react"

import { useTranslations } from "@/i18n/I18nClientProvider"
import { cn } from "@/lib/utils"

export function TrustBanner({ className }: { className?: string }) {
  const tCommon = useTranslations("common")
  const [hidden, setHidden] = React.useState(false)

  if (hidden) return null

  return (
    <div className={cn("w-full bg-blue-950 text-white", className)}>
      <div className="mx-auto flex max-w-6xl items-start gap-3 px-4 py-3">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-200" />
        <p className="text-sm leading-5 text-blue-50">{tCommon("trust.message")}</p>
        <button
          type="button"
          className="ml-auto rounded-md px-2 py-1 text-xs text-blue-100 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          onClick={() => setHidden(true)}
        >
          {tCommon("trust.close")}
        </button>
      </div>
    </div>
  )
}
