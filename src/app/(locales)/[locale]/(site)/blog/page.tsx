import type { Metadata } from "next"
import Link from "next/link"

import { blogPosts } from "@/content/blog/posts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/i18n/config"
import { loadNamespaces } from "@/i18n/loadMessages"
import { createTranslator } from "@/i18n/translator"
import { getCanonical, getHreflang } from "@/i18n/seo"
import { withLocale } from "@/i18n/paths"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale: rawLocale } = await params
  const locale = (isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE) as Locale
  const messages = await loadNamespaces(locale, ["metadata"])
  const { tn } = createTranslator(messages)
  const tMeta = tn("metadata")

  const canonical = getCanonical(locale, "/blog/")
  return {
    title: tMeta("pages.blog.title"),
    description: tMeta("pages.blog.description"),
    alternates: {
      canonical,
      languages: getHreflang("/blog/"),
    },
    openGraph: {
      title: tMeta("pages.blog.title"),
      description: tMeta("pages.blog.description"),
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title: tMeta("pages.blog.title"),
      description: tMeta("pages.blog.description"),
    },
  }
}

export default async function BlogIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: rawLocale } = await params
  const locale = (isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE) as Locale

  const messages = await loadNamespaces(locale, ["blog"])
  const { tn } = createTranslator(messages)
  const tBlog = tn("blog")

  const posts = [...blogPosts].sort((a, b) => (a.publishedISO < b.publishedISO ? 1 : -1))

  return (
    <div className="mx-auto max-w-[900px] px-6 py-10 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-gradient-to-b from-blue-50 to-white p-8">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{tBlog("index.title")}</h1>
        <p className="mt-3 max-w-3xl text-base leading-7 text-slate-800">{tBlog("index.intro")}</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link
            href={withLocale(locale, "/tool/")}
            className="inline-flex h-12 items-center justify-center rounded-lg bg-blue-700 px-8 text-base font-medium text-white shadow-sm hover:bg-blue-800"
          >
            {tBlog("index.openTool")}
          </Link>
          <Link
            href={withLocale(locale, "/photo-requirements/")}
            className="inline-flex h-12 items-center justify-center rounded-lg border border-slate-200 bg-white px-8 text-base font-medium text-slate-900 hover:bg-slate-50"
          >
            {tBlog("index.requirements")}
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
                <Link href={withLocale(locale, `/blog/${p.slug}/`)} className="text-slate-900 hover:text-slate-950">
                  {p.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-[15px] leading-7 text-slate-800">
              <p className="max-w-[72ch]">{p.metaDescription}</p>
              <div className="pt-2">
                <Link
                  href={withLocale(locale, `/blog/${p.slug}/`)}
                  className="inline-flex h-11 items-center justify-center rounded-lg bg-blue-700 px-6 text-base font-medium text-white hover:bg-blue-800"
                >
                  {tBlog("index.read")}
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

