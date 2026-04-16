"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { recordEmailConsent } from "@/lib/gate/emailGate"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const schema = z.object({
  email: z.string().email(),
  consent: z.literal(true),
})

type FormValues = z.infer<typeof schema>

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

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", consent: true },
    mode: "onSubmit",
  })

  async function onSubmit(values: FormValues) {
    setStatus("loading")
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, locale, source: "gate" }),
      })
      if (!res.ok) throw new Error("Request failed")
      recordEmailConsent()
      setStatus("idle")
      form.reset({ email: "", consent: true })
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

        <form className="mt-4 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-2">
            <Label htmlFor="gate-email">{t("emailLabel")}</Label>
            <Input id="gate-email" inputMode="email" placeholder="name@example.com" {...form.register("email")} />
            {form.formState.errors.email ? (
              <p className="text-sm text-red-700">{String(form.formState.errors.email.message || "Invalid email")}</p>
            ) : null}
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
