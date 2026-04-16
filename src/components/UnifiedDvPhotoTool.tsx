"use client"

import * as React from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Download, Loader2, Trash2, Upload } from "lucide-react"
import { zipSync } from "fflate"

import type { ChecklistItem, DvAnalysis, DvFixOptions } from "@/lib/dvPhotoRules"
import { detectFace } from "@/lib/vision/detectFace"
import { analyzeInWorker, fixInWorker } from "@/lib/workers/dvWorkerClient"
import { getEmailGateState, recordSuccessfulDownload } from "@/lib/gate/emailGate"
import { EmailGateModal } from "@/components/EmailGateModal"
import { Button } from "@/components/ui/button"

type Phase = "queued" | "uploading" | "analyzing" | "issues" | "fixing" | "finalizing" | "ready" | "error"

type Item = {
  id: string
  file: File
  fileName: string
  originalBytes: number
  displayBytes: number
  originalUrl: string
  previewUrl?: string
  outputUrl?: string
  outputBlob?: Blob
  analysis?: DvAnalysis
  phase: Phase
  issues: "none" | "some" | "unknown"
  error?: string
  startedAt?: number
  readyAnnounced?: boolean
}

const OPTIONS: DvFixOptions = {
  cropToSquare: true,
  straighten: true,
  compressToMaxBytes: true,
  removeMetadata: true,
}

function kb(bytes: number) {
  return Math.round(bytes / 1024)
}

function overall(items: ChecklistItem[]) {
  if (items.some((i) => i.status === "fail")) return "fail"
  if (items.some((i) => i.status === "warn")) return "warn"
  return "pass"
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}

function useSuccessSound() {
  const audioRef = React.useRef<AudioContext | null>(null)

  const unlock = React.useCallback(() => {
    if (typeof window === "undefined") return
    if (!audioRef.current) audioRef.current = new AudioContext()
    if (audioRef.current.state === "suspended") void audioRef.current.resume()
  }, [])

  const play = React.useCallback(() => {
    const ctx = audioRef.current
    if (!ctx || ctx.state !== "running") return
    const now = ctx.currentTime
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = "sine"
    osc.frequency.setValueAtTime(880, now)
    osc.frequency.exponentialRampToValueAtTime(1320, now + 0.08)
    gain.gain.setValueAtTime(0.0001, now)
    gain.gain.exponentialRampToValueAtTime(0.09, now + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(now)
    osc.stop(now + 0.2)
  }, [])

  return { unlock, play }
}

function StatusBadge({ phase, issues }: { phase: Phase; issues: Item["issues"] }) {
  const base = "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[13px] font-medium"

  if (phase === "uploading") {
    return (
      <div className={`${base} border-slate-200 bg-white text-slate-700`}>
        <Loader2 className="h-4 w-4 animate-spin" />
        Uploading
      </div>
    )
  }
  if (phase === "analyzing") {
    return (
      <div className={`${base} border-amber-200 bg-amber-50 text-amber-900`}>
        <motion.div
          className="h-2 w-2 rounded-full bg-amber-500"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
        Analyzing
      </div>
    )
  }
  if (phase === "issues") {
    if (issues === "some") {
      return <div className={`${base} border-red-200 bg-red-50 text-red-900`}>Issues detected</div>
    }
    return <div className={`${base} border-emerald-200 bg-emerald-50 text-emerald-900`}>Checks completed</div>
  }
  if (phase === "fixing") {
    return (
      <div className={`${base} border-orange-200 bg-orange-50 text-orange-900`}>
        <motion.div
          className="h-2 w-2 rounded-full bg-orange-500"
          animate={{ scale: [1, 1.25, 1] }}
          transition={{ duration: 1.1, repeat: Infinity }}
        />
        Fixing
      </div>
    )
  }
  if (phase === "finalizing") {
    return (
      <div className={`${base} border-emerald-200 bg-emerald-50 text-emerald-900`}>
        <motion.div
          className="h-2 w-2 rounded-full bg-emerald-600"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
        Finalizing
      </div>
    )
  }
  if (phase === "ready") {
    return <div className="text-lg font-semibold text-emerald-700">Ready</div>
  }
  if (phase === "error") {
    return <div className={`${base} border-red-200 bg-red-50 text-red-900`}>Error</div>
  }
  return (
    <div className={`${base} border-slate-200 bg-white text-slate-700`}>
      <Upload className="h-4 w-4" />
      Queued
    </div>
  )
}

function OverlayGuides({ overlay }: { overlay: DvAnalysis["overlay"] }) {
  if (!overlay) return null
  const box = overlay.faceBox
  const left = overlay.leftEye
  const right = overlay.rightEye
  const chin = overlay.chin
  const headTopY = overlay.headTopY
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-blue-600/25" />
      <div className="absolute left-0 top-[40%] h-px w-full bg-blue-600/20" />
      {typeof headTopY === "number" ? (
        <div className="absolute left-0 h-px w-full bg-emerald-600/20" style={{ top: `${headTopY * 100}%` }} />
      ) : null}
      {box ? (
        <div
          className="absolute rounded-md border border-red-500/40"
          style={{ left: `${box.x * 100}%`, top: `${box.y * 100}%`, width: `${box.w * 100}%`, height: `${box.h * 100}%` }}
        />
      ) : null}
      {left ? (
        <div className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/80" style={{ left: `${left.x * 100}%`, top: `${left.y * 100}%` }} />
      ) : null}
      {right ? (
        <div className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/80" style={{ left: `${right.x * 100}%`, top: `${right.y * 100}%` }} />
      ) : null}
      {chin ? (
        <div className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-600/70" style={{ left: `${chin.x * 100}%`, top: `${chin.y * 100}%` }} />
      ) : null}
    </div>
  )
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 30_000)
}

