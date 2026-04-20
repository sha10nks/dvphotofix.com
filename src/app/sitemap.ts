import type { MetadataRoute } from "next"

import { blogPosts } from "@/content/blog/posts"

export const dynamic = "force-static"
export const revalidate = false

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://dvphotofix.netlify.app"

  const staticRoutes = ["/", "/en/tool/", "/en/photo-requirements/", "/en/faq/", "/en/updates/", "/en/contact/", "/en/blog/"]

  const now = new Date()

  const staticUrls = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
  }))

  const blogSlugs = blogPosts.map((p) => p.slug)

  const blogUrls = blogSlugs.map((slug) => ({
    url: `${baseUrl}/en/blog/${slug}/`,
    lastModified: now,
  }))

  return [...staticUrls, ...blogUrls]
}
