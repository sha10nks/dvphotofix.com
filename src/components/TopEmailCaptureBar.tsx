"use client"

import * as React from "react"
import { X } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"

import { recordEmailConsent } from "@/lib/gate/emailGate"
import { useEmailGateState } from "@/lib/gate/useEmailGateState"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const DISMISS_KEY = "dvpf:topbar:dismissed:v1"

const schema = z.object({
  email: z.string().email(),
})

type FormValues = z.infer<typeof schema>

export function TopEmailCaptureBar({ locale }: { locale: string }) {
  const t = useTranslations("email")
  const gate = useEmailGateState()
  const [dismissed, setDismissed] = React.useState(false)
  const [status, setStatus] = React.useState<"idle" | "loading" | "error">("idle")

  React.useEffect(() => {
    try {
      setDismissed(window.localStorage.getItem(DISMISS_KEY) === "1")
    } catch {
      setDismissed(false)
    }
  }, [])

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
    mode: "onSubmit",
  })

  if (gate.consented || dismissed) return null

  async function onSubmit(values: FormValues) {
    setStatus("loading")
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: values.email, consent: true, locale, source: "topbar" }),
      })
      if (!res.ok) throw new Error("Request failed")
      recordEmailConsent()
      form.reset({ email: "" })
      setStatus("idle")
    } catch {
      setStatus("error")
    }
  }

  return (
    <div className="w-full border-b border-slate-200 bg-blue-50">
      <div className="mx-auto flex max-w-[1300px] flex-col gap-3 px-6 py-3 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-start justify-between gap-4">
          <div className="text-[15px] font-medium leading-6 text-slate-900">{t("title")}</div>
          <button
            type="button"
            className="rounded-md p-1 text-slate-600 hover:bg-white/60 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            aria-label="Dismiss"
            onClick={() => {
              try {
                window.localStorage.setItem(DISMISS_KEY, "1")
              } catch {
              }
              setDismissed(true)
            }}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center">
          <div className="w-full lg:w-[360px]">
            <Input inputMode="email" placeholder="name@example.com" {...form.register("email")} />
            {form.formState.errors.email ? (
              <div className="mt-1 text-[13px] text-red-700">Invalid email</div>
            ) : null}
          </div>
          <Button type="submit" disabled={status === "loading"}>
            {t("submit")}
          </Button>
          {status === "error" ? <div className="text-[13px] text-red-700">{t("error")}</div> : null}
        </form>
      </div>
    </div>
  )
}
