"use client"

import type { DvAnalysis, DvFixOptions, FaceDetection } from "@/lib/dvPhotoRules"

type WorkerResponse =
  | { type: "analyze-result"; payload: { analysis: DvAnalysis } }
  | { type: "fix-preview"; payload: { blob: Blob; bytes: number } }
  | { type: "fix-result"; payload: { blob: Blob; analysis: DvAnalysis } }
  | { type: "error"; payload: { message: string } }
  | { type: "progress"; payload: { stage: string; value: number } }

function createWorker() {
  return new Worker(new URL("../../workers/dvPhotoWorker.ts", import.meta.url), { type: "module" })
}

export async function analyzeInWorker(args: {
  file: File
  detection: FaceDetection | null
  onProgress?: (p: { stage: string; value: number }) => void
}) {
  const w = createWorker()
  try {
    return await new Promise<DvAnalysis>((resolve, reject) => {
      const handler = (ev: MessageEvent<WorkerResponse>) => {
        if (ev.data.type === "progress") args.onProgress?.(ev.data.payload)
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
      w.postMessage({ type: "analyze", payload: { file: args.file, detection: args.detection } })
    })
  } finally {
    w.terminate()
  }
}

export async function fixInWorker(args: {
  file: File
  options: DvFixOptions
  detection: FaceDetection | null
  onProgress?: (p: { stage: string; value: number }) => void
  onPreview?: (p: { blob: Blob; bytes: number }) => void
}) {
  const w = createWorker()
  try {
    return await new Promise<{ blob: Blob; analysis: DvAnalysis }>((resolve, reject) => {
      const handler = (ev: MessageEvent<WorkerResponse>) => {
        if (ev.data.type === "progress") args.onProgress?.(ev.data.payload)
        if (ev.data.type === "fix-preview") args.onPreview?.(ev.data.payload)
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
      w.postMessage({ type: "fix", payload: { file: args.file, options: args.options, detection: args.detection } })
    })
  } finally {
    w.terminate()
  }
}

