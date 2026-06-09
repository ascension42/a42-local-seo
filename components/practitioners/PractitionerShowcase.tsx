'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import type { Practitioner } from '@/lib/types'
import { siteConfig } from '@/lib/config'
import ModeTag from './ModeTag'

const headerGradients = [
  ['from-[#1e3a24]', 'to-[#3a7a50]'],
  ['from-[#284a30]', 'to-[#4f9965]'],
  ['from-[#1a3828]', 'to-[#356b48]'],
  ['from-[#233d2a]', 'to-[#467954]'],
]

function BigCard({ p, active, onActivate }: { p: Practitioner; active: boolean; onActivate: () => void }) {
  const idx = p.first_name.charCodeAt(0) % headerGradients.length
  const [g1, g2] = headerGradients[idx]
  const initials = `${p.first_name[0]}${p.last_name[0]}`
  const tags = (p.practitioner_tags ?? []).slice(0, 4)

  const handleClick = (e: React.MouseEvent) => {
    if (!active) { e.preventDefault(); onActivate() }
  }

  return (
    <Link
      href={`/praticiens/${p.slug}`}
      onClick={handleClick}
      draggable={false}
      className={`block rounded-2xl overflow-hidden transition-all duration-500 select-none ${
        active ? 'shadow-2xl shadow-black/15 ring-2 ring-green/20' : 'shadow-md'
      }`}
    >
      {/* Header */}
      <div className={`relative bg-gradient-to-br ${g1} ${g2} h-[185px] md:h-[240px] p-4 md:p-5 flex flex-col justify-end overflow-hidden`}>
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute top-20 right-20 w-20 h-20 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-10 -left-6 w-36 h-36 rounded-full bg-black/10 pointer-events-none" />

        {/* Photo */}
        <div className="absolute top-5 right-5">
          {p.photo_url ? (
            <img
              src={p.photo_url}
              alt={`${p.first_name} ${p.last_name}`}
              className="w-[72px] h-[72px] rounded-2xl border-[3px] border-white/25 object-cover shadow-xl"
            />
          ) : (
            <div className="w-[72px] h-[72px] rounded-2xl border-[3px] border-white/25 bg-white/15 backdrop-blur-sm flex items-center justify-center text-2xl font-extrabold text-white shadow-xl">
              {initials}
            </div>
          )}
        </div>

        {/* Name block */}
        <div className="relative z-10">
          <p className="text-[10px] font-bold text-green-light/80 uppercase tracking-[1.5px] mb-1.5">
            {siteConfig.specialtyLabel}
          </p>
          <h3 className="text-[18px] md:text-[21px] font-extrabold text-white tracking-tight leading-tight">
            {p.first_name} {p.last_name}
          </h3>
          {p.neighborhood && (
            <p className="text-[11px] text-white/60 mt-1.5 flex items-center gap-1">
              <svg viewBox="0 0 10 12" width="9" fill="none">
                <path d="M5 1C2.79 1 1 2.79 1 5c0 3 4 7 4 7s4-4 4-7c0-2.21-1.79-4-4-4z" stroke="currentColor" strokeWidth="1.1" fill="currentColor" fillOpacity=".3"/>
              </svg>
              {p.neighborhood}
            </p>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="bg-white p-5 space-y-3.5">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {tags.map(t => (
              <span key={t.id} className="bg-green/8 text-green-dark text-[10px] font-bold px-2.5 py-1 rounded-full border border-green/10">
                {t.label}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <ModeTag mode={p.consultation_mode} />
          {p.hourly_rate && (
            <span className="text-[16px] font-extrabold text-green-dark">
              {p.hourly_rate} €<span className="text-[11px] font-normal text-muted">/séance</span>
            </span>
          )}
        </div>

        <div className={`text-center font-bold text-[13px] py-3 rounded-xl transition-all duration-300 ${
          active
            ? 'bg-green text-white shadow-md shadow-green/25'
            : 'bg-surface text-green-dark/50'
        }`}>
          Voir le profil →
        </div>
      </div>
    </Link>
  )
}

export default function PractitionerShowcase({ practitioners }: { practitioners: Practitioner[] }) {
  const [current, setCurrent] = useState(0)
  const [containerW, setContainerW] = useState(760)
  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartX = useRef(0)
  const total = practitioners.length

  useEffect(() => {
    const update = () => {
      if (containerRef.current) setContainerW(containerRef.current.clientWidth)
    }
    update()
    const ro = new ResizeObserver(update)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => ro.disconnect()
  }, [])

  const cardW = Math.min(containerW * 0.78, 480)
  const gap = 20
  const peek = (containerW - cardW) / 2
  const trackX = peek - current * (cardW + gap)

  const prev = useCallback(() => setCurrent(i => (i - 1 + total) % total), [total])
  const next = useCallback(() => setCurrent(i => (i + 1) % total), [total])

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev()
  }

  if (total === 0) {
    return (
      <div className="text-center py-16 text-muted">
        <p className="text-sm font-medium mb-2">Aucun praticien référencé pour le moment.</p>
        <a href="/inscription" className="text-green text-xs">Rejoindre le réseau →</a>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Carousel viewport */}
      <div
        ref={containerRef}
        className="overflow-hidden -mx-4 md:-mx-10"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div
          className="flex py-4"
          style={{
            transform: `translateX(${trackX}px)`,
            transition: 'transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            gap: `${gap}px`,
            willChange: 'transform',
          }}
        >
          {practitioners.map((p, i) => (
            <div
              key={p.id}
              className="flex-shrink-0"
              style={{ width: `${cardW}px` }}
            >
              <div className={`transition-all duration-500 origin-bottom ${
                i === current ? 'opacity-100 scale-100' : 'opacity-45 scale-[0.93]'
              }`}>
                <BigCard p={p} active={i === current} onActivate={() => setCurrent(i)} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation */}
      {total > 1 && (
        <div className="flex items-center justify-center gap-5 mt-3">
          <button
            onClick={prev}
            className="w-10 h-10 rounded-full border-2 border-border flex items-center justify-center text-muted hover:border-green hover:text-green-dark transition-colors"
            aria-label="Précédent"
          >
            <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
              <path d="M6 1L1 6l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <div className="flex items-center gap-2">
            {practitioners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Praticien ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === current ? 'w-6 h-2.5 bg-green' : 'w-2.5 h-2.5 bg-border hover:bg-green/40'
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            className="w-10 h-10 rounded-full bg-green flex items-center justify-center text-white hover:bg-green-dark transition-colors shadow-md shadow-green/25"
            aria-label="Suivant"
          >
            <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
              <path d="M1 1l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
