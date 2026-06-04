import type { BlogPost } from '@/lib/types'
import BlogCard from '@/components/blog/BlogCard'
import SectionHeader from '@/components/ui/SectionHeader'
import { siteConfig } from '@/lib/config'

export default function BlogSection({ posts }: { posts: BlogPost[] }) {
  const [featured, ...rest] = posts
  if (!featured) return null
  return (
    <section className="py-[52px] bg-bg-alt">
      <div className="max-w-[1060px] mx-auto px-10">
        <SectionHeader
          eyebrow="Ressources & Conseils"
          title={`Le guide de la ${siteConfig.specialtyLabel.toLowerCase()} à ${siteConfig.cityLabel}`}
          subtitle="Articles rédigés par des praticiens certifiés"
        />
        <div className="grid gap-[18px]" style={{ gridTemplateColumns: '1.6fr 1fr 1fr' }}>
          <BlogCard post={featured} featured />
          {rest.slice(0, 2).map((p) => <BlogCard key={p.id} post={p} />)}
        </div>
      </div>
    </section>
  )
}
