import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { blogPosts, getBlogPost } from "@/content/blog/posts"
import { Link } from "@/i18n/navigation"
import { JsonLd } from "@/components/JsonLd"
import { MarkdownLite } from "@/components/MarkdownLite"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) return {}
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: {
      canonical: `https://dvphotofix.netlify.app/blog/${post.slug}`,
    },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      type: "article",
      url: `https://dvphotofix.netlify.app/blog/${post.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle,
      description: post.metaDescription,
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getBlogPost(slug)
  if (!post) notFound()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    datePublished: post.publishedISO,
    dateModified: post.publishedISO,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://dvphotofix.netlify.app/blog/${post.slug}`,
    },
    author: {
      "@type": "Organization",
      name: "DV Photo Fix",
    },
    publisher: {
      "@type": "Organization",
      name: "DV Photo Fix",
    },
  }

  const related = post.relatedSlugs
    .map((s) => getBlogPost(s))
    .filter(Boolean)
    .slice(0, 2) as Array<{ slug: string; title: string }>

  return (
    <div className="mx-auto max-w-[900px] px-6 py-10 lg:px-8">
      <JsonLd data={jsonLd} />

      <div className="mb-8">
        <Link href="/blog" className="text-sm font-medium text-blue-700 hover:text-blue-800">
          ← Back to blog
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{post.title}</CardTitle>
          <div className="text-sm text-slate-600">{post.publishedISO}</div>
        </CardHeader>
        <CardContent>
          <MarkdownLite content={post.content} />

          <div className="mt-10 rounded-xl border border-slate-200 bg-white p-6">
            <div className="text-base font-semibold text-slate-900">Use the tool</div>
            <p className="mt-2 text-[15px] leading-7 text-slate-800">
              Check and fix your DV photo using the tool. Safe formatting only: crop, center, straighten, resize, and
              compress.
            </p>
            <div className="mt-3">
              <Link href="/tool" className="font-medium text-blue-700 hover:text-blue-800">
                Open the DV photo tool
              </Link>
            </div>
          </div>

          {related.length ? (
            <div className="mt-10">
              <div className="text-base font-semibold text-slate-900">Related</div>
              <ul className="mt-3 list-disc space-y-2 pl-6 text-[15px] leading-7 text-slate-800">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/blog/${r.slug}`} className="text-blue-700 hover:text-blue-800">
                      {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
