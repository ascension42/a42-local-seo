import { Suspense } from 'react'
import { getPractitioners, getCityCenter } from '@/lib/queries'
import { siteConfig } from '@/lib/config'
import type { Metadata } from 'next'
import PractitionerDirectory from '@/components/practitioners/PractitionerDirectory'

export const revalidate = 3600

const siteUrl = `https://${siteConfig.domain}`
const sp = siteConfig.specialtyLabel.toLowerCase()
const city = siteConfig.cityLabel

export async function generateMetadata(): Promise<Metadata> {
  const practitioners = await getPractitioners()
  const count = practitioners.length
  return {
    title: `${count} ${siteConfig.specialtyLabel.toLowerCase()}${count > 1 ? 's' : ''} à ${city} — Annuaire certifié`,
    description: `Trouvez votre ${sp} certifié RNCP à ${city}. ${count} praticien${count > 1 ? 's' : ''} vérifiés — consultations en cabinet, en ligne ou les deux. Prise de rendez-vous directe.`,
    alternates: { canonical: `${siteUrl}/praticiens` },
    openGraph: {
      title: `${count} ${sp}${count > 1 ? 's' : ''} à ${city} — Annuaire complet`,
      description: `${count} ${sp}${count > 1 ? 's' : ''} certifiés RNCP à ${city}. Consultations en cabinet ou en ligne.`,
      url: `${siteUrl}/praticiens`,
      type: 'website',
    },
  }
}

export default async function AnnuairePage({ searchParams }: { searchParams: Promise<{ tag?: string }> }) {
  const [practitioners, cityCenter] = await Promise.all([getPractitioners(), getCityCenter()])

  // All tags sorted by frequency
  const tagCounts = new Map<string, number>()
  for (const p of practitioners) {
    for (const t of p.practitioner_tags ?? []) {
      tagCounts.set(t.label, (tagCounts.get(t.label) ?? 0) + 1)
    }
  }
  const allTags = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([label]) => label)

  const initialTag = (await searchParams).tag ?? ''

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${siteConfig.specialtyPlural} certifiés à ${city}`,
    description: `Liste des ${sp}s certifiés RNCP à ${city}`,
    url: `${siteUrl}/praticiens`,
    numberOfItems: practitioners.length,
    itemListElement: practitioners.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${p.first_name} ${p.last_name} — ${siteConfig.specialtyLabel} à ${city}`,
      url: `${siteUrl}/praticiens/${p.slug}`,
    })),
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: `${siteConfig.specialtyPlural} à ${city}`, item: `${siteUrl}/praticiens` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
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

      {/* Directory — manages its own layout */}
      <Suspense fallback={<div className="animate-pulse h-64 bg-surface mx-4 md:mx-10 mt-8 rounded-xl" />}>
        <PractitionerDirectory
          practitioners={practitioners}
          allTags={allTags}
          cityLat={cityCenter.lat}
          cityLng={cityCenter.lng}
          initialTag={initialTag}
        />
      </Suspense>
    </>
  )
}
