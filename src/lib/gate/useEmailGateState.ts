"use client"

import * as React from "react"

import { getEmailGateState } from "@/lib/gate/emailGate"

export function useEmailGateState() {
  const [state, setState] = React.useState(() => getEmailGateState())

  React.useEffect(() => {
    const onChange = () => setState(getEmailGateState())
    window.addEventListener("dvpf:gate", onChange)
    window.addEventListener("storage", onChange)
    return () => {
      window.removeEventListener("dvpf:gate", onChange)
      window.removeEventListener("storage", onChange)
    }
  }, [])

  return state
}

