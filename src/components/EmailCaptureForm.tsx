"use client"

import * as React from "react"

import { recordEmailConsent } from "@/lib/gate/emailGate"
import { useEmailGateState } from "@/lib/gate/useEmailGateState"
import { useTranslations } from "@/i18n/I18nClientProvider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function EmailCaptureForm() {
  const tTool = useTranslations("tool")
  const tErrors = useTranslations("errors")
  const gate = useEmailGateState()
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
        <CardTitle>{tTool("email.title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">{tTool("email.emailLabel")}</Label>
            <Input
              id="email"
              inputMode="email"
              type="email"
              required
              placeholder={tTool("email.placeholder")}
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
              {tTool("email.consent")}
            </Label>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-700">{tTool("email.note")}</p>
            <Button type="submit" disabled={status === "loading"}>
              {tTool("email.submit")}
            </Button>
          </div>

          {status === "success" ? <p className="text-sm text-emerald-700">{tTool("email.success")}</p> : null}
          {status === "error" ? <p className="text-sm text-red-700">{tErrors("generic.tryAgain")}</p> : null}
        </form>
      </CardContent>
    </Card>
  )
}
