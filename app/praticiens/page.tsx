import { getPractitioners } from '@/lib/queries'
import { siteConfig } from '@/lib/config'
import type { Metadata } from 'next'
import PractitionerRow from '@/components/practitioners/PractitionerRow'
import FilterSidebar from '@/components/practitioners/FilterSidebar'
import { Suspense } from 'react'

export const revalidate = 3600

export const metadata: Metadata = {
  title: `${siteConfig.specialtyPlural} à ${siteConfig.cityLabel}`,
  description: `Trouvez votre ${siteConfig.specialtyLabel.toLowerCase()} à ${siteConfig.cityLabel}. Certifiés, consultations en cabinet ou en ligne.`,
}

export default async function AnnuairePage() {
  const practitioners = await getPractitioners()

  return (
    <>
      <div className="bg-green-dark px-10 py-9">
        <div className="max-w-[1060px] mx-auto">
          <p className="text-[10px] font-bold text-green-light uppercase tracking-[2px] mb-2">
            {siteConfig.cityLabel} &amp; région
          </p>
          <h1 className="text-[26px] font-extrabold text-white tracking-tight mb-1.5">
            {practitioners.length} {siteConfig.specialtyLabel.toLowerCase()}s à {siteConfig.cityLabel}
          </h1>
          <p className="text-[13px] text-white/65">
            Praticiens certifiés — en cabinet, en ligne ou les deux
          </p>
        </div>
      </div>

      <div className="bg-white border-b border-border px-10 py-3.5">
        <div className="max-w-[1060px] mx-auto flex gap-2.5 items-center flex-wrap">
          <span className="text-[11px] font-bold text-muted uppercase tracking-[1px] mr-1">Mode :</span>
          {['Tous', 'Cabinet', 'En ligne'].map((f) => (
            <button
              key={f}
              className={[
                'px-3.5 py-1.5 rounded-full border-[1.5px] text-[11px] font-semibold transition-colors',
                f === 'Tous'
                  ? 'border-green text-green-dark bg-surface'
                  : 'border-border text-muted bg-white hover:border-green hover:text-green-dark hover:bg-surface',
              ].join(' ')}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div
        className="max-w-[1060px] mx-auto px-10 py-7 grid gap-7"
        style={{ gridTemplateColumns: '220px 1fr' }}
      >
        <Suspense fallback={<div className="text-sm text-muted">Chargement des filtres...</div>}>
          <FilterSidebar />
        </Suspense>

        <div>
          <div className="flex justify-between items-center mb-[18px]">
            <p className="text-[13px] font-semibold text-green-dark">
              {practitioners.length} praticiens trouvés
            </p>
            <select className="border-[1.5px] border-border rounded-md px-2.5 py-1.5 text-xs text-ink bg-white cursor-pointer font-sans">
              <option>Mis en avant</option>
              <option>Alphabétique</option>
              <option>Tarif croissant</option>
            </select>
          </div>
          <div className="flex flex-col gap-3.5">
            {practitioners.map((p) => (
              <PractitionerRow key={p.id} practitioner={p} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
