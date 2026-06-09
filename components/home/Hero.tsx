import { siteConfig } from '@/lib/config'
import HeroCTAs from './HeroCTAs'

export default function Hero({ practitionerCount, neighborhoodCount, tagCount }: { practitionerCount: number; neighborhoodCount: number; tagCount: number }) {
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
          Praticiens certifiés, vérifiés. Consultations en cabinet ou en ligne — adaptées à vos besoins.
        </p>
        <HeroCTAs />
      </div>

      {/* Stats — bottom right */}
      <div className="absolute bottom-5 right-4 md:bottom-7 md:right-10 flex gap-1.5 md:gap-2">
        {[
          { num: practitionerCount, label: 'Praticiens' },
          { num: tagCount, label: 'Spécialités' },
          { num: neighborhoodCount, label: 'Zones' },
        ].map(({ num, label }) => (
          <div key={label} className="text-center bg-black/30 backdrop-blur-sm px-3 py-2 md:px-4 md:py-2.5 rounded-xl border border-white/10">
            <span className="block text-[20px] md:text-[24px] font-extrabold text-white leading-tight">{num}</span>
            <span className="text-[9px] md:text-[10px] font-semibold text-white/75 uppercase tracking-[1px]">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
