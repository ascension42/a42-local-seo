'use client'
import { useSearchParams, useRouter } from 'next/navigation'

const specialtyTags = [
  'Stress & Anxiété', 'Sommeil', 'Enfants & Ados',
  'Burn-out', 'Confiance en soi', 'Périnatalité',
]
const neighborhoods = ['Centre-ville', 'Chartrons', 'Saint-Michel', 'Caudéran']
const priceRanges = [
  { label: 'Moins de 60 €', value: 'lt60' },
  { label: '60 € – 80 €',   value: '60-80' },
  { label: 'Plus de 80 €',  value: 'gt80' },
]
const modes = [
  { label: 'Tous',              value: 'all' },
  { label: 'Cabinet',           value: 'cabinet' },
  { label: 'En ligne',          value: 'online' },
  { label: 'Cabinet & En ligne',value: 'both' },
]

export default function FilterSidebar() {
  const params = useSearchParams()
  const router = useRouter()

  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(params.toString())
    if (value === null || value === 'all') {
      next.delete(key)
    } else {
      next.set(key, value)
    }
    router.push(`/praticiens?${next.toString()}`)
  }

  const currentMode = params.get('mode') ?? 'all'
  const currentQuartier = params.get('quartier')
  const currentPrix = params.get('prix')
  const currentTag = params.get('tag')

  return (
    <aside className="space-y-5">
      {/* Mode */}
      <div>
        <p className="text-[11px] font-extrabold text-green-dark uppercase tracking-[1px] mb-2.5">
          Mode de consultation
        </p>
        {modes.map((m) => (
          <label
            key={m.value}
            className="flex items-center gap-2 py-1.5 cursor-pointer"
            onClick={() => setParam('mode', m.value)}
          >
            <span className={[
              'w-4 h-4 rounded border-2 flex items-center justify-center shrink-0',
              currentMode === m.value ? 'bg-green border-green' : 'border-border',
            ].join(' ')}>
              {currentMode === m.value && (
                <svg viewBox="0 0 10 8" width="8" fill="none">
                  <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <span className="text-xs text-ink">{m.label}</span>
          </label>
        ))}
      </div>

      <hr className="border-border" />

      {/* Spécialité / Tag */}
      <div>
        <p className="text-[11px] font-extrabold text-green-dark uppercase tracking-[1px] mb-2.5">Spécialité</p>
        {specialtyTags.map((s) => (
          <label
            key={s}
            className="flex items-center gap-2 py-1.5 cursor-pointer"
            onClick={() => setParam('tag', currentTag === s ? null : s)}
          >
            <span className={[
              'w-4 h-4 rounded border-2 flex items-center justify-center shrink-0',
              currentTag === s ? 'bg-green border-green' : 'border-border',
            ].join(' ')}>
              {currentTag === s && (
                <svg viewBox="0 0 10 8" width="8" fill="none">
                  <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <span className="text-xs text-ink">{s}</span>
          </label>
        ))}
      </div>

      <hr className="border-border" />

      {/* Quartier */}
      <div>
        <p className="text-[11px] font-extrabold text-green-dark uppercase tracking-[1px] mb-2.5">Quartier</p>
        {neighborhoods.map((n) => (
          <label
            key={n}
            className="flex items-center gap-2 py-1.5 cursor-pointer"
            onClick={() => setParam('quartier', currentQuartier === n ? null : n)}
          >
            <span className={[
              'w-4 h-4 rounded border-2 flex items-center justify-center shrink-0',
              currentQuartier === n ? 'bg-green border-green' : 'border-border',
            ].join(' ')}>
              {currentQuartier === n && (
                <svg viewBox="0 0 10 8" width="8" fill="none">
                  <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <span className="text-xs text-ink">{n}</span>
          </label>
        ))}
      </div>

      <hr className="border-border" />

      {/* Prix */}
      <div>
        <p className="text-[11px] font-extrabold text-green-dark uppercase tracking-[1px] mb-2.5">Tarif séance</p>
        {priceRanges.map((r) => (
          <label
            key={r.value}
            className="flex items-center gap-2 py-1.5 cursor-pointer"
            onClick={() => setParam('prix', currentPrix === r.value ? null : r.value)}
          >
            <span className={[
              'w-4 h-4 rounded border-2 flex items-center justify-center shrink-0',
              currentPrix === r.value ? 'bg-green border-green' : 'border-border',
            ].join(' ')}>
              {currentPrix === r.value && (
                <svg viewBox="0 0 10 8" width="8" fill="none">
                  <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <span className="text-xs text-ink">{r.label}</span>
          </label>
        ))}
      </div>

      {/* Reset */}
      {(currentMode !== 'all' || currentQuartier || currentPrix || currentTag) && (
        <a href="/praticiens" className="block text-center text-xs text-green font-semibold py-2 border border-green rounded-lg hover:bg-surface transition-colors">
          Réinitialiser les filtres
        </a>
      )}
    </aside>
  )
}
