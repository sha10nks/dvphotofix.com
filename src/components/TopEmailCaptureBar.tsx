"use client"

import * as React from "react"
import { X } from "lucide-react"

import { useTranslations } from "@/i18n/I18nClientProvider"
import { recordEmailConsent } from "@/lib/gate/emailGate"
import { useEmailGateState } from "@/lib/gate/useEmailGateState"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const DISMISS_KEY = "dvpf:topbar:dismissed:v1"

export function TopEmailCaptureBar() {
  const tCommon = useTranslations("common")
  const tErrors = useTranslations("errors")
  const gate = useEmailGateState()
  const [dismissed, setDismissed] = React.useState(false)
  const [status, setStatus] = React.useState<"idle" | "loading" | "error">("idle")
  const [email, setEmail] = React.useState("")
  const formRef = React.useRef<HTMLFormElement | null>(null)

  React.useEffect(() => {
    try {
      setDismissed(window.localStorage.getItem(DISMISS_KEY) === "1")
    } catch {
      setDismissed(false)
    }
  }, [])

  if (gate.consented || dismissed) return null

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const el = formRef.current
    if (el && !el.checkValidity()) {
      el.reportValidity()
      return
    }

    setStatus("loading")
    try {
      recordEmailConsent()
      setEmail("")
      setStatus("idle")
    } catch {
      setStatus("error")
    }
  }

  return (
    <div className="w-full border-b border-slate-200 bg-blue-50">
      <div className="mx-auto flex max-w-[1300px] flex-col gap-3 px-6 py-3 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="flex items-start justify-between gap-4">
          <div className="text-[15px] font-medium leading-6 text-slate-900">{tCommon("topbar.title")}</div>
          <button
            type="button"
            className="rounded-md p-1 text-slate-600 hover:bg-white/60 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
            aria-label={tCommon("actions.dismiss")}
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

        <form ref={formRef} onSubmit={onSubmit} className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center">
          <div className="w-full lg:w-[360px]">
            <Input
              inputMode="email"
              type="email"
              required
              placeholder={tCommon("topbar.placeholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 border-slate-300"
            />
          </div>
          <Button type="submit" disabled={status === "loading"}>
            {tCommon("actions.subscribe")}
          </Button>
          {status === "error" ? <div className="text-[13px] text-red-700">{tErrors("generic.tryAgain")}</div> : null}
        </form>
      </div>
    </div>
  )
}
