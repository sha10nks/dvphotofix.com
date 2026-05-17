import type { Metadata } from "next"

import { AdSlot } from "@/components/AdSlot"
import { DisclaimerBlock } from "@/components/DisclaimerBlock"
import { EmailCaptureForm } from "@/components/EmailCaptureForm"
import { JsonLd } from "@/components/JsonLd"
import { UnifiedDvPhotoTool } from "@/components/UnifiedDvPhotoTool"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { DV_SOURCES } from "@/lib/site"
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/i18n/config"
import { I18nClientProvider } from "@/i18n/I18nClientProvider"
import { loadNamespaces } from "@/i18n/loadMessages"
import { getCanonical, getHreflang } from "@/i18n/seo"
import { createTranslator } from "@/i18n/translator"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: rawLocale } = await params
  const locale = (isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE) as Locale

  const messages = await loadNamespaces(locale, ["metadata"])
  const { tn } = createTranslator(messages)
  const tMeta = tn("metadata")

  const canonical = getCanonical(locale, "/tool/")
  return {
    title: tMeta("pages.tool.title"),
    description: tMeta("pages.tool.description"),
    alternates: {
      canonical,
      languages: getHreflang("/tool/"),
    },
    openGraph: {
      title: tMeta("pages.tool.title"),
      description: tMeta("pages.tool.description"),
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title: tMeta("pages.tool.title"),
      description: tMeta("pages.tool.description"),
    },
  }
}

export const dynamic = "force-static"
export const revalidate = false

export default async function ToolPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale = (isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE) as Locale

  const messages = await loadNamespaces(locale, ["common", "errors", "tool", "faq"])
  const { tn } = createTranslator(messages)
  const tTool = tn("tool")
  const tFaq = tn("faq")

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: tTool("hero.title"),
    step: [
      { "@type": "HowToStep", name: "Upload", text: "Upload a JPG/PNG photo. Processing runs locally in your browser." },
      { "@type": "HowToStep", name: "Analyze", text: "The tool checks basic dimensions, file size, and framing heuristics." },
      { "@type": "HowToStep", name: "Fix", text: "Apply safe transforms only: crop, center, straighten (optional), resize, and compress." },
      { "@type": "HowToStep", name: "Download", text: "Download a DV-ready JPEG and always verify requirements on official DV sources." },
    ],
  }

  return (
    <I18nClientProvider locale={locale} messages={messages}>
      <div className="bg-transparent">
        <JsonLd data={howToJsonLd} />

        <div className="mx-auto grid max-w-[1300px] grid-cols-1 gap-12 px-6 py-20 lg:px-8 xl:grid-cols-[minmax(0,1fr)_220px]">
          <div className="space-y-28">
            <AdSlot variant="top" slot="top-banner" minHeight={90} />

            <section className="rounded-[24px] border border-[#D6E4FF] bg-gradient-to-b from-white to-[#EEF4FF] p-8 shadow-[0_10px_30px_rgba(37,99,235,0.08)] sm:p-10">
              <div className="flex flex-col gap-6">
                <div className="space-y-4">
                  <h1 className="text-5xl font-semibold leading-relaxed tracking-tight text-[#0F172A] sm:text-6xl">
                    {tTool("hero.title")}
                  </h1>
                  <p className="max-w-3xl text-lg leading-8 text-[#334155]">{tTool("hero.subtitle")}</p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg">
                    <a href="#tool">{tTool("hero.primaryCta")}</a>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <a href={DV_SOURCES.travelDv} target="_blank" rel="noreferrer">
                      {tTool("hero.secondaryCta")}
                    </a>
                  </Button>
                </div>
                <p className="text-sm leading-6 text-[#64748B]">{tTool("hero.note")}</p>
              </div>
            </section>

            <AdSlot variant="inline" slot="above-tool" minHeight={220} />

            <section id="tool" className="space-y-8">
              <Card className="rounded-[24px] border border-[#CBD5E1] shadow-[0_8px_30px_rgba(15,23,42,0.08)]">
                <CardHeader>
                  <CardTitle className="text-2xl">{tTool("tool.title")}</CardTitle>
                </CardHeader>
                <CardContent className="p-10">
                  <UnifiedDvPhotoTool />
                </CardContent>
              </Card>
            </section>

            <AdSlot variant="inline" slot="below-tool" minHeight={220} />

            <EmailCaptureForm />
            <AdSlot variant="inline" slot="near-email" minHeight={220} />
            <DisclaimerBlock />

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{tFaq("toolQuick.title")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-base leading-7 text-slate-800">
                  {tFaq("toolQuick.intro")}
                </p>
                <Separator />
                <Accordion type="single" collapsible>
                  <AccordionItem value="q1">
                    <AccordionTrigger>{tFaq("toolQuick.q1.question")}</AccordionTrigger>
                    <AccordionContent>
                      {tFaq("toolQuick.q1.answer")}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="q2">
                    <AccordionTrigger>{tFaq("toolQuick.q2.question")}</AccordionTrigger>
                    <AccordionContent>
                      {tFaq("toolQuick.q2.answer")}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="q3">
                    <AccordionTrigger>{tFaq("toolQuick.q3.question")}</AccordionTrigger>
                    <AccordionContent>
                      {tFaq("toolQuick.q3.answer")}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>

          <aside className="hidden xl:block">
            <div className="sticky top-24 space-y-6">
              <AdSlot variant="sidebar" slot="right-rail" minHeight={520} />
            </div>
          </aside>
        </div>
      </div>
    </I18nClientProvider>
  )
}
