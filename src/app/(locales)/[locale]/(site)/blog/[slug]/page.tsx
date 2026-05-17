import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { AdSlot } from "@/components/AdSlot"
import { JsonLd } from "@/components/JsonLd"
import { MarkdownLite } from "@/components/MarkdownLite"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { blogPosts, getBlogPost } from "@/content/blog/posts"
import { DEFAULT_LOCALE, isLocale, type Locale } from "@/i18n/config"
import { loadNamespaces } from "@/i18n/loadMessages"
import { getCanonical, getHreflang } from "@/i18n/seo"
import { createTranslator } from "@/i18n/translator"
import { withLocale } from "@/i18n/paths"

export const dynamic = "force-static"
export const revalidate = false

export async function generateStaticParams() {
  const slugs = blogPosts.map((p) => p.slug)
  const locales = ["en", "ar", "es", "fr", "ru", "tr", "fa", "pt"]
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params
  const locale = (isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE) as Locale
  const post = getBlogPost(slug)
  if (!post) return {}

  const canonical = getCanonical(locale, `/blog/${post.slug}/`)
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: {
      canonical,
      languages: getHreflang(`/blog/${post.slug}/`),
    },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      type: "article",
      url: canonical,
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle,
      description: post.metaDescription,
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale: rawLocale, slug } = await params
  const locale = (isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE) as Locale
  const post = getBlogPost(slug)
  if (!post) notFound()

  const messages = await loadNamespaces(locale, ["blog"])
  const { tn } = createTranslator(messages)
  const tBlog = tn("blog")

  const lines = post.content.split("\n")
  const mid = Math.floor(lines.length / 2)
  let splitAt = mid
  for (let i = 0; i < 120; i += 1) {
    const a = mid - i
    const b = mid + i
    if (a > 10 && !lines[a].trim()) {
      splitAt = a
      break
    }
    if (b < lines.length - 10 && !lines[b].trim()) {
      splitAt = b
      break
    }
  }

  const contentA = lines.slice(0, splitAt).join("\n")
  const contentB = lines.slice(splitAt).join("\n")

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    datePublished: post.publishedISO,
    dateModified: post.publishedISO,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": getCanonical(locale, `/blog/${post.slug}/`),
    },
    author: { "@type": "Organization", name: "DV Photo Fix" },
    publisher: { "@type": "Organization", name: "DV Photo Fix" },
  }

  const related = post.relatedSlugs
    .map((s) => getBlogPost(s))
    .filter(Boolean)
    .slice(0, 2) as Array<{ slug: string; title: string }>

  return (
    <div className="mx-auto max-w-[820px] px-6 py-10 lg:px-8">
      <JsonLd data={jsonLd} />

      <AdSlot variant="top" slot={`blog-top-${post.slug}`} minHeight={90} className="mb-8" />

      <div className="mb-8">
        <Link href={withLocale(locale, "/blog/")} className="text-sm font-medium text-[#2563EB] hover:text-[#1D4ED8]">
          {tBlog("index.back")}
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-[#0F172A]">{post.title}</CardTitle>
          <div className="text-sm text-[#64748B]">{post.publishedISO}</div>
        </CardHeader>
        <CardContent className="pt-2">
          <MarkdownLite content={contentA} />

          <AdSlot variant="inline" slot={`blog-mid-${post.slug}`} minHeight={90} className="my-10" />

          <MarkdownLite content={contentB} />

          <div className="mt-10 rounded-[20px] border border-[#D7E0EA] bg-gradient-to-b from-white to-[#EEF4FF] p-8 shadow-[0_10px_30px_rgba(37,99,235,0.08)]">
            <div className="text-lg font-semibold text-[#0F172A]">{tBlog("post.ctaTitle")}</div>
            <p className="mt-2 text-[16px] leading-7 text-[#334155]">{tBlog("post.ctaBody")}</p>
            <div className="mt-4">
              <Link
                href={withLocale(locale, "/tool/")}
                className="inline-flex h-12 items-center justify-center rounded-[14px] bg-[#2563EB] px-8 text-base font-semibold text-white shadow-sm hover:bg-[#1D4ED8]"
              >
                {tBlog("post.ctaButton")}
              </Link>
            </div>
          </div>

          {related.length ? (
            <div className="mt-10">
              <div className="text-base font-semibold text-[#0F172A]">{tBlog("post.related")}</div>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-[15px] leading-7 text-[#334155]">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={withLocale(locale, `/blog/${r.slug}/`)} className="text-[#2563EB] hover:text-[#1D4ED8]">
                      {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <AdSlot variant="footer" slot={`blog-bottom-${post.slug}`} minHeight={120} className="mt-10" />
    </div>
  )
}

