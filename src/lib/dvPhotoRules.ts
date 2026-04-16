export const DV_RULES = {
  targetSize: {
    width: 600,
    height: 600,
    maxBytes: 239 * 1024,
  },
  background: {
    minLightnessAvg: 0.78,
    maxLightnessStdDev: 0.14,
  },
  face: {
    centerTolerance: 0.16,
    minHeadRatio: 0.34,
    maxHeadRatio: 0.62,
    maxTiltDeg: 8,
  },
} as const

export type ChecklistStatus = "pass" | "warn" | "fail"

export type ChecklistItem = {
  id:
    | "square"
    | "dimensions"
    | "fileSize"
    | "color"
    | "background"
    | "faceDetected"
    | "centered"
    | "headSize"
    | "headroom"
    | "headNotCutOff"
    | "lighting"
    | "tilt"
    | "glasses"
    | "retouch"
  label: string
  status: ChecklistStatus
  detail?: string
}

export type FaceDetection = {
  box: { x: number; y: number; w: number; h: number }
  confidence: number
  tiltDeg?: number
  landmarks?: {
    leftEye?: { x: number; y: number }
    rightEye?: { x: number; y: number }
    chin?: { x: number; y: number }
    foreheadTop?: { x: number; y: number }
  }
}

export type DvAnalysis = {
  input: {
    width: number
    height: number
    bytes: number
    type: string
    name: string
  }
  metrics: {
    aspect: number
    isSquareish: boolean
    backgroundLightnessAvg: number
    backgroundLightnessStdDev: number
    faceDetected: boolean
    faceCenterX: number
    faceCenterY: number
    headRatio: number
    topHeadroomRatio: number
    headTopClippedRisk: number
    tiltDeg: number
    blurRisk: number
  }
  overlay?: {
    faceBox?: { x: number; y: number; w: number; h: number }
    leftEye?: { x: number; y: number }
    rightEye?: { x: number; y: number }
    chin?: { x: number; y: number }
    headTopY?: number
  }
  checklist: ChecklistItem[]
  notes: string[]
}

export type DvFixOptions = {
  cropToSquare: boolean
  straighten: boolean
  compressToMaxBytes: boolean
  removeMetadata: boolean
}
