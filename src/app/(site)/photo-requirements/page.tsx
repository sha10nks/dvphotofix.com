import type { Metadata } from "next"
import Link from "next/link"

import { DV_SOURCES, SITE } from "@/lib/site"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "DV Photo Requirements — Size, Format, Framing, Background",
  description:
    "DV Lottery photo requirements explained in plain language: 600×600 size, JPEG, file size limits, head size, background rules, lighting, glasses, and common rejection reasons.",
  alternates: {
    canonical: "https://dvphotofix.netlify.app/photo-requirements/",
  },
  openGraph: {
    title: "DV Photo Requirements — Size, Format, Framing, Background",
    description:
      "DV Lottery photo requirements explained in plain language: 600×600 size, JPEG, file size limits, head size, background rules, lighting, glasses, and common rejection reasons.",
    url: "https://dvphotofix.netlify.app/photo-requirements/",
  },
  twitter: {
    card: "summary_large_image",
    title: "DV Photo Requirements — Size, Format, Framing, Background",
    description:
      "DV Lottery photo requirements explained in plain language: 600×600 size, JPEG, file size limits, head size, background rules, lighting, glasses, and common rejection reasons.",
  },
}

export default function PhotoRequirementsPage() {
  return (
    <div className="mx-auto max-w-[900px] px-6 py-10 lg:px-8">
      <h1 className="text-4xl font-semibold tracking-tight text-slate-900">DV Lottery photo requirements (quick, accurate)</h1>
      <p className="mt-4 max-w-3xl text-base leading-7 text-slate-800">
        If your DV entry photo fails, its usually because of size/format, framing, or background/lighting. Below is a
        practical checklist and a clear breakdown of the most common rules  aligned with the U.S. Department of State DV
        Program guidance.
      </p>
      <p className="mt-3 text-sm text-slate-700">
        This website is independent and not affiliated with the U.S. government. You must verify rules on the DV Program
        source pages.
      </p>
      <p className="mt-2 text-sm text-slate-600">Last updated: {SITE.lastReviewedISO}</p>

      <div className="mt-8 grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick checklist</CardTitle>
          </CardHeader>
          <CardContent className="text-[15px] leading-7 text-slate-800">
            <ul className="list-disc space-y-2 pl-5">
              <li>Digital image file: JPEG</li>
              <li>Square: 600×600 pixels</li>
              <li>File size: 240 kB or less (many DV systems use 240 KB as the limit)</li>
              <li>Color photo (not grayscale)</li>
              <li>Plain, light background (white/off-white), no strong texture</li>
              <li>Head fully visible with some space above hair; shoulders included</li>
              <li>Face centered and level; neutral expression</li>
              <li>Even lighting, no harsh shadows across the face or background</li>
              <li>Avoid edits that change appearance; dont beautify</li>
              <li>Glasses are generally not allowed in newer U.S. visa photo rules</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Size, format, and file weight</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-[15px] leading-7 text-slate-800">
            <p>
              For DV entry, the system expects a square JPEG at exactly <strong>600×600 pixels</strong>. Many rejections are
              caused by uploading a non-square image, the wrong pixel size, or a file that exceeds the size limit.
            </p>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Target values</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Format: JPEG</li>
                <li>Dimensions: 600×600 pixels</li>
                <li>File size: ≤ 240 kB</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">How to fix</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>If your photo is not square: crop to 1:1, then resize to 600×600.</li>
                <li>If your file is too large: reduce JPEG quality slightly without blurring facial details.</li>
                <li>If your image looks blurry after compression: start from a higher-quality source photo.</li>
              </ul>
              <p className="mt-3">The photo tool can do safe formatting locally in your browser.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Framing and head size (composition)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-[15px] leading-7 text-slate-800">
            <p>
              The DV photo is not just a square cropits a framing problem. The head must be centered and sized so the
              system and human review can clearly see your full head and upper shoulders.
            </p>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">What to aim for</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Head is centered horizontally (no left/right drift).</li>
                <li>Head is not too small (too far) or too large (too close).</li>
                <li>Some space above hair; hair and chin never touch the border.</li>
                <li>Upper shoulders are visible (not a tight face-only crop).</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">How to fix</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>If you are off-center: reframe using face detection so the face center aligns to the canvas center.</li>
                <li>If you are too far: scale up (reframe) before final crop.</li>
                <li>If you are too close: scale down while keeping margins and shoulders.</li>
              </ul>
              <p className="mt-3">
                <Link href="/tool/" className="font-medium text-blue-700 hover:text-blue-800">
                  Use the photo tool to reframe safely
                </Link>
                .
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Background, lighting, and glasses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-[15px] leading-7 text-slate-800">
            <p>
              A photo can be correctly sized and still fail if the background is busy, lighting is harsh, or accessories
              violate current guidance.
            </p>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Common problems</h2>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Strong shadows behind your head or across your face.</li>
                <li>Textured or colored background that isnt clearly light/neutral.</li>
                <li>Glasses (often rejected under newer U.S. visa photo rules).</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">How to fix (safe)</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>Retake the photo with softer light from the front (e.g., facing a window).</li>
                <li>Use a plain wall or a clean white/off-white sheet as a backdrop.</li>
                <li>Retake without glasses instead of trying to edit them out.</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Common rejection reasons (and what to do)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-[15px] leading-7 text-slate-800">
            <p>These are the most frequent issues people run into when uploading a DV photo:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Wrong size/format</strong>  Convert to JPEG, crop to square, resize to 600×600, then compress under
                the file size limit.
              </li>
              <li>
                <strong>Framing off (face not centered / head too small/large)</strong>  Reframe using face geometry, not a
                manual crop.
              </li>
              <li>
                <strong>Hair or chin clipped</strong>  Add headroom and avoid tight crops; retake if the original already cuts
                off hair.
              </li>
              <li>
                <strong>Background or shadows</strong>  Retake with a cleaner background and softer light.
              </li>
              <li>
                <strong>Over-editing</strong>  Avoid edits that change appearance. A formatting tool should not alter identity.
              </li>
            </ul>
            <p className="mt-3">
              Ready to check yours?{" "}
              <Link href="/tool/" className="font-medium text-blue-700 hover:text-blue-800">
                Open the tool
              </Link>
              .
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Use the tool</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[15px] leading-7 text-slate-800">Run checks and safe reframing locally in your browser.</p>
            <Button asChild>
              <Link href="/tool/">Open the photo tool</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Source pages</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[15px] leading-7 text-slate-800">Verify requirements using the DV Program source pages.</p>
            <Button asChild variant="outline">
              <a href={DV_SOURCES.travelDv} target="_blank" rel="noreferrer">
                Open DV Program source pages
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
