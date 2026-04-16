export type ImageBitmapSourceFile = File

export async function readImageBitmap(file: ImageBitmapSourceFile) {
  return await createImageBitmap(file)
}

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n))
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export function degToRad(deg: number) {
  return (deg * Math.PI) / 180
}

export function radToDeg(rad: number) {
  return (rad * 180) / Math.PI
}

export function computeStdDev(values: number[]) {
  if (values.length === 0) return 0
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const variance = values.reduce((acc, v) => acc + (v - mean) ** 2, 0) / values.length
  return Math.sqrt(variance)
}

export function rgbaToLuma(r: number, g: number, b: number) {
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
}

export function hasCanvas2D(ctx: CanvasRenderingContext2D | null): ctx is CanvasRenderingContext2D {
  return Boolean(ctx)
}

