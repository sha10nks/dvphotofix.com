import type { MetadataRoute } from "next"

import { blogPosts } from "@/content/blog/posts"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://dvphotofix.netlify.app"

  const staticRoutes = ["", "/tool", "/photo-requirements", "/faq", "/updates", "/contact", "/blog"]

  const now = new Date()

  const staticUrls = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
  }))

  const blogSlugs = blogPosts.map((p) => p.slug)

  const blogUrls = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: now,
  }))

  return [...staticUrls, ...blogUrls]
}

