"use client"

import * as React from "react"
import { useTranslations } from "next-intl"

import { recordEmailConsent } from "@/lib/gate/emailGate"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function EmailGateModal({
  open,
  onOpenChange,
  locale,
  onConsented,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  locale: string
  onConsented: () => void
}) {
  const t = useTranslations("gate")
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
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, consent: true, locale, source: "gate" }),
      })
      if (!res.ok) throw new Error("Request failed")
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        <form ref={formRef} className="mt-4 space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="gate-email">{t("emailLabel")}</Label>
            <Input
              id="gate-email"
              inputMode="email"
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 border-slate-300"
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            {t("privacyNote")}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("notNow")}
            </Button>
            <Button type="submit" disabled={status === "loading"}>
              {t("submit")}
            </Button>
          </DialogFooter>

          {status === "error" ? <p className="text-sm text-red-700">{t("error")}</p> : null}
        </form>
      </DialogContent>
    </Dialog>
  )
}
