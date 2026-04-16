"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { recordEmailConsent } from "@/lib/gate/emailGate"
import { useEmailGateState } from "@/lib/gate/useEmailGateState"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const schema = z.object({
  email: z.string().email(),
  consent: z.boolean().optional(),
})

type FormValues = z.infer<typeof schema>

export function EmailCaptureForm({ locale }: { locale: string }) {
  const gate = useEmailGateState()
  const t = useTranslations("email")
  const [status, setStatus] = React.useState<"idle" | "loading" | "success" | "error">("idle")

  if (gate.consented) return null

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", consent: false },
    mode: "onSubmit",
  })

  async function onSubmit(values: FormValues) {
    setStatus("loading")
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, locale }),
      })
      if (!res.ok) throw new Error("Request failed")
      setStatus("success")
      recordEmailConsent()
      form.reset({ email: "", consent: false })
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
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="email">{t("emailLabel")}</Label>
            <Input
              id="email"
              inputMode="email"
              placeholder="name@example.com"
              {...form.register("email")}
            />
            {form.formState.errors.email ? (
              <p className="text-sm text-red-700">{String(form.formState.errors.email.message || "Invalid email")}</p>
            ) : null}
          </div>

          <div className="flex items-start gap-2">
            <Checkbox
              id="consent"
              checked={!!form.watch("consent")}
              onCheckedChange={(checked) => form.setValue("consent", Boolean(checked))}
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
