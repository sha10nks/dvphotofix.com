import type { Metadata } from "next"

import { LocaleAutoRedirect } from "@/components/LocaleAutoRedirect"

export const metadata: Metadata = {
  alternates: {
    canonical: "https://dvphotofix.netlify.app/en/tool/",
  },
  robots: {
    index: false,
    follow: true,
  },
}

export default function RootPage() {
  return (
    <div className="mx-auto max-w-[720px] px-6 py-12">
      <LocaleAutoRedirect />
      <a className="font-semibold text-[#2563EB] hover:text-[#1D4ED8]" href="/en/tool/">
        Open the tool
      </a>
    </div>
  )
}

