import type { Metadata } from "next"

import { DisclaimerBlock } from "@/components/DisclaimerBlock"

export const metadata: Metadata = {
  title: "Disclaimer",
  description: "Non-affiliation and limitations of dvphotofix.netlify.app.",
  alternates: {
    canonical: "https://dvphotofix.netlify.app/en/disclaimer/",
  },
  openGraph: {
    title: "Disclaimer",
    description: "Non-affiliation and limitations of dvphotofix.netlify.app.",
    url: "https://dvphotofix.netlify.app/en/disclaimer/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Disclaimer",
    description: "Non-affiliation and limitations of dvphotofix.netlify.app.",
  },
}

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-[900px] px-6 py-10 lg:px-8">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Disclaimer</h1>
      <p className="mt-3 max-w-3xl text-base leading-7 text-slate-800">
        dvphotofix.netlify.app is an independent website. It does not represent the DV Program and cannot guarantee any outcome.
        Use the DV Program source pages as your source of truth.
      </p>
      <div className="mt-6">
        <DisclaimerBlock />
      </div>
    </div>
  )
}
