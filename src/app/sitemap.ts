import type { MetadataRoute } from 'next'

import { getPublishedBlogPosts } from '@/lib/blog/posts'
import { coreSitePaths, siteUrl } from '@/lib/seo'

export const revalidate = 900

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const posts = getPublishedBlogPosts(now)

  const staticRoutes = coreSitePaths.map((path) => ({
    url: path === '/' ? siteUrl : `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency:
      path === '/' || path === '/console' || path === '/developers/api' || path === '/developers/adapters'
        ? 'weekly'
        : path === '/blog'
          ? 'weekly'
          : 'monthly',
    priority:
      path === '/'
        ? 1
        : path === '/console'
          ? 0.95
          : path === '/developers/api' || path === '/developers/adapters' || path === '/methodology'
            ? 0.9
            : 0.7,
  })) satisfies MetadataRoute.Sitemap

  const postRoutes = posts.map((post) => ({
    url: `${siteUrl}/blog/${post.slug}`,
    lastModified: new Date(post.releaseAt ?? post.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.8,
  })) satisfies MetadataRoute.Sitemap

  return [...staticRoutes, ...postRoutes]
}
