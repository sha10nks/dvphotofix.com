import type { Metadata } from "next"

import { Link } from "@/i18n/navigation"
import { DV_SOURCES } from "@/lib/site"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Updates",
  description: "DV Lottery updates and reminders. Always verify using DV Program source pages.",
  alternates: {
    canonical: "https://dvphotofix.netlify.app/en/updates/",
  },
  openGraph: {
    title: "DV Lottery Updates",
    description: "Source-linked DV Lottery updates and reminders.",
    url: "https://dvphotofix.netlify.app/en/updates/",
  },
  twitter: {
    card: "summary_large_image",
    title: "DV Lottery Updates",
    description: "Source-linked DV Lottery updates and reminders.",
  },
}

const updates = [
  {
    date: "See source",
    title: "DV program entry periods are announced on the DV Program pages",
    summary:
      "If you see a DV registration date without a DV Program source link, treat it as unconfirmed. Always use dvprogram.state.gov for entry access and timelines.",
    sourceLabel: "DV Program",
    sourceUrl: DV_SOURCES.travelDv,
  },
  {
    date: "See source",
    title: "DV-2027 entry period timing may change; visa application period remains fixed",
    summary:
      "The Department of State noted changes to the DV-2027 entry period timing and stated the DV-2027 visa application period remains October 1, 2026 to September 30, 2027.",
    sourceLabel: "Travel.State.Gov",
    sourceUrl: "https://travel.state.gov/content/travel/en/News/visas-news/changes-to-2027-dv-program-entry-period.html",
  },
] as const

export default function UpdatesPage() {
  return (
    <div className="mx-auto max-w-[900px] px-6 py-10 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Updates</h1>
      <p className="mt-3 max-w-3xl text-base leading-7 text-slate-800">
        Short, source-linked updates. If something is not backed by a DV Program link, we do not treat it as confirmed.
      </p>

      <div className="mt-6 grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Latest</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-[15px] leading-7 text-slate-800">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="text-base font-semibold text-slate-900">Quick links</div>
              <div className="mt-2 flex flex-wrap gap-3 text-sm">
                <a className="font-medium text-blue-700 hover:text-blue-800" href={DV_SOURCES.travelDv} target="_blank" rel="noreferrer">
                  DV Program source pages
                </a>
                <Link className="font-medium text-blue-700 hover:text-blue-800" href="/tool/">
                  Photo tool
                </Link>
                <Link className="font-medium text-blue-700 hover:text-blue-800" href="/photo-requirements">
                  Photo requirements
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              {updates.map((u) => (
                <div key={u.title} className="rounded-xl border border-slate-200 bg-white p-5">
                  <div className="text-sm text-slate-600">{u.date}</div>
                  <div className="mt-1 text-lg font-semibold text-slate-900">{u.title}</div>
                  <p className="mt-2 max-w-[72ch] text-[15px] leading-7 text-slate-800">{u.summary}</p>
                  <div className="mt-3 text-sm">
                    <a className="font-medium text-blue-700 hover:text-blue-800" href={u.sourceUrl} target="_blank" rel="noreferrer">
                      Source: {u.sourceLabel}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
