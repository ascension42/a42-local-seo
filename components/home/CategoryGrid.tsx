'use client'
import { useRouter } from 'next/navigation'

const categories = [
  { label: 'Stress & Anxiété',      count: 8, fill: 80 },
  { label: 'Troubles du sommeil',   count: 5, fill: 50 },
  { label: 'Enfants & Adolescents', count: 4, fill: 40 },
  { label: 'Confiance en soi',      count: 6, fill: 60 },
  { label: 'Préparation mentale',   count: 5, fill: 50 },
  { label: 'Burn-out & Épuisement', count: 7, fill: 70 },
  { label: 'Périnatalité',          count: 3, fill: 30 },
  { label: 'Douleurs chroniques',   count: 4, fill: 40 },
]

export default function CategoryGrid() {
  const router = useRouter()
  return (
    <div className="grid grid-cols-4 gap-3">
      {categories.map((cat) => (
        <button
          key={cat.label}
          onClick={() => router.push('/praticiens')}
          className="bg-white border-[1.5px] border-border rounded-[10px] p-[18px] text-left cursor-pointer hover:border-green hover:-translate-y-px hover:shadow-md transition-all duration-150"
        >
          <p className="text-xs font-bold text-green-dark mb-0.5">{cat.label}</p>
          <p className="text-[11px] text-muted">{cat.count} praticiens disponibles</p>
          <div className="h-0.5 bg-surface rounded mt-2.5 overflow-hidden">
            <div className="h-full bg-green rounded" style={{ width: `${cat.fill}%` }} />
          </div>
        </button>
      ))}
    </div>
  )
}
