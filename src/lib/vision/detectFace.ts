import type { FaceDetection } from "@/lib/dvPhotoRules"

type NormalizedLandmark = { x: number; y: number; z?: number }

let landmarkerPromise: Promise<
  | {
      detect: (bmp: ImageBitmap) => { faceLandmarks?: NormalizedLandmark[][] }
    }
  | null
> | null = null

async function getLandmarker() {
  if (landmarkerPromise) return await landmarkerPromise
  landmarkerPromise = (async () => {
    const mod = (await import("@mediapipe/tasks-vision")) as any
    const vision = await mod.FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.34/wasm",
    )
    const landmarker = await mod.FaceLandmarker.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath:
          "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
        delegate: "CPU",
      },
      runningMode: "IMAGE",
      numFaces: 1,
      outputFaceBlendshapes: false,
      outputFacialTransformationMatrixes: false,
    })
    return landmarker as any
  })()
  try {
    return await landmarkerPromise
  } catch {
    landmarkerPromise = null
    return null
  }
}

function avgPoints(points: Array<{ x: number; y: number }>) {
  if (!points.length) return null
  const sum = points.reduce(
    (acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }),
    { x: 0, y: 0 },
  )
  return { x: sum.x / points.length, y: sum.y / points.length }
}

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n))
}

function tiltDegFromEyes(left: { x: number; y: number } | undefined, right: { x: number; y: number } | undefined, w: number, h: number) {
  if (!left || !right) return 0
  const dx = (right.x - left.x) * w
  const dy = (right.y - left.y) * h
  if (dx === 0) return 0
  return (Math.atan2(dy, dx) * 180) / Math.PI
}

function landmarksToFaceDetection(landmarks: NormalizedLandmark[], w: number, h: number): FaceDetection {
  let minX = 1
  let maxX = 0
  let minY = 1
  let maxY = 0
  for (const p of landmarks) {
    minX = Math.min(minX, p.x)
    maxX = Math.max(maxX, p.x)
    minY = Math.min(minY, p.y)
    maxY = Math.max(maxY, p.y)
  }
  const box = {
    x: clamp01(minX),
    y: clamp01(minY),
    w: clamp01(maxX - minX),
    h: clamp01(maxY - minY),
  }

  const n = landmarks.length

  const leftIrisIdx = n >= 478 ? [468, 469, 470, 471, 472] : []
  const rightIrisIdx = n >= 478 ? [473, 474, 475, 476, 477] : []
  const leftEyeFallbackIdx = n > 133 ? [33, 133] : []
  const rightEyeFallbackIdx = n > 362 ? [362, 263] : []

  const leftEye =
    avgPoints(leftIrisIdx.map((i) => ({ x: landmarks[i].x, y: landmarks[i].y }))) ??
    avgPoints(leftEyeFallbackIdx.map((i) => ({ x: landmarks[i].x, y: landmarks[i].y }))) ??
    undefined

  const rightEye =
    avgPoints(rightIrisIdx.map((i) => ({ x: landmarks[i].x, y: landmarks[i].y }))) ??
    avgPoints(rightEyeFallbackIdx.map((i) => ({ x: landmarks[i].x, y: landmarks[i].y }))) ??
    undefined

  const chin = n > 152 ? { x: landmarks[152].x, y: landmarks[152].y } : undefined
  const foreheadTop = n > 10 ? { x: landmarks[10].x, y: landmarks[10].y } : undefined

  const tiltDeg = tiltDegFromEyes(leftEye, rightEye, w, h)

  return {
    box,
    confidence: 0.9,
    tiltDeg,
    landmarks: {
      leftEye,
      rightEye,
      chin,
      foreheadTop,
    },
  }
}

export async function detectFace(file: File): Promise<FaceDetection | null> {
  const bmp = await createImageBitmap(file)
  const w = bmp.width
  const h = bmp.height

  try {
    const mp = await getLandmarker()
    if (mp) {
      const res = mp.detect(bmp) as { faceLandmarks?: NormalizedLandmark[][] }
      const face = res.faceLandmarks?.[0]
      if (face && face.length) return landmarksToFaceDetection(face, w, h)
    }

    const FaceDetectorCtor = (globalThis as unknown as {
      FaceDetector?: new (opts?: unknown) => { detect: (img: ImageBitmap) => Promise<Array<{ boundingBox: { x: number; y: number; width: number; height: number } }>> }
    }).FaceDetector

    if (!FaceDetectorCtor) return null
    const detector = new FaceDetectorCtor({ fastMode: true, maxDetectedFaces: 1 })
    const faces = await detector.detect(bmp)
    const face = faces[0]
    if (!face) return null

    const b = face.boundingBox
    const x = clamp01(b.x / w)
    const y = clamp01(b.y / h)
    const bw = clamp01(b.width / w)
    const bh = clamp01(b.height / h)
    const leftEye = { x: x + bw * 0.33, y: y + bh * 0.42 }
    const rightEye = { x: x + bw * 0.67, y: y + bh * 0.42 }
    const chin = { x: x + bw * 0.5, y: y + bh * 0.98 }
    const foreheadTop = { x: x + bw * 0.5, y: y + bh * 0.06 }
    const tiltDeg = tiltDegFromEyes(leftEye, rightEye, w, h)
    return {
      box: { x, y, w: bw, h: bh },
      confidence: 0.65,
      tiltDeg,
      landmarks: { leftEye, rightEye, chin, foreheadTop },
    }
  } finally {
    bmp.close()
  }
}

