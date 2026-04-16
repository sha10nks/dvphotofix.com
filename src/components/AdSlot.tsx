"use client"

import * as React from "react"
import { useTranslations } from "next-intl"

import { cn } from "@/lib/utils"

export type AdSlotProps = {
  variant: "top" | "inline" | "footer" | "sidebar"
  slot: string
  className?: string
  minHeight?: number
}

const DEFAULT_MIN_HEIGHT: Record<AdSlotProps["variant"], number> = {
  top: 90,
  inline: 280,
  footer: 120,
  sidebar: 600,
}

export function AdSlot({ variant, slot, className, minHeight }: AdSlotProps) {
  const tAds = useTranslations("ads")
  const [mounted, setMounted] = React.useState(false)
  const ref = React.useRef<HTMLElement | null>(null)

  const resolvedMinHeight = minHeight ?? DEFAULT_MIN_HEIGHT[variant]

  React.useEffect(() => {
    const el = ref.current
    if (!el) return

    let cancelled = false
    const schedule = () => {
      const run = () => {
        if (cancelled) return
        setMounted(true)
      }

      const ric = (window as unknown as { requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number }).requestIdleCallback
      if (ric) ric(run, { timeout: 1200 })
      else window.setTimeout(run, 200)
    }

    if (typeof IntersectionObserver === "undefined") {
      schedule()
      return () => {
        cancelled = true
      }
    }

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          schedule()
          obs.disconnect()
        }
      },
      { rootMargin: "240px" },
    )
    obs.observe(el)
    return () => {
      cancelled = true
      obs.disconnect()
    }
  }, [])

  return (
    <section
      ref={ref}
      aria-label={tAds("label")}
      data-slot="ad-slot"
      className={cn(
        "rounded-[12px] border border-slate-200 bg-slate-100 text-slate-900",
        variant === "sidebar" ? "px-4 py-4" : "px-5 py-5",
        className
      )}
      style={{ minHeight: resolvedMinHeight }}
    >
      <div className="flex items-center justify-between">
        <div className="text-[12px] font-medium tracking-wide text-slate-700">{tAds("label")}</div>
        <div className="text-[12px] text-slate-700">{mounted ? slot : tAds("loading")}</div>
      </div>
      <div className="mt-3 flex items-center justify-center rounded-[10px] border border-slate-200 bg-white" style={{ minHeight: Math.max(0, resolvedMinHeight - 48) }}>
        <div className="text-center text-[13px] text-slate-500">{mounted ? "Reserved ad space" : ""}</div>
      </div>
    </section>
  )
}