export function UnifiedDvPhotoTool({ locale }: { locale: string }) {
  const { unlock, play } = useSuccessSound()
  const [items, setItems] = React.useState<Item[]>([])
  const [gateOpen, setGateOpen] = React.useState(false)
  const pendingZipRef = React.useRef(false)

  const startTimerRef = React.useRef<number | null>(null)
  const queueRef = React.useRef<string[]>([])
  const activeRef = React.useRef(0)
  const runningRef = React.useRef(new Set<string>())

  function setItem(id: string, patch: Partial<Item>) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)))
  }

  function clearAll() {
    setItems((prev) => {
      for (const i of prev) {
        URL.revokeObjectURL(i.originalUrl)
        if (i.previewUrl) URL.revokeObjectURL(i.previewUrl)
        if (i.outputUrl) URL.revokeObjectURL(i.outputUrl)
      }
      return []
    })
    queueRef.current = []
    runningRef.current = new Set()
    activeRef.current = 0
  }

  function enqueue(ids: string[]) {
    for (const id of ids) {
      if (runningRef.current.has(id)) continue
      if (queueRef.current.includes(id)) continue
      queueRef.current.push(id)
    }
    void drain()
  }

  async function drain() {
    if (activeRef.current >= 2) return
    const nextId = queueRef.current.shift()
    if (!nextId) return
    if (runningRef.current.has(nextId)) return
    runningRef.current.add(nextId)
    activeRef.current += 1
    try {
      await runPipeline(nextId)
    } finally {
      runningRef.current.delete(nextId)
      activeRef.current -= 1
      void drain()
    }
  }

  async function runPipeline(id: string) {
    const item = itemsRef.current.get(id)
    if (!item) return
    const startedAt = Date.now()
    setItem(id, { phase: "uploading", startedAt, issues: "unknown" })

    const detectionPromise = detectFace(item.file).catch(() => null)
    const analysisPromise = (async () => {
      const det = await detectionPromise
      return await analyzeInWorker({ file: item.file, detection: det })
    })()

    await sleep(800)
    setItem(id, { phase: "analyzing" })

    let analysis: DvAnalysis | null = null
    const analyzeStart = Date.now()
    try {
      analysis = await analysisPromise
    } catch (e) {
      setItem(id, { phase: "error", error: e instanceof Error ? e.message : "Analyze failed" })
      return
    }
    const analyzeElapsed = Date.now() - analyzeStart
    if (analyzeElapsed < 3500) await sleep(3500 - analyzeElapsed)

    const o = overall(analysis.checklist)
    const issues = o === "pass" ? "none" : "some"
    setItem(id, { phase: "issues", issues, analysis })
    await sleep(2000)

    setItem(id, { phase: "fixing" })
    const fixStart = Date.now()

    let previewUrl: string | undefined
    let lastPreviewUrl: string | undefined
    try {
      const det = await detectionPromise
      const res = await fixInWorker({
        file: item.file,
        options: OPTIONS,
        detection: det,
        onPreview: (p) => {
          const u = URL.createObjectURL(p.blob)
          previewUrl = u
          setItems((prev) =>
            prev.map((it) => {
              if (it.id !== id) return it
              const next: Item = { ...it, previewUrl: u, displayBytes: p.bytes }
              return next
            }),
          )
          if (lastPreviewUrl) URL.revokeObjectURL(lastPreviewUrl)
          lastPreviewUrl = u
        },
      })

      const outputUrl = URL.createObjectURL(res.blob)
      setItems((prev) =>
        prev.map((it) => {
          if (it.id !== id) return it
          return {
            ...it,
            outputBlob: res.blob,
            outputUrl,
            displayBytes: res.blob.size,
            analysis: res.analysis,
          }
        }),
      )

      if (lastPreviewUrl && lastPreviewUrl !== outputUrl) URL.revokeObjectURL(lastPreviewUrl)

      const fixElapsed = Date.now() - fixStart
      if (fixElapsed < 10_000) await sleep(10_000 - fixElapsed)

      setItem(id, { phase: "finalizing" })
      await sleep(10_000)

      setItem(id, { phase: "ready" })
      play()
    } catch (e) {
      const fixElapsed = Date.now() - fixStart
      if (fixElapsed < 10_000) await sleep(10_000 - fixElapsed)
      setItem(id, { phase: "error", error: e instanceof Error ? e.message : "Fix failed" })
    }
  }

  const itemsRef = React.useRef(new Map<string, Item>())
  React.useEffect(() => {
    itemsRef.current = new Map(items.map((i) => [i.id, i]))
  }, [items])

  function scheduleAutoStart() {
    if (startTimerRef.current) window.clearTimeout(startTimerRef.current)
    startTimerRef.current = window.setTimeout(() => {
      const ids = Array.from(itemsRef.current.values())
        .filter((i) => i.phase === "queued")
        .map((i) => i.id)
      if (ids.length) enqueue(ids)
    }, 1000)
  }

  function onFiles(files: FileList | null) {
    if (!files) return
    unlock()
    const incoming = Array.from(files).slice(0, 10)
    const added: Item[] = incoming.map((file) => {
      const id = `${file.name}-${file.size}-${file.lastModified}-${Math.random().toString(16).slice(2)}`
      const originalUrl = URL.createObjectURL(file)
      return {
        id,
        file,
        fileName: file.name,
        originalBytes: file.size,
        displayBytes: file.size,
        originalUrl,
        phase: "queued",
        issues: "unknown",
      }
    })
    setItems((prev) => [...added, ...prev])
    scheduleAutoStart()
  }

  function canDownloadFree() {
    const g = getEmailGateState()
    return g.consented || g.downloadCount < 1
  }

  function allReady() {
    return items.length > 0 && items.every((i) => i.phase === "ready" && i.outputBlob)
  }

  async function runZipDownload() {
    if (!allReady()) return
    if (!canDownloadFree()) {
      pendingZipRef.current = true
      setGateOpen(true)
      return
    }
    const entries: Record<string, Uint8Array> = {}
    const sorted = [...items].reverse()
    for (let idx = 0; idx < sorted.length; idx++) {
      const blob = sorted[idx].outputBlob
      if (!blob) continue
      const ab = await blob.arrayBuffer()
      entries[`dv-photo-${idx + 1}.jpg`] = new Uint8Array(ab)
    }
    const zipBytes = zipSync(entries, { level: 6 })
    const zipBlob = new Blob([Uint8Array.from(zipBytes)], { type: "application/zip" })
    downloadBlob(zipBlob, "dv-photos.zip")
    recordSuccessfulDownload()
  }

  function handleConsented() {
    if (pendingZipRef.current) {
      pendingZipRef.current = false
      void runZipDownload()
    }
  }

  return (
    <div className="space-y-8">
      <EmailGateModal open={gateOpen} onOpenChange={setGateOpen} locale={locale} onConsented={handleConsented} />

      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1">
            <h2 className="text-[20px] font-semibold leading-tight text-slate-900">Upload photos</h2>
            <p className="max-w-2xl text-[15px] leading-7 text-slate-700">
              Upload 1–10 photos. Processing starts automatically. Each photo is formatted locally using safe transforms
              only.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept="image/*"
              multiple
              className="block w-full max-w-[360px] text-base text-slate-800 file:mr-4 file:rounded-lg file:border-0 file:bg-blue-700 file:px-5 file:py-3 file:text-base file:font-semibold file:text-white hover:file:bg-blue-800"
              onChange={(e) => onFiles(e.target.files)}
            />
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence initial={false}>
          {items.map((item) => {
            const shown = item.outputUrl ?? item.previewUrl ?? item.originalUrl
            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="space-y-3"
              >
                <div className="rounded-[12px] border border-[#e5e5e5] bg-[#f5f5f5] p-4">
                  <div className="relative aspect-square overflow-hidden rounded-[10px] bg-white">
                    <img src={shown} alt={item.fileName} className="absolute inset-0 h-full w-full object-contain" />
                    <OverlayGuides overlay={item.analysis?.overlay} />
                  </div>
                </div>

                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-[13px] text-slate-700">{item.fileName}</div>
                    <div className="text-[13px] text-slate-600">{kb(item.displayBytes)} kB</div>
                    {item.error ? <div className="mt-1 text-[13px] text-red-700">{item.error}</div> : null}
                  </div>
                  <AnimatePresence mode="popLayout" initial={false}>
                    <motion.div
                      key={`${item.id}-${item.phase}-${item.issues}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.18 }}
                      className="shrink-0"
                    >
                      <StatusBadge phase={item.phase} issues={item.issues} />
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-[15px] text-slate-700">
          {items.length ? (
            <span>
              {items.filter((i) => i.phase === "ready").length}/{items.length} ready
            </span>
          ) : (
            <span>Upload photos to begin.</span>
          )}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="button" size="lg" disabled={!allReady()} onClick={() => void runZipDownload()}>
            <Download className="h-4 w-4" />
            Download ZIP
          </Button>
          <Button type="button" size="lg" variant="outline" disabled={!items.length} onClick={clearAll}>
            <Trash2 className="h-4 w-4" />
            Clear all
          </Button>
        </div>
      </div>
    </div>
  )
}
