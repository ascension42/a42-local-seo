import { notFound } from 'next/navigation'
import { getBlogPostBySlug, getFeaturedPractitioners, getBlogPosts } from '@/lib/queries'
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
    openGraph: post.cover_url ? { images: [post.cover_url] } : undefined,
  }
}

function inlineRender(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return <strong key={i} className="font-bold text-green-dark">{part.slice(2, -2)}</strong>
    }
    return <span key={i}>{part}</span>
  })
}

function renderMarkdown(content: string) {
  const lines = content.split('\n')
  const nodes: React.ReactNode[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('### ')) {
      nodes.push(
        <h3 key={i} className="text-[15px] font-extrabold text-green-dark mt-7 mb-2">
          {line.slice(4)}
        </h3>
      )
    } else if (line.startsWith('## ')) {
      nodes.push(
        <h2 key={i} className="text-[19px] font-extrabold text-green-dark mt-9 mb-3 pb-2 border-b border-border">
          {line.slice(3)}
        </h2>
      )
    } else if (line.startsWith('# ')) {
      nodes.push(
        <h1 key={i} className="text-2xl font-extrabold text-green-dark mb-4">
          {line.slice(2)}
        </h1>
      )
    } else if (line === '---' || line === '***' || line === '---') {
      nodes.push(<hr key={i} className="border-border my-7" />)
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      const listItems: string[] = []
      while (i < lines.length && (lines[i].startsWith('- ') || lines[i].startsWith('* '))) {
        listItems.push(lines[i].slice(2))
        i++
      }
      nodes.push(
        <ul key={`list-${i}`} className="space-y-2 mb-5 pl-0">
          {listItems.map((item, j) => (
            <li key={j} className="flex gap-2.5 text-[13px] leading-[1.85] text-ink">
              <span className="text-green font-bold mt-[3px] shrink-0">▸</span>
              <span>{inlineRender(item)}</span>
            </li>
          ))}
        </ul>
      )
      continue
    } else if (line.trim() === '') {
      // skip — paragraph spacing is handled by mb on elements
    } else {
      nodes.push(
        <p key={i} className="text-[13px] leading-[1.85] text-ink mb-4">
          {inlineRender(line)}
        </p>
      )
    }
    i++
  }
  return nodes
}

const avatarGradients = [
  'from-green-dark to-green',
  'from-[#3c6947] to-[#5cbe83]',
  'from-[#467954] to-[#6ab885]',
]

export default async function BlogArticlePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const [post, featured, allPosts] = await Promise.all([
    getBlogPostBySlug(slug),
    getFeaturedPractitioners(),
    getBlogPosts(),
  ])
  if (!post) notFound()

  const relatedPosts = allPosts.filter((p) => p.slug !== slug).slice(0, 2)

  return (
    <>
      {/* Hero header */}
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
          {/* Cover image */}
          {post.cover_url ? (
            <div className="w-full h-[280px] rounded-xl overflow-hidden mb-8">
              <img
                src={post.cover_url}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-[280px] rounded-xl bg-gradient-to-br from-green-dark via-[#467954] to-green mb-8" />
          )}

          {/* Article content */}
          <div className="prose-custom">
            {post.content ? renderMarkdown(post.content) : null}
          </div>
        </article>

        {/* Sidebar */}
        <aside className="space-y-4">
          <div className="bg-white border-[1.5px] border-border rounded-xl p-[18px]">
            <h3 className="text-[13px] font-extrabold text-green-dark mb-3 pb-2.5 border-b border-border">
              Praticiens recommandés
            </h3>
            <div className="space-y-3">
              {featured.map((p) => {
                const initials = `${p.first_name[0]}${p.last_name[0]}`
                const grad = avatarGradients[p.first_name.charCodeAt(0) % avatarGradients.length]
                return (
                  <Link
                    key={p.id}
                    href={`/praticiens/${p.slug}`}
                    className="flex gap-3 items-center py-2.5 border-b border-bg-alt last:border-0"
                  >
                    {p.photo_url ? (
                      <img
                        src={p.photo_url}
                        alt={`${p.first_name} ${p.last_name}`}
                        className="w-11 h-11 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${grad} flex items-center justify-center text-sm font-extrabold text-white shrink-0`}>
                        {initials}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-green-dark truncate">{p.first_name} {p.last_name}</p>
                      <p className="text-[10px] text-muted">{p.hourly_rate} €/séance</p>
                    </div>
                    <span className="text-[10px] font-bold text-green ml-auto whitespace-nowrap">Voir →</span>
                  </Link>
                )
              })}
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

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <div className="max-w-[1060px] mx-auto px-10 pb-12">
          <h2 className="text-lg font-extrabold text-green-dark mb-5 tracking-tight">
            Ces articles pourraient vous intéresser
          </h2>
          <div className={`grid gap-5 ${relatedPosts.length === 1 ? 'grid-cols-1 max-w-sm' : 'grid-cols-2'}`}>
            {relatedPosts.map((p) => (
              <Link
                key={p.id}
                href={`/blog/${p.slug}`}
                className="flex gap-4 p-4 bg-white border-[1.5px] border-border rounded-xl hover:border-green hover:shadow-md transition-all duration-150"
              >
                {p.cover_url ? (
                  <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0">
                    <img src={p.cover_url} alt={p.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-green-dark to-green shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-green uppercase tracking-[1px] mb-1">
                    {p.reading_time_min} min de lecture
                  </p>
                  <p className="text-sm font-bold text-green-dark leading-[1.35] line-clamp-2">{p.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
