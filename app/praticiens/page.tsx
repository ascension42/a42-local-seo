import { getPractitioners, getCityCenter } from '@/lib/queries'
import { siteConfig } from '@/lib/config'
import type { Metadata } from 'next'
import Link from 'next/link'
import PractitionersMapWrapper from '@/components/practitioners/PractitionersMapWrapper'
import ModeTag from '@/components/practitioners/ModeTag'

export const revalidate = 3600

export const metadata: Metadata = {
  title: `${siteConfig.specialtyPlural} à ${siteConfig.cityLabel}`,
  description: `Trouvez votre ${siteConfig.specialtyLabel.toLowerCase()} à ${siteConfig.cityLabel}. Certifiés, consultations en cabinet ou en ligne.`,
}

const avatarGradients = [
  'from-green-dark to-green',
  'from-[#3c6947] to-[#5cbe83]',
  'from-[#467954] to-[#6ab885]',
  'from-[#2e5537] to-[#4f8a60]',
]

export default async function AnnuairePage() {
  const [practitioners, cityCenter] = await Promise.all([getPractitioners(), getCityCenter()])

  return (
    <>
      {/* Header */}
      <div className="bg-green-dark px-4 md:px-10 py-7 md:py-9">
        <div className="max-w-[900px] mx-auto">
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

      {/* Practitioner grid */}
      <div className="max-w-[900px] mx-auto px-4 md:px-10 py-8 md:py-10">
        {practitioners.length === 0 ? (
          <div className="text-center py-16 text-muted">
            <p className="text-sm font-medium mb-2">Aucun praticien référencé pour le moment.</p>
            <a href="/inscription" className="text-green text-xs">Rejoindre le réseau →</a>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {practitioners.map((p) => {
              const idx = p.first_name.charCodeAt(0) % avatarGradients.length
              const initials = `${p.first_name[0]}${p.last_name[0]}`
              const tags = (p.practitioner_tags ?? []).slice(0, 3)

              return (
                <Link
                  key={p.id}
                  href={`/praticiens/${p.slug}`}
                  className="flex gap-4 items-center bg-white border-[1.5px] border-border rounded-xl px-4 py-4 hover:shadow-md hover:border-green/40 hover:-translate-y-px transition-all duration-150"
                >
                  {/* Avatar */}
                  {p.photo_url ? (
                    <img
                      src={p.photo_url}
                      alt={`${p.first_name} ${p.last_name}`}
                      className="w-[56px] h-[56px] rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className={`w-[56px] h-[56px] rounded-full bg-gradient-to-br ${avatarGradients[idx]} flex items-center justify-center text-[18px] font-extrabold text-white shrink-0`}>
                      {initials}
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-extrabold text-green-dark leading-tight">
                      {p.first_name} {p.last_name}
                    </p>
                    <p className="text-[10px] font-bold text-green uppercase tracking-[0.6px] mb-1.5">
                      {siteConfig.specialtyLabel} certifié
                    </p>
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {tags.map((t) => (
                          <span key={t.id} className="bg-surface text-green-dark text-[10px] font-medium px-2 py-0.5 rounded-md">
                            {t.label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right: mode + CTA */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <ModeTag mode={p.consultation_mode} />
                    <span className="text-[10px] font-bold px-3 py-1.5 rounded-md bg-green text-white whitespace-nowrap">
                      Voir →
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Map — at bottom */}
      <div className="bg-bg-alt border-t border-border py-8 px-4 md:px-10">
        <div className="max-w-[900px] mx-auto">
          <p className="text-[11px] font-bold text-muted uppercase tracking-[1px] mb-1">
            Carte des praticiens
          </p>
          <p className="text-[13px] text-ink mb-4">
            Trouvez votre {siteConfig.specialtyLabel.toLowerCase()} le plus proche sur la carte.
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
