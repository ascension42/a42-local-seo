import { siteConfig } from '@/lib/config'
import HeroCTAs from './HeroCTAs'

type HeroProps = {
  practitionerCount: number
  neighborhoodCount: number
  tagCount: number
  region?: string | null
  population?: number | null
}

export default function Hero({ practitionerCount, neighborhoodCount, tagCount, region, population }: HeroProps) {
  const isLargeCity = (population ?? 0) > 50_000

  const tagline = region
    ? isLargeCity
      ? `Praticiens certifiés et vérifiés à ${siteConfig.cityLabel} et dans son agglomération, en ${region} — en cabinet ou en ligne.`
      : `Praticiens certifiés et vérifiés au cœur de ${region} — un accompagnement de proximité, en cabinet ou en visioconférence.`
    : 'Praticiens certifiés, vérifiés. Consultations en cabinet ou en ligne — adaptées à vos besoins.'

  return (
    <div className="relative min-h-[420px] md:h-[420px] overflow-hidden">
      {/* Background image or gradient */}
      {siteConfig.heroImageUrl ? (
        <img
          src={siteConfig.heroImageUrl}
          alt={`${siteConfig.cityLabel} — ${siteConfig.specialtyLabel}`}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-green-dark via-[#3c6947] to-green" />
      )}
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-deep/90 via-green-deep/70 to-green-deep/30" />

      <div className="absolute inset-0 flex flex-col justify-center px-5 md:px-12 text-white w-full md:w-[60%]">
        <p className="text-[10px] font-semibold uppercase tracking-[2.5px] text-green-light mb-3.5">
          {siteConfig.cityLabel} &amp; région
        </p>
        <h1 className="text-[28px] md:text-[34px] leading-[1.15] mb-4 tracking-tight text-white">
          Trouvez votre<br />
          {siteConfig.specialtyLabel.toLowerCase()} à<br />
          <span className="text-green-light">{siteConfig.cityLabel}</span>
        </h1>
        <p className="text-[13px] text-white/80 leading-[1.65] mb-7 max-w-[340px]">
          {tagline}
        </p>
        <HeroCTAs />
      </div>

      {/* Stats — bottom right */}
      <div className="absolute bottom-4 right-3 md:bottom-7 md:right-10 flex gap-1 md:gap-2">
        {[
          { num: practitionerCount, label: 'Praticiens' },
          { num: tagCount, label: 'Spécialités' },
          { num: neighborhoodCount, label: 'Zones' },
        ].map(({ num, label }) => (
          <div key={label} className="text-center bg-black/30 backdrop-blur-sm px-1.5 py-1 md:px-4 md:py-2.5 rounded-md md:rounded-xl border border-white/10">
            <span className="block text-[13px] md:text-[24px] font-extrabold text-white leading-tight">{num}</span>
            <span className="text-[7px] md:text-[10px] font-semibold text-white/70 uppercase tracking-[0.3px] md:tracking-[1px]">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
