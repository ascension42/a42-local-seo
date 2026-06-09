import { getPractitioners, getCityCenter } from '@/lib/queries'
import { siteConfig } from '@/lib/config'
import type { Metadata } from 'next'
import PractitionerRow from '@/components/practitioners/PractitionerRow'
import PractitionersMapWrapper from '@/components/practitioners/PractitionersMapWrapper'

export const revalidate = 3600

export const metadata: Metadata = {
  title: `${siteConfig.specialtyPlural} à ${siteConfig.cityLabel}`,
  description: `Trouvez votre ${siteConfig.specialtyLabel.toLowerCase()} à ${siteConfig.cityLabel}. Certifiés, consultations en cabinet ou en ligne.`,
}

export default async function AnnuairePage() {
  const [practitioners, cityCenter] = await Promise.all([getPractitioners(), getCityCenter()])

  return (
    <>
      {/* Header */}
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

      {/* Practitioner list */}
      <div className="max-w-[760px] mx-auto px-4 md:px-10 py-8 md:py-10">
        {practitioners.length === 0 ? (
          <div className="text-center py-16 text-muted">
            <p className="text-sm font-medium mb-2">Aucun praticien référencé pour le moment.</p>
            <a href="/inscription" className="text-green text-xs">Rejoindre le réseau →</a>
          </div>
        ) : (
          <div className="flex flex-col gap-3.5">
            {practitioners.map((p) => (
              <PractitionerRow key={p.id} practitioner={p} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <a
            href="/inscription"
            className="inline-block text-[13px] font-semibold text-green border-b-2 border-green pb-px hover:text-green-dark transition-colors"
          >
            Rejoindre le réseau →
          </a>
        </div>
      </div>

      {/* Map — at bottom */}
      <div className="bg-bg-alt border-t border-border py-8 px-4 md:px-10">
        <div className="max-w-[760px] mx-auto">
          <p className="text-[11px] font-bold text-muted uppercase tracking-[1px] mb-3">
            Carte des praticiens
          </p>
          <PractitionersMapWrapper
            practitioners={practitioners}
            cityLat={cityCenter.lat}
            cityLng={cityCenter.lng}
          />
        </div>
      </div>
    </>
  )
}
