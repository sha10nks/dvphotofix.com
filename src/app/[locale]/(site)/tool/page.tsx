import type { Metadata } from "next"

import { DV_SOURCES } from "@/lib/site"
import { UnifiedDvPhotoTool } from "@/components/UnifiedDvPhotoTool"
import { AdSlot } from "@/components/AdSlot"
import { DisclaimerBlock } from "@/components/DisclaimerBlock"
import { EmailCaptureForm } from "@/components/EmailCaptureForm"
import { JsonLd } from "@/components/JsonLd"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"

import { routing, type AppLocale } from "@/i18n/routing"

export const metadata: Metadata = {
  title: "DV Photo Tool — Crop, Center, Resize, Compress (600×600 JPEG)",
  description:
    "Prepare a DV Lottery photo locally in your browser. Safe transforms only: crop, center, straighten, resize, compress. Not affiliated with the U.S. government.",
  alternates: {
    canonical: "https://dvphotofix.netlify.app/en/tool/",
  },
  openGraph: {
    title: "DV Photo Tool — Crop, Center, Resize, Compress (600×600 JPEG)",
    description:
      "Prepare a DV Lottery photo locally in your browser. Safe transforms only: crop, center, straighten, resize, compress. Not affiliated with the U.S. government.",
    url: "https://dvphotofix.netlify.app/en/tool/",
  },
  twitter: {
    card: "summary_large_image",
    title: "DV Photo Tool — Crop, Center, Resize, Compress (600×600 JPEG)",
    description:
      "Prepare a DV Lottery photo locally in your browser. Safe transforms only: crop, center, straighten, resize, compress. Not affiliated with the U.S. government.",
  },
}

export default async function ToolPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale = (routing.locales.includes(rawLocale as never) ? rawLocale : routing.defaultLocale) as AppLocale
  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to prepare a DV Lottery photo in your browser",
    step: [
      {
        "@type": "HowToStep",
        name: "Upload",
        text: "Upload a JPG/PNG photo. Processing is designed to run locally in your browser.",
      },
      {
        "@type": "HowToStep",
        name: "Analyze",
        text: "The tool checks dimensions, file size, centering, and safe headroom heuristics.",
      },
      {
        "@type": "HowToStep",
        name: "Apply safe fixes",
        text: "Apply safe transforms only: crop, center, straighten (optional), resize, and compress.",
      },
      {
        "@type": "HowToStep",
        name: "Download",
        text: "Download a DV-ready JPEG and recheck. Always verify requirements using DV Program source pages.",
      },
    ],
  }

  return (
    <div className="bg-white">
      <JsonLd data={howToJsonLd} />

      <div className="mx-auto grid max-w-[1300px] grid-cols-1 gap-12 px-6 py-12 lg:px-8 xl:grid-cols-[minmax(0,1fr)_220px]">
        <div className="space-y-28">
          <AdSlot variant="top" slot="top-banner" minHeight={90} />

          <section className="rounded-3xl border border-slate-200 bg-gradient-to-b from-blue-50 to-white p-8 sm:p-10">
            <div className="flex flex-col gap-6">
              <div className="space-y-4">
                <h1 className="text-5xl font-semibold leading-relaxed tracking-tight text-slate-900 sm:text-6xl">
                  Fix your DV Lottery photo framing in minutes — right in your browser
                </h1>
                <p className="max-w-3xl text-lg leading-8 text-slate-800">
                  Safe formatting only: crop, center, straighten, resize to 600×600, and compress under 239 kB. No
                  beautification. No background replacement.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg">
                  <a href="#tool">Start with upload</a>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href={DV_SOURCES.travelDv} target="_blank" rel="noreferrer">
                    Open DV Program source pages
                  </a>
                </Button>
              </div>
              <p className="text-sm leading-6 text-slate-700">
                This site is not official, not affiliated with the U.S. government, and does not submit applications.
                Final acceptance is decided by the official review process.
              </p>
            </div>
          </section>

          <AdSlot variant="inline" slot="above-tool" minHeight={280} />

          <section id="tool" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">DV photo tool</CardTitle>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <UnifiedDvPhotoTool locale={locale} />
              </CardContent>
            </Card>
          </section>

          <AdSlot variant="inline" slot="below-tool" minHeight={280} />

          <EmailCaptureForm locale={locale} />
          <AdSlot variant="inline" slot="near-email" minHeight={220} />
          <DisclaimerBlock />

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Quick FAQ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-base leading-7 text-slate-800">
                Short answers to high-intent questions. For the source of truth, use the DV Program source pages.
              </p>
              <Separator />
              <Accordion type="single" collapsible>
                <AccordionItem value="q1">
                  <AccordionTrigger>Is this an official website?</AccordionTrigger>
                  <AccordionContent>
                    No. DV Photo Fix is an independent private-sector website. It is not affiliated with the U.S.
                    government.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q2">
                  <AccordionTrigger>Does this tool guarantee acceptance?</AccordionTrigger>
                  <AccordionContent>
                    No. This tool helps with formatting and alignment, but acceptance is decided by the official review
                    process.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="q3">
                  <AccordionTrigger>Does the tool edit my face or “beautify” my photo?</AccordionTrigger>
                  <AccordionContent>
                    No. The tool is limited to safe geometric transforms: crop, center, straighten, resize, and compress.
                    It does not retouch facial features.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>

        <aside className="hidden xl:block">
          <div className="sticky top-24 space-y-6">
            <AdSlot variant="sidebar" slot="right-rail" minHeight={600} />
          </div>
        </aside>
      </div>
    </div>
  )
}
