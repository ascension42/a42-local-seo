'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import PractitionerShowcase from './PractitionerShowcase'
import PractitionersMapWrapper from './PractitionersMapWrapper'
import type { Practitioner } from '@/lib/types'
import { siteConfig } from '@/lib/config'

interface Props {
  practitioners: Practitioner[]
  allTags: string[]
  cityLat: number
  cityLng: number
  initialTag?: string
}

export default function PractitionerDirectory({ practitioners, allTags, cityLat, cityLng, initialTag }: Props) {
  const router = useRouter()
  const [activeTag, setActiveTag] = useState(initialTag || '')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const filtered = activeTag
    ? practitioners.filter(p => (p.practitioner_tags ?? []).some(t => t.label === activeTag))
    : practitioners

  function toggleTag(tag: string) {
    const next = activeTag === tag ? '' : tag
    setActiveTag(next)
    setDropdownOpen(false)
    router.push('/praticiens' + (next ? `?tag=${encodeURIComponent(next)}` : ''), { scroll: false })
  }

  // Always show top 4 pills; if activeTag is not among them, prepend it
  const topFour = allTags.slice(0, 4)
  const pillTags = activeTag && !topFour.includes(activeTag)
    ? [activeTag, ...topFour]
    : topFour
  const overflowTags = allTags.filter(t => !pillTags.includes(t))

  return (
    <div>
      {/* Filters + Showcase — constrained */}
      <div className="max-w-[760px] mx-auto px-4 md:px-10 py-8 md:py-10">
        <div className="flex flex-nowrap gap-2 mb-6 items-center overflow-x-auto scrollbar-none">
          <button
            onClick={() => { setActiveTag(''); setDropdownOpen(false); router.push('/praticiens', { scroll: false }) }}
            className={`text-[11px] font-bold px-4 py-2 rounded-full border-[1.5px] transition-all ${
              activeTag === ''
                ? 'bg-green text-white border-green shadow-sm shadow-green/20'
                : 'bg-white text-green-dark border-border hover:border-green/40 hover:bg-surface'
            }`}
          >
            Tous
          </button>

          {pillTags.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`text-[11px] font-bold px-4 py-2 rounded-full border-[1.5px] transition-all ${
                activeTag === tag
                  ? 'bg-green text-white border-green shadow-sm shadow-green/20'
                  : 'bg-white text-green-dark border-border hover:border-green/40 hover:bg-surface'
              }`}
            >
              {tag}
            </button>
          ))}

          {overflowTags.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`flex items-center gap-1.5 text-[11px] font-bold px-4 py-2 rounded-full border-[1.5px] transition-all ${
                  dropdownOpen
                    ? 'bg-green-dark text-white border-green-dark'
                    : 'bg-white text-green-dark border-border hover:border-green/40 hover:bg-surface'
                }`}
              >
                +{overflowTags.length}
                <svg width="8" height="5" viewBox="0 0 8 5" fill="none">
                  <path d={dropdownOpen ? 'M7 4L4 1 1 4' : 'M1 1l3 3 3-3'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute top-full mt-2 left-0 z-30 bg-white border border-border rounded-xl shadow-xl py-1.5 min-w-[160px] max-w-[calc(100vw-32px)]">
                    {overflowTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        className={`w-full text-left px-4 py-2.5 text-[12px] font-semibold transition-colors hover:bg-surface ${
                          activeTag === tag ? 'text-green' : 'text-ink'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {activeTag && (
          <p className="text-[11px] text-muted mb-5">
            {filtered.length} praticien{filtered.length > 1 ? 's' : ''} pour &laquo;&nbsp;{activeTag}&nbsp;&raquo;
          </p>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted text-sm mb-4">Aucun praticien pour ce domaine.</p>
            <button
              onClick={() => { setActiveTag(''); router.push('/praticiens', { scroll: false }) }}
              className="text-green text-sm font-semibold hover:underline"
            >
              Voir tous →
            </button>
          </div>
        ) : (
          <PractitionerShowcase key={activeTag} practitioners={filtered} />
        )}
      </div>

      {/* Map — full-width section */}
      <div className="bg-bg-alt border-t border-border py-8 px-4 md:px-10">
        <div className="max-w-[760px] mx-auto">
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
    </div>
  )
}
