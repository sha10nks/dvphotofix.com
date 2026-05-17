import type { Metadata } from "next"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for dvphotofix.netlify.app.",
  alternates: {
    canonical: "https://dvphotofix.netlify.app/privacy/",
  },
  openGraph: {
    title: "Privacy Policy",
    description: "Privacy policy for dvphotofix.netlify.app.",
    url: "https://dvphotofix.netlify.app/privacy/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy",
    description: "Privacy policy for dvphotofix.netlify.app.",
  },
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-[900px] px-6 py-10 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Privacy Policy</h1>
      <p className="mt-3 text-base leading-7 text-slate-700">
        DV Photo Fix is designed to process your photo locally in your browser by default.
      </p>

      <div className="mt-6 grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Photos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-[15px] leading-7 text-slate-800">
            <p>
              The core photo tool runs in your browser and does not need to upload your image to a server to perform the
              main checks and safe fixes.
            </p>
            <p>
              Your browser will temporarily hold your photo in memory while you use the tool. If you close the tab,
              memory may be released by the browser.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Email updates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-[15px] leading-7 text-slate-800">
            <p>
              If you submit your email, we use it to send DV Lottery update notifications. We do not claim to be an
              official notification channel.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Purpose: DV update notifications and tool-related notices</li>
              <li>Storage: we may store your email in our mailing system</li>
              <li>Opt-out: unsubscribe links may be included in emails where applicable</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Local storage and cookies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-[15px] leading-7 text-slate-800">
            <p>
              We store limited settings locally in your browser (for example, whether you already submitted an email so
              we dont ask again). This is stored using browser storage.
            </p>
            <p>
              If advertising is enabled, ad providers may use cookies or similar technologies to deliver and measure ads.
              Ads should never appear inside the photo workflow.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
