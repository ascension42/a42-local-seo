import Link from 'next/link'
import type { BlogPost } from '@/lib/types'
import { cn } from '@/lib/utils'

interface Props {
  post: BlogPost
  featured?: boolean
}

export default function BlogCard({ post, featured = false }: Props) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="block bg-white rounded-xl overflow-hidden border-[1.5px] border-border hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
    >
      {post.cover_url ? (
        <div className={cn('overflow-hidden', featured ? 'h-[200px]' : 'h-[150px]')}>
          <img src={post.cover_url} alt={post.title} className="w-full h-full object-cover" />
        </div>
      ) : (
        <div className={cn(
          'flex items-center justify-center font-bold text-[10px] uppercase tracking-[1.5px] text-white/20',
          featured
            ? 'h-[200px] bg-gradient-to-br from-green-dark to-[#467954]'
            : 'h-[150px] bg-bg-alt text-muted/30',
        )}>
          {featured ? 'PHOTO ARTICLE' : ''}
        </div>
      )}
      <div className="p-4">
        <p className="text-[10px] font-bold text-green uppercase tracking-[1px] mb-1.5">
          {featured ? 'Guide complet' : 'Conseil'}
        </p>
        <h3 className={cn('font-bold text-green-dark leading-[1.35] mb-1.5', featured ? 'text-base' : 'text-sm')}>
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="text-[11px] text-muted leading-[1.6]">{post.excerpt}</p>
        )}
        {post.reading_time_min && (
          <p className="text-[10px] text-muted font-medium mt-3">{post.reading_time_min} min de lecture</p>
        )}
      </div>
    </Link>
  )
}
