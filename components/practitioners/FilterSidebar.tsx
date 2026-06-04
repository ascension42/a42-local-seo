'use client'
import { useRouter, useSearchParams } from 'next/navigation'

const specialties = [
  'Stress & Anxiété', 'Sommeil', 'Enfants & Ados',
  'Burn-out', 'Confiance en soi', 'Périnatalité',
]
const neighborhoods = ['Centre-ville', 'Chartrons', 'Saint-Michel', 'Caudéran']
const priceRanges = [
  { label: 'Moins de 60 €', value: 'lt60' },
  { label: '60 € – 80 €',   value: '60-80' },
  { label: 'Plus de 80 €',  value: 'gt80' },
]

export default function FilterSidebar() {
  const router = useRouter()
  const params = useSearchParams()
  const mode = params.get('mode') ?? 'all'

  function toggle(key: string, value: string) {
    const next = new URLSearchParams(params.toString())
    next.get(key) === value ? next.delete(key) : next.set(key, value)
    router.push(`/praticiens?${next.toString()}`)
  }

  const modeLabels: Record<string, string> = {
    all: 'Tous', cabinet: 'Cabinet',
    online: 'En ligne', both: 'Cabinet & En ligne',
  }

  return (
    <aside className="space-y-5">
      <div>
        <p className="text-[11px] font-extrabold text-green-dark uppercase tracking-[1px] mb-2.5">
          Mode de consultation
        </p>
        {(['all', 'cabinet', 'online', 'both'] as const).map((m) => (
          <label key={m} className="flex items-center gap-2 py-1.5 cursor-pointer" onClick={() => toggle('mode', m)}>
            <span className={[
              'w-4 h-4 rounded border-2 flex items-center justify-center shrink-0',
              mode === m ? 'bg-green border-green' : 'border-border',
            ].join(' ')}>
              {mode === m && (
                <svg viewBox="0 0 10 8" width="8" fill="none">
                  <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
            </span>
            <span className="text-xs text-ink">{modeLabels[m]}</span>
          </label>
        ))}
      </div>

      <hr className="border-border" />

      <div>
        <p className="text-[11px] font-extrabold text-green-dark uppercase tracking-[1px] mb-2.5">Spécialité</p>
        {specialties.map((s) => (
          <label key={s} className="flex items-center gap-2 py-1.5 cursor-pointer">
            <span className="w-4 h-4 rounded border-2 border-border shrink-0" />
            <span className="text-xs text-ink">{s}</span>
          </label>
        ))}
      </div>

      <hr className="border-border" />

      <div>
        <p className="text-[11px] font-extrabold text-green-dark uppercase tracking-[1px] mb-2.5">Quartier</p>
        {neighborhoods.map((n) => (
          <label key={n} className="flex items-center gap-2 py-1.5 cursor-pointer">
            <span className="w-4 h-4 rounded border-2 border-border shrink-0" />
            <span className="text-xs text-ink">{n}</span>
          </label>
        ))}
      </div>

      <hr className="border-border" />

      <div>
        <p className="text-[11px] font-extrabold text-green-dark uppercase tracking-[1px] mb-2.5">Tarif séance</p>
        {priceRanges.map((r) => (
          <label key={r.value} className="flex items-center gap-2 py-1.5 cursor-pointer">
            <span className="w-4 h-4 rounded border-2 border-border shrink-0" />
            <span className="text-xs text-ink">{r.label}</span>
          </label>
        ))}
      </div>
    </aside>
  )
}
