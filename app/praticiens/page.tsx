import { getPractitioners, getCityCenter } from '@/lib/queries'
import { siteConfig } from '@/lib/config'
import type { Metadata } from 'next'
import PractitionerRow from '@/components/practitioners/PractitionerRow'
import FilterSidebar from '@/components/practitioners/FilterSidebar'
import SortSelect from '@/components/practitioners/SortSelect'
import { Suspense } from 'react'
import type { ConsultationMode } from '@/lib/types'
import PractitionersMapWrapper from '@/components/practitioners/PractitionersMapWrapper'

export const revalidate = 3600

export const metadata: Metadata = {
  title: `${siteConfig.specialtyPlural} à ${siteConfig.cityLabel}`,
  description: `Trouvez votre ${siteConfig.specialtyLabel.toLowerCase()} à ${siteConfig.cityLabel}. Certifiés, consultations en cabinet ou en ligne.`,
}

interface Props {
  searchParams: Promise<{ mode?: string; quartier?: string; prix?: string; tag?: string; sort?: string }>
}

export default async function AnnuairePage({ searchParams }: Props) {
  const params = await searchParams
  const [allPractitioners, cityCenter] = await Promise.all([getPractitioners(), getCityCenter()])

  // Apply filters
  let filtered = allPractitioners

  if (params.mode && params.mode !== 'all') {
    filtered = filtered.filter((p) => p.consultation_mode === (params.mode as ConsultationMode))
  }

  if (params.quartier) {
    filtered = filtered.filter((p) =>
      p.neighborhood?.toLowerCase().includes(params.quartier!.toLowerCase())
    )
  }

  if (params.prix === 'lt60') {
    filtered = filtered.filter((p) => p.hourly_rate !== null && p.hourly_rate < 60)
  } else if (params.prix === '60-80') {
    filtered = filtered.filter((p) => p.hourly_rate !== null && p.hourly_rate >= 60 && p.hourly_rate <= 80)
  } else if (params.prix === 'gt80') {
    filtered = filtered.filter((p) => p.hourly_rate !== null && p.hourly_rate > 80)
  }

  if (params.tag) {
    filtered = filtered.filter((p) =>
      p.practitioner_tags?.some((t) =>
        t.label.toLowerCase().includes(params.tag!.toLowerCase())
      )
    )
  }

  // Tri
  if (params.sort === 'alpha') {
    filtered = [...filtered].sort((a, b) =>
      `${a.last_name} ${a.first_name}`.localeCompare(`${b.last_name} ${b.first_name}`)
    )
  } else if (params.sort === 'price') {
    filtered = [...filtered].sort((a, b) => (a.hourly_rate ?? 999) - (b.hourly_rate ?? 999))
  } else {
    // Par défaut : premium en premier
    filtered = [...filtered].sort((a, b) => (b.is_premium ? 1 : 0) - (a.is_premium ? 1 : 0))
  }

  return (
    <>
      <div className="bg-green-dark px-10 py-9">
        <div className="max-w-[1060px] mx-auto">
          <p className="text-[10px] font-bold text-green-light uppercase tracking-[2px] mb-2">
            {siteConfig.cityLabel} &amp; région
          </p>
          <h1 className="text-[26px] font-extrabold text-white tracking-tight mb-1.5">
            {allPractitioners.length} {siteConfig.specialtyLabel.toLowerCase()}s à {siteConfig.cityLabel}
          </h1>
          <p className="text-[13px] text-white/65">
            Praticiens certifiés — en cabinet, en ligne ou les deux
          </p>
        </div>
      </div>

      {/* Carte interactive */}
      <div className="max-w-[1060px] mx-auto px-10 py-6">
        <p className="text-[11px] font-bold text-muted uppercase tracking-[1px] mb-3">
          Carte des praticiens
        </p>
        <PractitionersMapWrapper practitioners={filtered} cityLat={cityCenter.lat} cityLng={cityCenter.lng} />
      </div>

      <div
        className="max-w-[1060px] mx-auto px-10 py-7 grid gap-7"
        style={{ gridTemplateColumns: '220px 1fr' }}
      >
        <Suspense fallback={<div className="text-sm text-muted">Chargement...</div>}>
          <FilterSidebar />
        </Suspense>

        <div>
          <div className="flex justify-between items-center mb-[18px]">
            <p className="text-[13px] font-semibold text-green-dark">
              {filtered.length} praticien{filtered.length > 1 ? 's' : ''} trouvé{filtered.length > 1 ? 's' : ''}
            </p>
            <Suspense>
              <SortSelect />
            </Suspense>
          </div>
          <div className="flex flex-col gap-3.5">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-muted">
                <p className="text-sm font-medium">Aucun praticien ne correspond à ces filtres.</p>
                <a href="/praticiens" className="text-green text-xs mt-2 inline-block">Réinitialiser les filtres</a>
              </div>
            ) : (
              filtered.map((p) => <PractitionerRow key={p.id} practitioner={p} />)
            )}
          </div>
        </div>
      </div>
    </>
  )
}

// Extracted to allow Suspense boundary (uses useSearchParams internally)
function ModeChips() {
  return (
    <>
      {[
        { label: 'Tous', value: 'all' },
        { label: 'Cabinet', value: 'cabinet' },
        { label: 'En ligne', value: 'online' },
        { label: 'Les deux', value: 'both' },
      ].map((f) => (
        <a
          key={f.value}
          href={f.value === 'all' ? '/praticiens' : `/praticiens?mode=${f.value}`}
          className="px-3.5 py-1.5 rounded-full border-[1.5px] text-[11px] font-semibold transition-colors border-border text-muted bg-white hover:border-green hover:text-green-dark hover:bg-surface"
        >
          {f.label}
        </a>
      ))}
      <div className="w-px h-4 bg-border mx-1" />
      <span className="text-[11px] font-bold text-muted uppercase tracking-[1px] mr-1">Spécialité :</span>
      {['Stress & Anxiété', 'Sommeil', 'Burn-out', 'Confiance en soi'].map((tag) => (
        <a
          key={tag}
          href={`/praticiens?tag=${encodeURIComponent(tag)}`}
          className="px-3.5 py-1.5 rounded-full border-[1.5px] text-[11px] font-semibold transition-colors border-border text-muted bg-white hover:border-green hover:text-green-dark hover:bg-surface"
        >
          {tag}
        </a>
      ))}
    </>
  )
}
