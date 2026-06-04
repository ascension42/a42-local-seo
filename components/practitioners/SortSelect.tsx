'use client'
import { useRouter, useSearchParams } from 'next/navigation'

export default function SortSelect() {
  const router = useRouter()
  const params = useSearchParams()

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = new URLSearchParams(params.toString())
    if (e.target.value === 'featured') {
      next.delete('sort')
    } else {
      next.set('sort', e.target.value)
    }
    router.push(`/praticiens?${next.toString()}`)
  }

  const currentSort = params.get('sort') ?? 'featured'

  return (
    <select
      value={currentSort}
      onChange={handleChange}
      className="border-[1.5px] border-border rounded-md px-2.5 py-1.5 text-xs text-ink bg-white cursor-pointer font-sans"
    >
      <option value="featured">Mis en avant</option>
      <option value="alpha">Alphabétique</option>
      <option value="price">Tarif croissant</option>
    </select>
  )
}
