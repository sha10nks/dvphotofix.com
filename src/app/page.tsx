import type { Metadata } from "next"

import { RedirectClient } from "@/components/RedirectClient"

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
    <div className="mx-auto max-w-[720px] px-6 py-12 text-slate-900">
      <RedirectClient to="/en/tool/" />
      <a className="font-semibold text-blue-700 hover:text-blue-800" href="/en/tool/">
        Open the tool
      </a>
    </div>
  )
}
