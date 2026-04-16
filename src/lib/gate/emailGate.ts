const KEY = "dvpf:lead-consent:v1"

type GateStore = {
  consented: boolean
  downloadCount: number
  consentedAt?: string
}

function readStore(): GateStore {
  if (typeof window === "undefined") return { consented: false, downloadCount: 0 }
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return { consented: false, downloadCount: 0 }
    const parsed = JSON.parse(raw) as Partial<GateStore>
    return {
      consented: Boolean(parsed.consented),
      downloadCount: typeof parsed.downloadCount === "number" ? parsed.downloadCount : 0,
      consentedAt: typeof parsed.consentedAt === "string" ? parsed.consentedAt : undefined,
    }
  } catch {
    return { consented: false, downloadCount: 0 }
  }
}

function writeStore(next: GateStore) {
  if (typeof window === "undefined") return
  window.localStorage.setItem(KEY, JSON.stringify(next))
  window.dispatchEvent(new Event("dvpf:gate"))
}

export function getEmailGateState() {
  const s = readStore()
  return {
    consented: s.consented,
    downloadCount: s.downloadCount,
    freeDownloadsRemaining: s.consented ? Infinity : Math.max(0, 1 - s.downloadCount),
  }
}

export function recordSuccessfulDownload() {
  const s = readStore()
  writeStore({ ...s, downloadCount: s.downloadCount + 1 })
}

export function recordEmailConsent() {
  const s = readStore()
  writeStore({ ...s, consented: true, consentedAt: new Date().toISOString() })
}
