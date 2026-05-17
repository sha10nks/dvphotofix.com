import * as React from "react"

import Link from "next/link"

function isListItem(line: string) {
  return /^-\s+/.test(line)
}

function stripListMarker(line: string) {
  return line.replace(/^-\s+/, "")
}

export function MarkdownLite({ content }: { content: string }) {
  const lines = content.split("\n")
  const nodes: React.ReactNode[] = []
  let list: string[] = []

  function flushList(key: string) {
    if (!list.length) return
    const items = list
    list = []
    nodes.push(
      <ul key={key} className="my-4 list-disc space-y-2 pl-6 text-[15px] leading-7 text-slate-800">
        {items.map((it) => (
          <li key={it}>{renderInline(it)}</li>
        ))}
      </ul>,
    )
  }

  function renderInline(text: string) {
    const parts: React.ReactNode[] = []
    let cursor = 0
    const re = /\[([^\]]+)\]\(([^)]+)\)/g
    for (;;) {
      const m = re.exec(text)
      if (!m) break
      const [full, label, href] = m
      const start = m.index
      if (start > cursor) parts.push(text.slice(cursor, start))
      if (href.startsWith("http://") || href.startsWith("https://")) {
        parts.push(
          <a key={`${href}-${start}`} href={href} target="_blank" rel="noreferrer" className="font-medium text-blue-700 hover:text-blue-800">
            {label}
          </a>,
        )
      } else {
        parts.push(
          <Link key={`${href}-${start}`} href={href} className="font-medium text-blue-700 hover:text-blue-800">
            {label}
          </Link>,
        )
      }
      cursor = start + full.length
    }
    if (cursor < text.length) parts.push(text.slice(cursor))
    return <>{parts}</>
  }

  for (let i = 0; i < lines.length; i += 1) {
    const raw = lines[i]
    const line = raw.trim()

    if (!line) {
      flushList(`ul-${i}`)
      continue
    }

    if (isListItem(line)) {
      list.push(stripListMarker(line))
      continue
    }

    flushList(`ul-${i}`)

    if (line.startsWith("### ")) {
      nodes.push(
        <h3 key={`h3-${i}`} className="mt-8 text-[20px] font-bold leading-snug text-[#0F172A]">
          {line.slice(4)}
        </h3>,
      )
      continue
    }
    if (line.startsWith("## ")) {
      nodes.push(
        <h2 key={`h2-${i}`} className="mt-10 text-[24px] font-bold leading-snug text-[#0F172A]">
          {line.slice(3)}
        </h2>,
      )
      continue
    }
    if (line.startsWith("# ")) {
      nodes.push(
        <h1 key={`h1-${i}`} className="text-4xl font-bold tracking-tight text-[#0F172A]">
          {line.slice(2)}
        </h1>,
      )
      continue
    }

    nodes.push(
      <p key={`p-${i}`} className="mt-4 text-[18px] leading-[1.8] text-[#334155]">
        {renderInline(line)}
      </p>,
    )
  }

  flushList("ul-end")

  return <div className="max-w-[72ch]">{nodes}</div>
}
