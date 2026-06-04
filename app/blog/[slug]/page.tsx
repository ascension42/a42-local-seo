import { notFound } from 'next/navigation'
import { getBlogPostBySlug, getFeaturedPractitioners } from '@/lib/queries'
import { createStaticClient } from '@/lib/supabase/static'
import { siteConfig } from '@/lib/config'
import type { Metadata } from 'next'
import Link from 'next/link'

export const revalidate = 3600

export async function generateStaticParams() {
  const supabase = createStaticClient()
  const { data } = await supabase
    .from('blog_posts')
    .select('slug')
    .lte('published_at', new Date().toISOString())
  return (data ?? []).map((p: { slug: string }) => ({ slug: p.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
  }
}

export default async function BlogArticlePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const [post, featured] = await Promise.all([
    getBlogPostBySlug(slug),
    getFeaturedPractitioners(),
  ])
  if (!post) notFound()

  return (
    <>
      <div className="bg-green-dark px-10 py-11">
        <div className="max-w-[760px] mx-auto">
          <p className="text-[10px] font-bold text-green-light uppercase tracking-[2px] mb-3">
            Guide complet
          </p>
          <h1 className="font-accent text-[34px] text-white leading-[1.2] mb-4">{post.title}</h1>
          {post.excerpt && (
            <p className="text-sm text-white/70 leading-[1.65] max-w-[600px]">{post.excerpt}</p>
          )}
          <p className="text-[11px] text-white/50 mt-5">
            Rédaction {siteConfig.siteName} · {post.reading_time_min} min de lecture
          </p>
        </div>
      </div>

      <div
        className="max-w-[1060px] mx-auto px-10 py-10 grid gap-12"
        style={{ gridTemplateColumns: '1fr 280px' }}
      >
        <article>
          <div className="w-full h-[280px] rounded-xl bg-gradient-to-br from-green-dark via-[#467954] to-green flex items-center justify-center text-white/20 text-[11px] font-bold uppercase tracking-[2px] mb-8">
            PHOTO ARTICLE
          </div>
          <div>
            {post.content?.split('\n').map((line, i) => {
              if (line.startsWith('## '))
                return <h2 key={i} className="text-xl font-extrabold text-green-dark mt-7 mb-3">{line.slice(3)}</h2>
              if (line.startsWith('# '))
                return <h1 key={i} className="text-2xl font-extrabold text-green-dark mb-4">{line.slice(2)}</h1>
              if (line.trim() === '')
                return <br key={i} />
              return <p key={i} className="text-[13px] leading-[1.85] text-ink mb-3.5">{line}</p>
            })}
          </div>
        </article>

        <aside className="space-y-4">
          <div className="bg-white border-[1.5px] border-border rounded-xl p-[18px]">
            <h3 className="text-[13px] font-extrabold text-green-dark mb-3 pb-2.5 border-b border-border">
              Praticiens recommandés
            </h3>
            <div className="space-y-3">
              {featured.map((p) => (
                <Link
                  key={p.id}
                  href={`/praticiens/${p.slug}`}
                  className="flex gap-3 items-center py-2.5 border-b border-bg-alt last:border-0"
                >
                  <div className="w-11 h-11 rounded-full bg-gradient-to-br from-green-dark to-green flex items-center justify-center text-sm font-extrabold text-white shrink-0">
                    {p.first_name[0]}{p.last_name[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-green-dark">{p.first_name} {p.last_name}</p>
                    <p className="text-[10px] text-muted">{p.hourly_rate} €/séance</p>
                  </div>
                  <span className="text-[10px] font-bold text-green ml-auto">RDV →</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-green-dark rounded-xl p-[18px] text-center">
            <h4 className="text-sm font-extrabold text-white mb-1.5">Vous êtes praticien ?</h4>
            <p className="text-[11px] text-white/65 leading-[1.5] mb-3.5">
              Inscrivez votre cabinet et soyez visible à {siteConfig.cityLabel}.
            </p>
            <Link
              href="/inscription"
              className="block bg-green text-white font-bold text-xs py-2.5 rounded-md hover:bg-[#4faa73] transition-colors"
            >
              Inscrire mon cabinet →
            </Link>
          </div>
        </aside>
      </div>
    </>
  )
}
