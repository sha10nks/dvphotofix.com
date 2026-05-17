"use client"

import * as React from "react"

import { recordEmailConsent } from "@/lib/gate/emailGate"
import { useTranslations } from "@/i18n/I18nClientProvider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function EmailGateModal({
  open,
  onOpenChange,
  onConsented,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  onConsented: () => void
}) {
  const tTool = useTranslations("tool")
  const tCommon = useTranslations("common")
  const tErrors = useTranslations("errors")
  const [status, setStatus] = React.useState<"idle" | "loading" | "error">("idle")
  const [email, setEmail] = React.useState("")
  const formRef = React.useRef<HTMLFormElement | null>(null)

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
      setStatus("idle")
      setEmail("")
      onOpenChange(false)
      onConsented()
    } catch {
      setStatus("error")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent closeLabel={tCommon("actions.close")}>
        <DialogHeader>
          <DialogTitle>{tTool("gate.title")}</DialogTitle>
          <DialogDescription>{tTool("gate.description")}</DialogDescription>
        </DialogHeader>

        <form ref={formRef} className="mt-4 space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="gate-email">{tTool("email.emailLabel")}</Label>
            <Input
              id="gate-email"
              inputMode="email"
              type="email"
              required
              placeholder={tTool("email.placeholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 border-slate-300"
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            {tTool("gate.notice")}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {tCommon("actions.notNow")}
            </Button>
            <Button type="submit" disabled={status === "loading"}>
              {tCommon("actions.continue")}
            </Button>
          </DialogFooter>

          {status === "error" ? <p className="text-sm text-red-700">{tErrors("generic.tryAgain")}</p> : null}
        </form>
      </DialogContent>
    </Dialog>
  )
}
