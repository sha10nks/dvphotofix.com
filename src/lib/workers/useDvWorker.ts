"use client"

import * as React from "react"

import type { DvAnalysis, DvFixOptions, FaceDetection } from "@/lib/dvPhotoRules"
import { detectFace } from "@/lib/vision/detectFace"

type WorkerResponse =
  | { type: "analyze-result"; payload: { analysis: DvAnalysis } }
  | { type: "fix-result"; payload: { blob: Blob; analysis: DvAnalysis } }
  | { type: "error"; payload: { message: string } }
  | { type: "progress"; payload: { stage: string; value: number } }

export function useDvWorker() {
  const workerRef = React.useRef<Worker | null>(null)
  const [progress, setProgress] = React.useState<{ stage: string; value: number } | null>(null)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const w = new Worker(new URL("../../workers/dvPhotoWorker.ts", import.meta.url), { type: "module" })
    workerRef.current = w

    w.onmessage = (ev: MessageEvent<WorkerResponse>) => {
      if (ev.data.type === "progress") setProgress(ev.data.payload)
      if (ev.data.type === "error") setError(ev.data.payload.message)
    }

    return () => {
      w.terminate()
      workerRef.current = null
    }
  }, [])

  async function analyze(file: File): Promise<DvAnalysis> {
    setError(null)
    setProgress({ stage: "start", value: 0 })
    const w = workerRef.current
    if (!w) throw new Error("Worker not ready")

    let detection: FaceDetection | null = null
    try {
      detection = await detectFace(file)
    } catch {
      detection = null
    }

    return await new Promise((resolve, reject) => {
      const handler = (ev: MessageEvent<WorkerResponse>) => {
        if (ev.data.type === "analyze-result") {
          w.removeEventListener("message", handler as never)
          resolve(ev.data.payload.analysis)
        }
        if (ev.data.type === "error") {
          w.removeEventListener("message", handler as never)
          reject(new Error(ev.data.payload.message))
        }
      }
      w.addEventListener("message", handler as never)
      w.postMessage({ type: "analyze", payload: { file, detection } })
    })
  }

  async function fix(file: File, options: DvFixOptions): Promise<{ blob: Blob; analysis: DvAnalysis }> {
    setError(null)
    setProgress({ stage: "start", value: 0 })
    const w = workerRef.current
    if (!w) throw new Error("Worker not ready")

    let detection: FaceDetection | null = null
    try {
      detection = await detectFace(file)
    } catch {
      detection = null
    }

    return await new Promise((resolve, reject) => {
      const handler = (ev: MessageEvent<WorkerResponse>) => {
        if (ev.data.type === "fix-result") {
          w.removeEventListener("message", handler as never)
          resolve({ blob: ev.data.payload.blob, analysis: ev.data.payload.analysis })
        }
        if (ev.data.type === "error") {
          w.removeEventListener("message", handler as never)
          reject(new Error(ev.data.payload.message))
        }
      }
      w.addEventListener("message", handler as never)
      w.postMessage({ type: "fix", payload: { file, options, detection } })
    })
  }

  return { analyze, fix, progress, error }
}
