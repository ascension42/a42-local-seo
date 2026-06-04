import { MetadataRoute } from 'next'
import { createStaticClient } from '@/lib/supabase/static'
import { siteConfig } from '@/lib/config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createStaticClient()
  const base = `https://${siteConfig.domain}`

  const [{ data: practitioners }, { data: posts }] = await Promise.all([
    supabase.from('practitioners').select('slug, updated_at, is_premium'),
    supabase.from('blog_posts').select('slug, updated_at').lte('published_at', new Date().toISOString()),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base,                  changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${base}/praticiens`,  changeFrequency: 'daily',   priority: 0.9 },
    { url: `${base}/blog`,        changeFrequency: 'weekly',  priority: 0.7 },
    { url: `${base}/inscription`, changeFrequency: 'monthly', priority: 0.6 },
  ]

  const practitionerRoutes: MetadataRoute.Sitemap = (practitioners ?? []).map((p) => ({
    url:             `${base}/praticiens/${p.slug}`,
    lastModified:    new Date(p.updated_at),
    changeFrequency: 'monthly' as const,
    priority:        p.is_premium ? 0.85 : 0.75,
  }))

  const blogRoutes: MetadataRoute.Sitemap = (posts ?? []).map((p) => ({
    url:             `${base}/blog/${p.slug}`,
    lastModified:    new Date(p.updated_at),
    changeFrequency: 'monthly' as const,
    priority:        0.7,
  }))

  return [...staticRoutes, ...practitionerRoutes, ...blogRoutes]
}
