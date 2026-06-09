import { getBlogPosts } from '@/lib/queries'
import { siteConfig } from '@/lib/config'
import BlogCard from '@/components/blog/BlogCard'
import type { Metadata } from 'next'

export const revalidate = 3600

const siteUrl = `https://${siteConfig.domain}`
const sp = siteConfig.specialtyLabel.toLowerCase()
const city = siteConfig.cityLabel

export const metadata: Metadata = {
  title: `Guide sophrologie ${city} — Articles & conseils`,
  description: `Articles et guides sur la sophrologie à ${city} : gestion du stress, sommeil, anxiété, préparation mentale. Conseils de sophrologues certifiés RNCP.`,
  alternates: { canonical: `${siteUrl}/blog` },
  openGraph: {
    title: `Guide sophrologie ${city} — Articles & conseils`,
    description: `Découvrez nos articles sur la sophrologie à ${city} : stress, sommeil, anxiété, bien-être.`,
    url: `${siteUrl}/blog`,
    type: 'website',
  },
}

const blogJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  name: `Guide de la sophrologie à ${city}`,
  description: `Articles et guides sur la sophrologie à ${city}.`,
  url: `${siteUrl}/blog`,
  inLanguage: 'fr-FR',
  publisher: {
    '@type': 'Organization',
    name: siteConfig.siteName,
    url: siteUrl,
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: `Guide sophrologie ${city}`, item: `${siteUrl}/blog` },
  ],
}

export default async function BlogPage() {
  const posts = await getBlogPosts()
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className="bg-green-dark px-4 md:px-10 py-9">
        <div className="max-w-[1060px] mx-auto">
          <p className="text-[10px] font-bold text-green-light uppercase tracking-[2px] mb-2">
            Ressources &amp; Conseils
          </p>
          <h1 className="text-[22px] md:text-[26px] font-extrabold text-white tracking-tight">
            Le guide de la {siteConfig.specialtyLabel.toLowerCase()} à {siteConfig.cityLabel}
          </h1>
        </div>
      </div>
      <div className="max-w-[1060px] mx-auto px-4 md:px-10 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((p, i) => (
            <BlogCard key={p.id} post={p} featured={i === 0} />
          ))}
        </div>
      </div>
    </>
  )
}
