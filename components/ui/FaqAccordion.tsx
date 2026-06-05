'use client'
import { useState } from 'react'

interface Item {
  q: string
  a: string
}

export default function FaqAccordion({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div className="space-y-2">
      {items.map(({ q, a }, i) => {
        const isOpen = open === i
        return (
          <div
            key={q}
            className={`border rounded-xl overflow-hidden transition-colors ${
              isOpen ? 'border-green' : 'border-border'
            }`}
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left gap-4 hover:bg-surface/50 transition-colors"
            >
              <span className="text-sm font-bold text-green-dark leading-snug">{q}</span>
              <span className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                isOpen ? 'bg-green' : 'bg-bg-alt'
              }`}>
                <svg viewBox="0 0 12 12" width="10" fill="none">
                  <path
                    d={isOpen ? 'M2 6h8' : 'M6 2v8M2 6h8'}
                    stroke={isOpen ? 'white' : '#7e9f85'}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </button>
            {isOpen && (
              <div className="px-5 pb-5 pt-1 border-t border-border">
                <p className="text-[13px] text-muted leading-[1.8]">{a}</p>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
