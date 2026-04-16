"use client"

import * as React from "react"
import { useTranslations } from "next-intl"

import { recordEmailConsent } from "@/lib/gate/emailGate"
import { useEmailGateState } from "@/lib/gate/useEmailGateState"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function EmailCaptureForm({ locale }: { locale: string }) {
  const gate = useEmailGateState()
  const t = useTranslations("email")
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle")
  const [email, setEmail] = React.useState("")
  const [consent, setConsent] = React.useState(false)
  const formRef = React.useRef<HTMLFormElement | null>(null)

  if (gate.consented) return null

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
        body: JSON.stringify({ email, consent, locale }),
      })
      if (!res.ok) throw new Error("Request failed")
      setStatus("success")
      recordEmailConsent()
      setEmail("")
      setConsent(false)
    } catch {
      setStatus("error")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">{t("emailLabel")}</Label>
            <Input
              id="email"
              inputMode="email"
              type="email"
              required
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 border-slate-300"
            />
          </div>

          <div className="flex items-start gap-2">
            <Checkbox
              id="consent"
              checked={consent}
              onCheckedChange={(checked) => setConsent(Boolean(checked))}
            />
            <Label htmlFor="consent" className="text-sm text-slate-700">
              {t("consent")}
            </Label>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-700">{t("privacyNote")}</p>
            <Button type="submit" disabled={status === "loading"}>
              {t("submit")}
            </Button>
          </div>

          {status === "success" ? <p className="text-sm text-emerald-700">{t("success")}</p> : null}
          {status === "error" ? <p className="text-sm text-red-700">{t("error")}</p> : null}
        </form>
      </CardContent>
    </Card>
  )
}
