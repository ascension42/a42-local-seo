'use client'
import { useState } from 'react'
import PractitionerRow from './PractitionerRow'
import type { Practitioner } from '@/lib/types'

export default function PractitionerCarousel({ practitioners }: { practitioners: Practitioner[] }) {
  const [idx, setIdx] = useState(0)
  const total = practitioners.length

  if (total === 0) return null
  if (total === 1) return <PractitionerRow practitioner={practitioners[0]} />

  const prev = () => setIdx(i => (i - 1 + total) % total)
  const next = () => setIdx(i => (i + 1) % total)

  return (
    <div className="space-y-5">
      {/* Card with slide context hint */}
      <div className="relative">
        {/* Shadow cards behind (depth effect) */}
        {idx + 1 < total && (
          <div className="absolute inset-x-0 bottom-0 top-2 mx-3 bg-white border border-border rounded-xl opacity-40 -z-10" />
        )}
        {idx + 2 < total && (
          <div className="absolute inset-x-0 bottom-0 top-4 mx-6 bg-white border border-border rounded-xl opacity-20 -z-20" />
        )}
        <PractitionerRow practitioner={practitioners[idx]} />
      </div>

      {/* Navigation row */}
      <div className="flex items-center justify-between">
        {/* Dot indicators */}
        <div className="flex items-center gap-1.5">
          {practitioners.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              aria-label={`Praticien ${i + 1}`}
              className={`rounded-full transition-all duration-200 ${
                i === idx ? 'w-5 h-2 bg-green' : 'w-2 h-2 bg-border hover:bg-green/40'
              }`}
            />
          ))}
        </div>

        {/* Counter + arrows */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted tabular-nums">{idx + 1} / {total}</span>
          <button
            onClick={prev}
            aria-label="Praticien précédent"
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted hover:border-green hover:text-green-dark transition-colors"
          >
            <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
              <path d="M6 1L1 6l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label="Praticien suivant"
            className="w-9 h-9 rounded-full bg-green text-white flex items-center justify-center hover:bg-green-dark transition-colors"
          >
            <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
              <path d="M1 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
