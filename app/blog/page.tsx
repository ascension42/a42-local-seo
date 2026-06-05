import { getBlogPosts } from '@/lib/queries'
import { siteConfig } from '@/lib/config'
import BlogCard from '@/components/blog/BlogCard'
import type { Metadata } from 'next'

export const revalidate = 3600

export const metadata: Metadata = {
  title: `Blog — Guide de la ${siteConfig.specialtyLabel.toLowerCase()} à ${siteConfig.cityLabel}`,
  description: `Conseils et guides sur la ${siteConfig.specialtyLabel.toLowerCase()} à ${siteConfig.cityLabel}.`,
}

export default async function BlogPage() {
  const posts = await getBlogPosts()
  return (
    <>
      <div className="bg-green-dark px-4 md:px-10 py-9">
        <div className="max-w-[1060px] mx-auto">
          <p className="text-[10px] font-bold text-green-light uppercase tracking-[2px] mb-2">
            Ressources &amp; Conseils
          </p>
          <h1 className="text-[26px] font-extrabold text-white tracking-tight">
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
