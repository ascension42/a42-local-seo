import Link from 'next/link'
import { siteConfig } from '@/lib/config'

export default function Hero({ practitionerCount, neighborhoodCount, tagCount }: { practitionerCount: number; neighborhoodCount: number; tagCount: number }) {
  return (
    <div className="relative h-[420px] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-dark via-[#3c6947] to-green" />
      <div className="absolute inset-0 bg-gradient-to-r from-green-deep/90 via-green-deep/60 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-center px-12 text-white" style={{width:'55%'}}>
        <p className="text-[10px] font-semibold uppercase tracking-[2.5px] text-green-light mb-3.5">
          {siteConfig.cityLabel} &amp; région
        </p>
        <h1 className="text-[34px] leading-[1.15] mb-4 tracking-tight text-white">
          Trouvez votre<br />
          {siteConfig.specialtyLabel.toLowerCase()} à<br />
          <span className="text-green-light">{siteConfig.cityLabel}</span>
        </h1>
        <p className="text-[13px] text-white/80 leading-[1.65] mb-7 max-w-[340px]">
          Praticiens certifiés, vérifiés. Consultations en cabinet ou en ligne — adaptées à vos besoins.
        </p>
        <div className="flex gap-3 items-center">
          <Link href="/praticiens" className="bg-green text-white font-bold text-[13px] px-6 py-[11px] rounded-md hover:bg-[#4faa73] transition-colors">
            Voir les praticiens
          </Link>
          <Link href="/inscription" className="text-white/75 text-xs font-medium hover:text-white transition-colors">
            Inscrire mon cabinet →
          </Link>
        </div>
      </div>
      <div className="absolute bottom-7 right-10 flex gap-7">
        {[
          { num: practitionerCount, label: 'Praticiens' },
          { num: tagCount, label: 'Spécialités' },
          { num: neighborhoodCount, label: 'Zones' },
        ].map(({ num, label }) => (
          <div key={label} className="text-center text-white">
            <span className="block text-[22px] font-extrabold text-green-light">{num}</span>
            <span className="text-[10px] font-medium text-white/65 uppercase tracking-[1px]">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
