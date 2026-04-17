"use client"

import * as React from "react"

export default function RootPage() {
  React.useEffect(() => {
    window.location.replace("/en/tool/")
  }, [])

  return (
    <div className="mx-auto max-w-[720px] px-6 py-12 text-slate-900">
      <a className="font-semibold text-blue-700 hover:text-blue-800" href="/en/tool/">
        Open the tool
      </a>
    </div>
  )
}
