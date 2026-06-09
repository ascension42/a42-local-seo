'use client'

import Link from 'next/link'
import { track } from '@/lib/analytics'

export default function HeroCTAs() {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      <Link
        href="/praticiens"
        onClick={() => track({ name: 'hero_cta_practitioners_clicked' })}
        className="bg-green text-white font-bold text-[13px] px-6 py-[11px] rounded-md hover:bg-[#4faa73] transition-colors"
      >
        Voir les praticiens
      </Link>
      <Link
        href="/inscription"
        onClick={() => track({ name: 'hero_cta_inscription_clicked' })}
        className="text-white/75 text-xs font-medium hover:text-white transition-colors"
      >
        Inscrire mon cabinet →
      </Link>
    </div>
  )
}
