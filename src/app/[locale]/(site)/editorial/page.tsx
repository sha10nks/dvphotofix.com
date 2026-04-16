import type { Metadata } from "next"

import { DV_SOURCES, SITE } from "@/lib/site"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Editorial & Sources",
  description: "How content is maintained and which sources are referenced.",
  alternates: {
    canonical: "https://dvphotofix.netlify.app/editorial",
  },
  openGraph: {
    title: "Editorial & Sources",
    description: "How content is maintained and which sources are referenced.",
    url: "https://dvphotofix.netlify.app/editorial",
  },
  twitter: {
    card: "summary_large_image",
    title: "Editorial & Sources",
    description: "How content is maintained and which sources are referenced.",
  },
}

export default function EditorialPage() {
  return (
    <div className="mx-auto max-w-[900px] px-6 py-10 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Editorial & Sources</h1>
      <p className="mt-3 max-w-3xl text-base leading-7 text-slate-800">
        We keep content concise and aligned with DV Program guidance. If a page cannot be backed by a DV Program source
        link, we treat it as unconfirmed.
      </p>

      <div className="mt-6 grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Primary sources</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-700">
              <div>DV Program source pages</div>
              <div className="mt-1 text-sm text-slate-600">Last reviewed: {SITE.lastReviewedISO}</div>
            </div>
            <Button asChild variant="outline">
              <a href={DV_SOURCES.travelDv} target="_blank" rel="noreferrer">
                Open source
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content standards</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-[15px] leading-7 text-slate-800">
            <ul className="list-disc space-y-1 pl-5">
              <li>No guarantees of acceptance</li>
              <li>No speculation presented as fact</li>
              <li>Important info appears in the first paragraph</li>
              <li>Clear headings and bullet lists for fast reading</li>
              <li>Tool-first CTAs (open the photo tool)</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
