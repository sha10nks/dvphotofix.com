"use client"

import * as React from "react"

export function RedirectClient({ to }: { to: string }) {
  React.useEffect(() => {
    window.location.replace(to)
  }, [to])

  return null
}

