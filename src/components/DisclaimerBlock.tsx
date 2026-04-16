import { useTranslations } from "next-intl"

import { DV_SOURCES } from "@/lib/site"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function DisclaimerBlock() {
  const t = useTranslations("disclaimer")

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("blockTitle")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="list-disc space-y-3 pl-5 text-base leading-7 text-slate-800">
          <li>{t("bullets.notOfficial")}</li>
          <li>{t("bullets.noApply")}</li>
          <li>{t("bullets.noGuarantee")}</li>
          <li>{t("bullets.notReplace")}</li>
          <li>{t("bullets.verify")}</li>
        </ul>
        <Separator />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-base text-slate-800">Use the U.S. Department of State DV Program pages as your source of truth.</p>
          <Button asChild variant="outline">
            <a href={DV_SOURCES.travelDv} target="_blank" rel="noreferrer">
              {t("sourceLink")}
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
