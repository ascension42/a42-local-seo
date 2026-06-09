'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PractitionerCarousel from './PractitionerCarousel'
import PractitionersMapWrapper from './PractitionersMapWrapper'
import type { Practitioner } from '@/lib/types'
import { siteConfig } from '@/lib/config'

interface Props {
  practitioners: Practitioner[]
  topTags: string[]
  cityLat: number
  cityLng: number
  initialTag?: string
}

export default function PractitionerDirectory({ practitioners, topTags, cityLat, cityLng, initialTag }: Props) {
  const router = useRouter()
  const [activeTag, setActiveTag] = useState(initialTag || '')

  const filtered = activeTag
    ? practitioners.filter(p =>
        (p.practitioner_tags ?? []).some(t => t.label === activeTag)
      )
    : practitioners

  function toggleTag(tag: string) {
    const next = activeTag === tag ? '' : tag
    setActiveTag(next)
    router.push('/praticiens' + (next ? `?tag=${encodeURIComponent(next)}` : ''), { scroll: false })
  }

  return (
    <div>
      {/* Filter pills */}
      <div className="flex overflow-x-auto scrollbar-none gap-2 pb-2 -mx-4 px-4 md:mx-0 md:px-0 mb-6">
        <button
          onClick={() => { setActiveTag(''); router.push('/praticiens', { scroll: false }) }}
          className={`flex-shrink-0 text-[11px] font-bold px-4 py-2 rounded-full border-[1.5px] transition-colors ${
            activeTag === ''
              ? 'bg-green text-white border-green shadow-sm'
              : 'bg-white text-green-dark border-border hover:border-green/50'
          }`}
        >
          Tous
        </button>
        {topTags.map(tag => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={`flex-shrink-0 text-[11px] font-bold px-4 py-2 rounded-full border-[1.5px] transition-colors ${
              activeTag === tag
                ? 'bg-green text-white border-green shadow-sm'
                : 'bg-white text-green-dark border-border hover:border-green/50'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Count chip */}
      {activeTag && (
        <p className="text-[11px] text-muted mb-4">
          {filtered.length} praticien{filtered.length > 1 ? 's' : ''} pour ce domaine
        </p>
      )}

      {/* Carousel or empty state */}
      {filtered.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-muted text-sm mb-4">Aucun praticien pour ce domaine.</p>
          <button
            onClick={() => { setActiveTag(''); router.push('/praticiens', { scroll: false }) }}
            className="text-green text-sm font-semibold hover:underline"
          >
            Voir tous →
          </button>
        </div>
      ) : (
        <PractitionerCarousel practitioners={filtered} />
      )}

      {/* Map section */}
      <div className="bg-bg-alt border-t border-border py-8 px-4 md:px-10 -mx-4 md:-mx-10 mt-10">
        <p className="text-[11px] font-bold text-muted uppercase tracking-[1px] mb-1">
          Carte des praticiens
        </p>
        <p className="text-[13px] text-ink mb-4">
          {activeTag
            ? `${filtered.length} praticien${filtered.length > 1 ? 's' : ''} spécialisé${filtered.length > 1 ? 's' : ''} en ${activeTag}`
            : `Trouvez votre ${siteConfig.specialtyLabel.toLowerCase()} le plus proche.`
          }
        </p>
        <PractitionersMapWrapper practitioners={filtered} cityLat={cityLat} cityLng={cityLng} />
      </div>
    </div>
  )
}
