'use client'
import { useRouter } from 'next/navigation'

export default function CategoryGrid({ tags }: { tags: string[] }) {
  const router = useRouter()

  if (tags.length === 0) return null

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {tags.map((tag) => (
        <button
          key={tag}
          onClick={() => router.push(`/praticiens?tag=${encodeURIComponent(tag)}`)}
          className="bg-white border-[1.5px] border-border rounded-[10px] p-[18px] text-left cursor-pointer shadow-[0_1px_6px_rgba(0,0,0,0.06)] hover:border-green hover:bg-surface hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)] transition-all duration-150 group"
        >
          <p className="text-xs font-bold text-green-dark group-hover:text-green transition-colors">
            {tag}
          </p>
          <p className="text-[11px] text-muted mt-0.5">Voir les praticiens →</p>
        </button>
      ))}
    </div>
  )
}
