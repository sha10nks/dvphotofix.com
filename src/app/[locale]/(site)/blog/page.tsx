import type { Metadata } from "next"

import { blogPosts } from "@/content/blog/posts"
import { Link } from "@/i18n/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "DV Lottery Blog",
  description: "Concise DV Lottery guidance and photo tips aligned with DV Program sources.",
  alternates: {
    canonical: "https://dvphotofix.netlify.app/en/blog/",
  },
  openGraph: {
    title: "DV Lottery Blog",
    description: "Concise DV Lottery guidance and photo tips aligned with DV Program sources.",
    url: "https://dvphotofix.netlify.app/en/blog/",
  },
  twitter: {
    card: "summary_large_image",
    title: "DV Lottery Blog",
    description: "Concise DV Lottery guidance and photo tips aligned with DV Program sources.",
  },
}

export default function BlogIndexPage() {
  const posts = [...blogPosts].sort((a, b) => (a.publishedISO < b.publishedISO ? 1 : -1))

  return (
    <div className="mx-auto max-w-[900px] px-6 py-10 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-b from-blue-50 to-white p-8">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">DV Lottery blog</h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-800">
          Concise, practical DV guidance aligned with DV Program sources. Every post links to the tool so you can fix and
          format your DV photo safely.
        </p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link href="/tool" className="inline-flex h-12 items-center justify-center rounded-lg bg-blue-700 px-8 text-base font-medium text-white shadow-sm hover:bg-blue-800">
            Open the tool
          </Link>
          <Link href="/photo-requirements" className="inline-flex h-12 items-center justify-center rounded-lg border border-slate-200 bg-white px-8 text-base font-medium text-slate-900 hover:bg-slate-50">
            Photo requirements
          </Link>
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {posts.map((p) => (
          <Card key={p.slug} className="bg-white">
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div className="text-sm text-slate-600">{p.publishedISO}</div>
                <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-[12px] font-medium text-slate-700">
                  {p.keyword}
                </div>
              </div>
              <CardTitle className="text-2xl">
                <Link href={`/blog/${p.slug}`} className="text-slate-900 hover:text-slate-950">
                  {p.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-[15px] leading-7 text-slate-800">
              <p className="max-w-[72ch]">{p.metaDescription}</p>
              <div className="pt-2">
                <Link href={`/blog/${p.slug}`} className="inline-flex h-11 items-center justify-center rounded-lg bg-blue-700 px-6 text-base font-medium text-white hover:bg-blue-800">
                  Read
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
