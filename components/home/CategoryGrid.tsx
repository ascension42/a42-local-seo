'use client'
import { useRouter } from 'next/navigation'

const categories = [
  { label: 'Stress & Anxiété'      },
  { label: 'Troubles du sommeil'   },
  { label: 'Enfants & Adolescents' },
  { label: 'Confiance en soi'      },
  { label: 'Préparation mentale'   },
  { label: 'Burn-out & Épuisement' },
  { label: 'Périnatalité'          },
  { label: 'Douleurs chroniques'   },
]

export default function CategoryGrid() {
  const router = useRouter()

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {categories.map((cat) => (
        <button
          key={cat.label}
          onClick={() => router.push(`/praticiens?tag=${encodeURIComponent(cat.label)}`)}
          className="bg-white border-[1.5px] border-border rounded-[10px] p-[18px] text-left cursor-pointer shadow-[0_1px_6px_rgba(0,0,0,0.06)] hover:border-green hover:bg-surface hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,0,0,0.10)] transition-all duration-150 group"
        >
          <p className="text-xs font-bold text-green-dark group-hover:text-green transition-colors">
            {cat.label}
          </p>
          <p className="text-[11px] text-muted mt-0.5">Voir les praticiens →</p>
        </button>
      ))}
    </div>
  )
}
