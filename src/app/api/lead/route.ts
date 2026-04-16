import { NextResponse } from "next/server"

function isValidEmail(email: unknown) {
  if (typeof email !== "string") return false
  const trimmed = email.trim()
  if (!trimmed) return false
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)
}

export async function POST(req: Request) {
  const json = await req.json().catch(() => null)
  if (!json || !isValidEmail((json as { email?: unknown }).email)) {
    return NextResponse.json({ ok: false, error: "invalid_request" }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
