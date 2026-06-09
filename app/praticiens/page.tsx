import { Suspense } from 'react'
import { getPractitioners, getCityCenter } from '@/lib/queries'
import { siteConfig } from '@/lib/config'
import type { Metadata } from 'next'
import PractitionerDirectory from '@/components/practitioners/PractitionerDirectory'

export const revalidate = 3600

export const metadata: Metadata = {
  title: `${siteConfig.specialtyPlural} à ${siteConfig.cityLabel}`,
  description: `Trouvez votre ${siteConfig.specialtyLabel.toLowerCase()} à ${siteConfig.cityLabel}. Certifiés, consultations en cabinet ou en ligne.`,
}

export default async function AnnuairePage({ searchParams }: { searchParams: Promise<{ tag?: string }> }) {
  const [practitioners, cityCenter] = await Promise.all([getPractitioners(), getCityCenter()])

  // Compute top 4 tags by frequency
  const tagCounts = new Map<string, number>()
  for (const p of practitioners) {
    for (const t of p.practitioner_tags ?? []) {
      tagCounts.set(t.label, (tagCounts.get(t.label) ?? 0) + 1)
    }
  }
  const topTags = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([label]) => label)

  const initialTag = (await searchParams).tag ?? ''

  return (
    <>
      {/* Green header */}
      <div className="bg-green-dark px-4 md:px-10 py-7 md:py-9">
        <div className="max-w-[760px] mx-auto">
          <p className="text-[10px] font-bold text-green-light uppercase tracking-[2px] mb-2">
            {siteConfig.cityLabel} &amp; région
          </p>
          <h1 className="text-[26px] font-extrabold text-white tracking-tight mb-1.5">
            {practitioners.length} {siteConfig.specialtyLabel.toLowerCase()}{practitioners.length > 1 ? 's' : ''} à {siteConfig.cityLabel}
          </h1>
          <p className="text-[13px] text-white/65">
            Praticiens certifiés &amp; vérifiés — en cabinet, en ligne ou les deux
          </p>
        </div>
      </div>

      {/* Directory with filters, carousel, map */}
      <div className="max-w-[760px] mx-auto px-4 md:px-10 py-8 md:py-10">
        <Suspense fallback={<div className="animate-pulse h-64 bg-surface rounded-xl" />}>
          <PractitionerDirectory
            practitioners={practitioners}
            topTags={topTags}
            cityLat={cityCenter.lat}
            cityLng={cityCenter.lng}
            initialTag={initialTag}
          />
        </Suspense>
      </div>
    </>
  )
}
