type ChecklistStatus = "pass" | "warn" | "fail"

type ChecklistItem = {
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

type DvAnalysis = {
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

type FaceDetection = {
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

type DvFixOptions = {
  cropToSquare: boolean
  straighten: boolean
  compressToMaxBytes: boolean
  removeMetadata: boolean
}

type WorkerRequest =
  | {
      type: "analyze"
      payload: { file: File; detection?: FaceDetection | null }
    }
  | {
      type: "fix"
      payload: { file: File; options: DvFixOptions; detection?: FaceDetection | null }
    }

type WorkerResponse =
  | { type: "analyze-result"; payload: { analysis: DvAnalysis } }
  | { type: "fix-preview"; payload: { blob: Blob; bytes: number } }
  | { type: "fix-result"; payload: { blob: Blob; analysis: DvAnalysis } }
  | { type: "error"; payload: { message: string } }
  | { type: "progress"; payload: { stage: string; value: number } }

const DV_RULES = {
  target: { width: 600, height: 600, maxBytes: 239 * 1024 },
  background: { minLightnessAvg: 0.78, maxLightnessStdDev: 0.14 },
  face: {
    centerTolerance: 0.16,
    minHeadRatio: 0.34,
    maxHeadRatio: 0.62,
    maxTiltDeg: 8,
  },
  crop: {
    targetHeadRatio: 0.5,
    topPaddingRatio: 0.14,
    headTopFromFaceBox: 0.65,
    headBottomFromFaceBox: 2.15,
  },
} as const

function post(msg: WorkerResponse) {
  ;(self as unknown as Worker).postMessage(msg)
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

function rgbaToLuma(r: number, g: number, b: number) {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
}

function computeStdDev(values: number[]) {
  if (values.length === 0) return 0
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const variance = values.reduce((acc, v) => acc + (v - mean) ** 2, 0) / values.length
  return Math.sqrt(variance)
}

async function decodeBitmap(file: File) {
  return await createImageBitmap(file)
}

function makeOffscreen(w: number, h: number) {
  const c = new OffscreenCanvas(w, h)
  const ctx = c.getContext("2d", { willReadFrequently: true })
  if (!ctx) throw new Error("Canvas 2D not available")
  return { c, ctx }
}

function sampleBackgroundMetrics(imgData: ImageData) {
  const { data, width, height } = imgData
  const samples: number[] = []

  const marginX = Math.floor(width * 0.08)
  const marginY = Math.floor(height * 0.08)
  const step = Math.max(4, Math.floor(Math.min(width, height) / 80))

  function pushSample(x: number, y: number) {
    const idx = (y * width + x) * 4
    samples.push(rgbaToLuma(data[idx], data[idx + 1], data[idx + 2]))
  }

  for (let x = marginX; x < width - marginX; x += step) {
    pushSample(x, marginY)
    pushSample(x, height - marginY - 1)
  }
  for (let y = marginY; y < height - marginY; y += step) {
    pushSample(marginX, y)
    pushSample(width - marginX - 1, y)
  }

  const avg = samples.reduce((a, b) => a + b, 0) / Math.max(1, samples.length)
  const std = computeStdDev(samples)
  return { avg, std }
}

function estimateFaceFallback(imgData: ImageData): FaceDetection | null {
  const { data, width, height } = imgData
  const step = Math.max(3, Math.floor(Math.min(width, height) / 120))
  const centerX = width / 2
  const centerY = height / 2

  let minX = width,
    minY = height,
    maxX = 0,
    maxY = 0,
    count = 0

  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const idx = (y * width + x) * 4
      const r = data[idx]
      const g = data[idx + 1]
      const b = data[idx + 2]
      const l = rgbaToLuma(r, g, b)
      const dist = Math.hypot((x - centerX) / width, (y - centerY) / height)

      const isSkinish = r > 95 && g > 40 && b > 20 && r > g && r > b && r - g > 10 && l > 0.2 && l < 0.9
      if (isSkinish && dist < 0.48) {
        minX = Math.min(minX, x)
        minY = Math.min(minY, y)
        maxX = Math.max(maxX, x)
        maxY = Math.max(maxY, y)
        count++
      }
    }
  }

  if (count < 40) {
    return null
  }

  const boxW = Math.max(1, maxX - minX)
  const boxH = Math.max(1, maxY - minY)
  return {
    box: {
      x: clamp(minX / width, 0, 1),
      y: clamp(minY / height, 0, 1),
      w: clamp(boxW / width, 0, 1),
      h: clamp(boxH / height, 0, 1),
    },
    confidence: 0.45,
  }
}

function estimateBlurRisk(imgData: ImageData) {
  const { data, width, height } = imgData
  const step = Math.max(2, Math.floor(Math.min(width, height) / 140))
  let sum = 0
  let n = 0

  for (let y = step; y < height - step; y += step) {
    for (let x = step; x < width - step; x += step) {
      const idx = (y * width + x) * 4
      const idxR = (y * width + (x + step)) * 4
      const idxD = ((y + step) * width + x) * 4
      const l = rgbaToLuma(data[idx], data[idx + 1], data[idx + 2])
      const lR = rgbaToLuma(data[idxR], data[idxR + 1], data[idxR + 2])
      const lD = rgbaToLuma(data[idxD], data[idxD + 1], data[idxD + 2])
      sum += Math.abs(l - lR) + Math.abs(l - lD)
      n++
    }
  }

  const avgGrad = sum / Math.max(1, n)
  return clamp(1 - avgGrad * 6, 0, 1)
}

function buildChecklist(args: {
  w: number
  h: number
  bytes: number
  type: string
  bgAvg: number
  bgStd: number
  faceDetected: boolean
  cx: number
  cy: number
  headRatio: number
  topHeadroomRatio: number
  headTopClippedRisk: number
  tiltDeg: number
}) {
  const items: ChecklistItem[] = []
  const aspect = args.w / args.h
  const isSquare = Math.abs(aspect - 1) < 0.02
  const isTargetDim = args.w === DV_RULES.target.width && args.h === DV_RULES.target.height
  const sizeOk = args.bytes <= DV_RULES.target.maxBytes

  const centered =
    Math.abs(args.cx - 0.5) <= DV_RULES.face.centerTolerance &&
    Math.abs(args.cy - 0.45) <= DV_RULES.face.centerTolerance

  const headOk = args.headRatio >= DV_RULES.face.minHeadRatio && args.headRatio <= DV_RULES.face.maxHeadRatio

  const headroomOk = args.topHeadroomRatio >= 0.03
  const headNotCutOff = args.headTopClippedRisk < 0.5

  const backgroundOk = args.bgAvg >= DV_RULES.background.minLightnessAvg && args.bgStd <= DV_RULES.background.maxLightnessStdDev

  items.push({ id: "square", label: "Square format", status: isSquare ? "pass" : "fail", detail: `Aspect ratio: ${aspect.toFixed(3)}` })
  items.push({ id: "dimensions", label: "Output size 600×600", status: isTargetDim ? "pass" : "warn", detail: `${args.w}×${args.h}px` })
  items.push({ id: "fileSize", label: "File size ≤ 239 kB", status: sizeOk ? "pass" : "warn", detail: `${Math.round(args.bytes / 1024)} kB` })
  items.push({ id: "color", label: "Color image", status: "pass" })
  items.push({
    id: "background",
    label: "White/off-white background",
    status: backgroundOk ? "pass" : "warn",
    detail: `Lightness avg ${args.bgAvg.toFixed(2)}, variation ${args.bgStd.toFixed(2)}`,
  })
  items.push({
    id: "faceDetected",
    label: "Face detected",
    status: args.faceDetected ? "pass" : "warn",
    detail: args.faceDetected ? "Using face detection for centering" : "Face detection uncertain; alignment may be approximate",
  })
  items.push({ id: "centered", label: "Centered face", status: centered ? "pass" : "warn", detail: `Center (x=${args.cx.toFixed(2)}, y=${args.cy.toFixed(2)})` })
  items.push({ id: "headSize", label: "Head size estimate", status: headOk ? "pass" : "warn", detail: `Head height ≈ ${(args.headRatio * 100).toFixed(0)}%` })
  items.push({
    id: "headNotCutOff",
    label: "Head not cut off",
    status: headNotCutOff ? "pass" : "fail",
    detail: headNotCutOff ? "Top of head appears inside the frame" : "Risk: top of head/hair may be clipped",
  })
  items.push({
    id: "headroom",
    label: "Enough top headroom",
    status: headroomOk ? "pass" : "warn",
    detail: `Estimated top headroom ≈ ${(args.topHeadroomRatio * 100).toFixed(0)}% of image height`,
  })
  items.push({ id: "tilt", label: "Rotation / tilt", status: Math.abs(args.tiltDeg) <= DV_RULES.face.maxTiltDeg ? "pass" : "warn", detail: `${args.tiltDeg.toFixed(1)}°` })
  items.push({ id: "lighting", label: "Lighting and shadows", status: backgroundOk ? "pass" : "warn", detail: "Heuristic check based on background uniformity" })
  items.push({ id: "glasses", label: "Glasses warning", status: "warn", detail: "If you wear glasses, retake without." })
  items.push({ id: "retouch", label: "No excessive retouching", status: "warn", detail: "Avoid edits that change appearance." })

  return items
}

function toPx(det: FaceDetection, w: number, h: number) {
  return {
    x: det.box.x * w,
    y: det.box.y * h,
    w: det.box.w * w,
    h: det.box.h * h,
  }
}

function estimateHeadFromFaceBox(face: { x: number; y: number; w: number; h: number }) {
  const headTop = face.y - face.h * DV_RULES.crop.headTopFromFaceBox
  const headBottom = face.y + face.h * DV_RULES.crop.headBottomFromFaceBox
  const headHeight = Math.max(1, headBottom - headTop)
  return { headTop, headBottom, headHeight }
}

async function analyze(file: File, detectionInput?: FaceDetection | null): Promise<DvAnalysis> {
  post({ type: "progress", payload: { stage: "decode", value: 0.2 } })
  const bmp = await decodeBitmap(file)

  post({ type: "progress", payload: { stage: "draw", value: 0.35 } })
  const { ctx } = makeOffscreen(bmp.width, bmp.height)
  ctx.drawImage(bmp, 0, 0)
  const img = ctx.getImageData(0, 0, bmp.width, bmp.height)

  post({ type: "progress", payload: { stage: "metrics", value: 0.6 } })
  const bg = sampleBackgroundMetrics(img)
  const detection = detectionInput ?? estimateFaceFallback(img)
  const faceDetected = Boolean(detection && detection.confidence >= 0.4)
  const faceBoxPx = detection ? toPx(detection, bmp.width, bmp.height) : { x: bmp.width * 0.3, y: bmp.height * 0.22, w: bmp.width * 0.4, h: bmp.height * 0.28 }
  const faceCenterX = (faceBoxPx.x + faceBoxPx.w / 2) / bmp.width
  const faceCenterY = (faceBoxPx.y + faceBoxPx.h / 2) / bmp.height
  const chinY = detection?.landmarks?.chin ? detection.landmarks.chin.y * bmp.height : faceBoxPx.y + faceBoxPx.h * 0.98
  const foreheadY = detection?.landmarks?.foreheadTop ? detection.landmarks.foreheadTop.y * bmp.height : faceBoxPx.y + faceBoxPx.h * 0.06
  const headTopY = Math.min(foreheadY - faceBoxPx.h * 0.18, faceBoxPx.y - faceBoxPx.h * 0.12)
  const headHeight = Math.max(1, chinY - headTopY)
  const headRatio = clamp(headHeight / bmp.height, 0.2, 0.95)
  const topHeadroomRatio = clamp(headTopY / bmp.height, 0, 1)
  const headTopClippedRisk = headTopY < 0 ? 1 : 0
  const tiltDeg = detection?.tiltDeg ?? 0
  const blurRisk = estimateBlurRisk(img)

  const checklist = buildChecklist({
    w: bmp.width,
    h: bmp.height,
    bytes: file.size,
    type: file.type,
    bgAvg: bg.avg,
    bgStd: bg.std,
    faceDetected,
    cx: faceCenterX,
    cy: faceCenterY,
    headRatio,
    topHeadroomRatio,
    headTopClippedRisk,
    tiltDeg,
  })

  const notes: string[] = []
  if (blurRisk > 0.65) notes.push("High blur risk: consider retaking the photo with better focus.")
  if (bg.avg < DV_RULES.background.minLightnessAvg) notes.push("Background may be too dark. Prefer white/off-white.")
  if (bg.std > DV_RULES.background.maxLightnessStdDev) notes.push("Background may be uneven or textured.")
  if (!faceDetected) notes.push("Face detection is uncertain. Centering and head size checks may be approximate.")
  if (headTopClippedRisk > 0.5) notes.push("Top of head may already be clipped in the original photo. Retaking is recommended.")

  post({ type: "progress", payload: { stage: "done", value: 1 } })

  return {
    input: {
      width: bmp.width,
      height: bmp.height,
      bytes: file.size,
      type: file.type,
      name: file.name,
    },
    metrics: {
      aspect: bmp.width / bmp.height,
      isSquareish: Math.abs(bmp.width / bmp.height - 1) < 0.02,
      backgroundLightnessAvg: bg.avg,
      backgroundLightnessStdDev: bg.std,
      faceDetected,
      faceCenterX,
      faceCenterY,
      headRatio,
      topHeadroomRatio,
      headTopClippedRisk,
      tiltDeg,
      blurRisk,
    },
    overlay: detection
      ? {
          faceBox: {
            x: faceBoxPx.x / bmp.width,
            y: faceBoxPx.y / bmp.height,
            w: faceBoxPx.w / bmp.width,
            h: faceBoxPx.h / bmp.height,
          },
          leftEye: detection.landmarks?.leftEye,
          rightEye: detection.landmarks?.rightEye,
          chin: detection.landmarks?.chin,
          headTopY: headTopY / bmp.height,
        }
      : undefined,
    checklist,
    notes,
  }
}

async function encodeJpegAdaptive(canvas: OffscreenCanvas, maxBytes: number) {
  const qualities = [0.92, 0.9, 0.88, 0.86, 0.84, 0.82, 0.8]
  let blob: Blob | null = null
  for (const q of qualities) {
    blob = await canvas.convertToBlob({ type: "image/jpeg", quality: q })
    if (blob.size <= maxBytes) return { blob, quality: q, exceeded: false }
  }

  let q = 0.79
  blob = await canvas.convertToBlob({ type: "image/jpeg", quality: q })
  while (blob.size > maxBytes && q > 0.7) {
    q = Math.max(0.7, q - 0.02)
    blob = await canvas.convertToBlob({ type: "image/jpeg", quality: q })
  }
  return { blob, quality: q, exceeded: blob.size > maxBytes }
}

function sampleCanvasFillColor(bmp: ImageBitmap) {
  const s = makeOffscreen(16, 16)
  s.ctx.drawImage(bmp, 0, 0, 16, 16)
  const img = s.ctx.getImageData(0, 0, 16, 16)
  const d = img.data
  const pts = [
    0,
    (16 - 1) * 4,
    (16 * (16 - 1)) * 4,
    (16 * (16 - 1) + (16 - 1)) * 4,
  ]
  let r = 0
  let g = 0
  let b = 0
  for (const p of pts) {
    r += d[p]
    g += d[p + 1]
    b += d[p + 2]
  }
  return { r: Math.round(r / pts.length), g: Math.round(g / pts.length), b: Math.round(b / pts.length) }
}

function toPxPoint(p: { x: number; y: number } | undefined, w: number, h: number) {
  if (!p) return null
  return { x: p.x * w, y: p.y * h }
}

function computeReframeParams(args: {
  bmpW: number
  bmpH: number
  faceBox: { x: number; y: number; w: number; h: number }
  leftEye: { x: number; y: number }
  rightEye: { x: number; y: number }
  chin: { x: number; y: number }
  foreheadTop: { x: number; y: number }
  straighten: boolean
  tiltDeg: number
}) {
  const W = DV_RULES.target.width
  const H = DV_RULES.target.height
  const sideMargin = 34
  const topMargin = 28
  const bottomMargin = 70
  const shoulderPadFactor = 0.35
  const targetHeadRatio = 0.6
  const eyeRange = { min: H * (1 - 0.65), max: H * (1 - 0.55), preferred: H * (1 - 0.6) }

  const eyeC = { x: (args.leftEye.x + args.rightEye.x) / 2, y: (args.leftEye.y + args.rightEye.y) / 2 }
  const headTopY = Math.min(args.foreheadTop.y, args.faceBox.y + args.faceBox.h * 0.06)
  const chinY = Math.max(args.chin.y, args.faceBox.y + args.faceBox.h * 0.98)
  const headHeight = Math.max(1, chinY - headTopY)
  let scale = (H * targetHeadRatio) / headHeight

  const tiltRad = args.straighten && Math.abs(args.tiltDeg) <= DV_RULES.face.maxTiltDeg ? (-args.tiltDeg * Math.PI) / 180 : 0
  const cos = Math.cos(tiltRad)
  const sin = Math.sin(tiltRad)

  function transform(x: number, y: number, eyeTargetX: number, eyeTargetY: number, s: number) {
    const dx = (x - eyeC.x) * s
    const dy = (y - eyeC.y) * s
    const rx = dx * cos - dy * sin
    const ry = dx * sin + dy * cos
    return { x: eyeTargetX + rx, y: eyeTargetY + ry }
  }

  const eyeTargetX = W / 2

  for (let i = 0; i < 14; i += 1) {
    const y2HeadTop = transform(eyeC.x, headTopY, 0, 0, scale).y
    const y2Shoulder = transform(eyeC.x, chinY + headHeight * shoulderPadFactor, 0, 0, scale).y
    const x2FaceLeft = transform(args.faceBox.x, eyeC.y, 0, 0, scale).x
    const x2FaceRight = transform(args.faceBox.x + args.faceBox.w, eyeC.y, 0, 0, scale).x

    const minEyeY = Math.max(eyeRange.min, topMargin - y2HeadTop)
    const maxEyeY = Math.min(eyeRange.max, (H - bottomMargin) - y2Shoulder)

    const xMin = sideMargin - x2FaceLeft
    const xMax = (W - sideMargin) - x2FaceRight

    const xOk = eyeTargetX >= xMin && eyeTargetX <= xMax
    const yOk = minEyeY <= maxEyeY
    if (xOk && yOk) {
      const eyeTargetY = clamp(eyeRange.preferred, minEyeY, maxEyeY)
      return { scale, tiltRad, eyeTargetX, eyeTargetY, headTopY, chinY }
    }
    scale *= 0.96
  }

  return { scale, tiltRad, eyeTargetX, eyeTargetY: eyeRange.preferred, headTopY, chinY }
}

async function fix(file: File, options: DvFixOptions, detectionInput?: FaceDetection | null) {
  const inputAnalysis = await analyze(file, detectionInput)
  post({ type: "progress", payload: { stage: "reframe", value: 0.2 } })

  const bmp = await decodeBitmap(file)
  let detection = detectionInput ?? null
  if (!detection) {
    const { ctx } = makeOffscreen(bmp.width, bmp.height)
    ctx.drawImage(bmp, 0, 0)
    const img = ctx.getImageData(0, 0, bmp.width, bmp.height)
    detection = estimateFaceFallback(img)
  }

  const faceBox = detection ? toPx(detection, bmp.width, bmp.height) : { x: bmp.width * 0.3, y: bmp.height * 0.22, w: bmp.width * 0.4, h: bmp.height * 0.28 }
  const leftEye =
    toPxPoint(detection?.landmarks?.leftEye, bmp.width, bmp.height) ??
    { x: faceBox.x + faceBox.w * 0.33, y: faceBox.y + faceBox.h * 0.42 }
  const rightEye =
    toPxPoint(detection?.landmarks?.rightEye, bmp.width, bmp.height) ??
    { x: faceBox.x + faceBox.w * 0.67, y: faceBox.y + faceBox.h * 0.42 }
  const chin =
    toPxPoint(detection?.landmarks?.chin, bmp.width, bmp.height) ??
    { x: faceBox.x + faceBox.w * 0.5, y: faceBox.y + faceBox.h * 0.98 }
  const foreheadTop =
    toPxPoint(detection?.landmarks?.foreheadTop, bmp.width, bmp.height) ??
    { x: faceBox.x + faceBox.w * 0.5, y: faceBox.y + faceBox.h * 0.06 }

  const params = computeReframeParams({
    bmpW: bmp.width,
    bmpH: bmp.height,
    faceBox,
    leftEye,
    rightEye,
    chin,
    foreheadTop,
    straighten: options.straighten,
    tiltDeg: detection?.tiltDeg ?? inputAnalysis.metrics.tiltDeg,
  })

  const eyeC = { x: (leftEye.x + rightEye.x) / 2, y: (leftEye.y + rightEye.y) / 2 }
  const fill = sampleCanvasFillColor(bmp)

  const out = makeOffscreen(DV_RULES.target.width, DV_RULES.target.height)
  out.ctx.imageSmoothingEnabled = true
  out.ctx.imageSmoothingQuality = "high"
  out.ctx.fillStyle = `rgb(${fill.r}, ${fill.g}, ${fill.b})`
  out.ctx.fillRect(0, 0, DV_RULES.target.width, DV_RULES.target.height)

  out.ctx.save()
  out.ctx.translate(params.eyeTargetX, params.eyeTargetY)
  out.ctx.rotate(params.tiltRad)
  out.ctx.scale(params.scale, params.scale)
  out.ctx.translate(-eyeC.x, -eyeC.y)
  out.ctx.drawImage(bmp, 0, 0)
  out.ctx.restore()

  post({ type: "progress", payload: { stage: "encode", value: 0.7 } })

  try {
    const previewBlob = await out.c.convertToBlob({ type: "image/jpeg", quality: 0.9 })
    post({ type: "fix-preview", payload: { blob: previewBlob, bytes: previewBlob.size } })
  } catch {
  }

  const encoded = options.compressToMaxBytes
    ? await encodeJpegAdaptive(out.c, DV_RULES.target.maxBytes)
    : { blob: await out.c.convertToBlob({ type: "image/jpeg", quality: 0.92 }), quality: 0.92, exceeded: false }
  const blob = encoded.blob

  post({ type: "progress", payload: { stage: "done", value: 1 } })

  const cos = Math.cos(params.tiltRad)
  const sin = Math.sin(params.tiltRad)
  const transform = (x: number, y: number) => {
    const dx = (x - eyeC.x) * params.scale
    const dy = (y - eyeC.y) * params.scale
    const rx = dx * cos - dy * sin
    const ry = dx * sin + dy * cos
    return { x: params.eyeTargetX + rx, y: params.eyeTargetY + ry }
  }

  const faceCorners = [
    transform(faceBox.x, faceBox.y),
    transform(faceBox.x + faceBox.w, faceBox.y),
    transform(faceBox.x, faceBox.y + faceBox.h),
    transform(faceBox.x + faceBox.w, faceBox.y + faceBox.h),
  ]
  const faceMinX = clamp(Math.min(...faceCorners.map((p) => p.x)), 0, DV_RULES.target.width)
  const faceMaxX = clamp(Math.max(...faceCorners.map((p) => p.x)), 0, DV_RULES.target.width)
  const faceMinY = clamp(Math.min(...faceCorners.map((p) => p.y)), 0, DV_RULES.target.height)
  const faceMaxY = clamp(Math.max(...faceCorners.map((p) => p.y)), 0, DV_RULES.target.height)

  const leftEyeOut = transform(leftEye.x, leftEye.y)
  const rightEyeOut = transform(rightEye.x, rightEye.y)
  const chinOut = transform(chin.x, chin.y)
  const headTopOut = transform(eyeC.x, params.headTopY)

  const headRatio = clamp((chinOut.y - headTopOut.y) / DV_RULES.target.height, 0.2, 0.95)
  const topHeadroomRatio = clamp(headTopOut.y / DV_RULES.target.height, 0, 1)
  const headTopClippedRisk = headTopOut.y < 0 ? 1 : 0
  const faceCenterX = clamp((faceMinX + faceMaxX) / 2 / DV_RULES.target.width, 0, 1)
  const faceCenterY = clamp((faceMinY + faceMaxY) / 2 / DV_RULES.target.height, 0, 1)

  const outImg = out.ctx.getImageData(0, 0, DV_RULES.target.width, DV_RULES.target.height)
  const bg = sampleBackgroundMetrics(outImg)
  const blurRisk = estimateBlurRisk(outImg)
  const tiltDeg = (-params.tiltRad * 180) / Math.PI

  const checklist = buildChecklist({
    w: DV_RULES.target.width,
    h: DV_RULES.target.height,
    bytes: blob.size,
    type: "image/jpeg",
    bgAvg: bg.avg,
    bgStd: bg.std,
    faceDetected: inputAnalysis.metrics.faceDetected,
    cx: faceCenterX,
    cy: faceCenterY,
    headRatio,
    topHeadroomRatio,
    headTopClippedRisk,
    tiltDeg,
  })

  const notes = [
    "Output is generated using safe transforms only: scale, reframe (eyes anchor), straighten (optional), and JPEG compression.",
    encoded.exceeded ? "Could not reach target file size without heavy quality loss." : `JPEG quality used: ${encoded.quality.toFixed(2)}`,
    ...inputAnalysis.notes,
  ]

  const analysis: DvAnalysis = {
    input: {
      width: DV_RULES.target.width,
      height: DV_RULES.target.height,
      bytes: blob.size,
      type: "image/jpeg",
      name: "dv-photo.jpg",
    },
    metrics: {
      aspect: 1,
      isSquareish: true,
      backgroundLightnessAvg: bg.avg,
      backgroundLightnessStdDev: bg.std,
      faceDetected: inputAnalysis.metrics.faceDetected,
      faceCenterX,
      faceCenterY,
      headRatio,
      topHeadroomRatio,
      headTopClippedRisk,
      tiltDeg,
      blurRisk,
    },
    overlay: {
      faceBox: {
        x: faceMinX / DV_RULES.target.width,
        y: faceMinY / DV_RULES.target.height,
        w: (faceMaxX - faceMinX) / DV_RULES.target.width,
        h: (faceMaxY - faceMinY) / DV_RULES.target.height,
      },
      leftEye: { x: leftEyeOut.x / DV_RULES.target.width, y: leftEyeOut.y / DV_RULES.target.height },
      rightEye: { x: rightEyeOut.x / DV_RULES.target.width, y: rightEyeOut.y / DV_RULES.target.height },
      chin: { x: chinOut.x / DV_RULES.target.width, y: chinOut.y / DV_RULES.target.height },
      headTopY: headTopOut.y / DV_RULES.target.height,
    },
    checklist,
    notes,
  }

  return { blob, analysis }
}

self.onmessage = async (ev: MessageEvent<WorkerRequest>) => {
  try {
    if (ev.data.type === "analyze") {
      const analysis = await analyze(ev.data.payload.file, ev.data.payload.detection)
      post({ type: "analyze-result", payload: { analysis } })
    }
    if (ev.data.type === "fix") {
      const { blob, analysis } = await fix(ev.data.payload.file, ev.data.payload.options, ev.data.payload.detection)
      post({ type: "fix-result", payload: { blob, analysis } })
    }
  } catch (e) {
    post({ type: "error", payload: { message: e instanceof Error ? e.message : "Unknown error" } })
  }
}
