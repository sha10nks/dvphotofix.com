"use client"

import { DV_SOURCES } from "@/lib/site"
import { useTranslations } from "@/i18n/I18nClientProvider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function DisclaimerBlock() {
  const tCommon = useTranslations("common")

  return (
    <Card>
      <CardHeader>
        <CardTitle>{tCommon("disclaimer.title")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="list-disc space-y-3 pl-5 text-base leading-7 text-slate-800">
          <li>{tCommon("disclaimer.item1")}</li>
          <li>{tCommon("disclaimer.item2")}</li>
          <li>{tCommon("disclaimer.item3")}</li>
          <li>{tCommon("disclaimer.item4")}</li>
          <li>{tCommon("disclaimer.item5")}</li>
        </ul>
        <Separator />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-base text-slate-800">{tCommon("disclaimer.note")}</p>
          <Button asChild variant="outline">
            <a href={DV_SOURCES.travelDv} target="_blank" rel="noreferrer">
              {tCommon("disclaimer.openSources")}
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
