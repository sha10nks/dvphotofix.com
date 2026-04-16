import type { Metadata } from "next"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "About",
  description: "About DV Photo Fix and how the photo tool works.",
  alternates: {
    canonical: "https://dvphotofix.netlify.app/about",
  },
  openGraph: {
    title: "About DV Photo Fix",
    description: "About DV Photo Fix and how the photo tool works.",
    url: "https://dvphotofix.netlify.app/about",
  },
  twitter: {
    card: "summary_large_image",
    title: "About DV Photo Fix",
    description: "About DV Photo Fix and how the photo tool works.",
  },
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[900px] px-6 py-10 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">About DV Photo Fix</h1>
      <p className="mt-3 text-base leading-7 text-slate-700">
        DV Photo Fix is a private-sector utility that helps you check a DV entry photo and apply safe, transparent
        fixes in your browser.
      </p>

      <div className="mt-6 grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Ownership</CardTitle>
          </CardHeader>
          <CardContent className="text-[15px] leading-7 text-slate-800">
            dvphotofix.netlify.app is operated by an independent private owner. It is not affiliated with any U.S. government
            agency. If you need to reach the site operator, use the Contact page.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Non-affiliation</CardTitle>
          </CardHeader>
          <CardContent className="text-[15px] leading-7 text-slate-800">
            This website is not an official DV Lottery website and is not affiliated with the U.S. government. We do not
            submit DV entries on behalf of users.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>How the tool works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-[15px] leading-7 text-slate-800">
            <p>
              Your photo is processed locally in your browser using the File API, Canvas/OffscreenCanvas, and Web
              Workers. The tool frames the image using face geometry (eyes/chin landmarks) and exports a 600×600 JPEG.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Safe edits only: crop, reframe/center, straighten (small tilt), resize, compress</li>
              <li>No beautification, no facial retouching, no background replacement</li>
              <li>Best-effort checks only  final acceptance is decided by the official review process</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
