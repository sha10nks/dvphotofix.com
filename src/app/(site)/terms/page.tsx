import type { Metadata } from "next"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of use for dvphotofix.netlify.app.",
  alternates: {
    canonical: "https://dvphotofix.netlify.app/terms/",
  },
  openGraph: {
    title: "Terms",
    description: "Terms of use for dvphotofix.netlify.app.",
    url: "https://dvphotofix.netlify.app/terms/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms",
    description: "Terms of use for dvphotofix.netlify.app.",
  },
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-[900px] px-6 py-10 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Terms</h1>
      <p className="mt-3 text-base leading-7 text-slate-700">
        DV Photo Fix is provided “as is” for informational purposes and does not guarantee acceptance.
      </p>

      <div className="mt-6 grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Not a government service</CardTitle>
          </CardHeader>
          <CardContent className="text-[15px] leading-7 text-slate-800">
            dvphotofix.netlify.app is an independent website. It is not affiliated with the U.S. government and does not
            represent the DV Program.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tool limitations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-[15px] leading-7 text-slate-800">
            <p>
              The tool performs best-effort framing and formatting checks and applies only safe edits (crop, center,
              straighten, resize, compress). It cannot guarantee that any photo will be accepted.
            </p>
            <p>
              If the original photo has harsh shadows, a busy background, or clipped hair, retaking the photo may be the
              correct solution.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>User responsibility</CardTitle>
          </CardHeader>
          <CardContent className="text-[15px] leading-7 text-slate-800">
            You are responsible for verifying requirements on DV Program source pages and for your own DV entry
            submission. Final acceptance is decided by the official review process.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Liability limitation</CardTitle>
          </CardHeader>
          <CardContent className="text-[15px] leading-7 text-slate-800">
            To the maximum extent permitted by law, dvphotofix.netlify.app is not liable for losses resulting from the use of the
            site or tool.
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
