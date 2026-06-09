import Link from 'next/link'
import type { Practitioner } from '@/lib/types'
import ModeTag from './ModeTag'
import { siteConfig } from '@/lib/config'

interface Props { practitioner: Practitioner }

const avatarGradients = [
  'from-green-dark to-green',
  'from-[#3c6947] to-[#5cbe83]',
  'from-[#467954] to-[#6ab885]',
  'from-[#2e5537] to-[#4f8a60]',
]

export default function PractitionerRow({ practitioner: p }: Props) {
  const idx = p.first_name.charCodeAt(0) % avatarGradients.length
  const initials = `${p.first_name[0]}${p.last_name[0]}`
  const tags = p.practitioner_tags ?? []

  return (
    <Link
      href={`/praticiens/${p.slug}`}
      className="flex flex-col sm:grid sm:gap-4 sm:items-center p-4 sm:p-[18px] rounded-xl bg-white border-[1.5px] border-border transition-all duration-150 hover:shadow-md hover:-translate-y-px hover:border-green/40"
      style={{ gridTemplateColumns: '72px 1fr auto' }}
    >
      <div className="flex gap-3 sm:contents">
        {p.photo_url ? (
          <img src={p.photo_url} alt={`${p.first_name} ${p.last_name}`}
            className="w-16 h-16 rounded-full object-cover shrink-0" />
        ) : (
          <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${avatarGradients[idx]} flex items-center justify-center text-xl font-extrabold text-white shrink-0`}>
            {initials}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <span className="text-[15px] font-extrabold text-green-dark">{p.first_name} {p.last_name}</span>
          <p className="text-[10px] font-bold text-green uppercase tracking-[0.8px] mb-1.5 mt-0.5">
            {siteConfig.specialtyLabel} certifié
          </p>
          <div className="flex flex-wrap gap-1 mb-1.5">
            {tags.slice(0, 4).map((t) => (
              <span key={t.id} className="bg-surface text-green-dark text-[10px] font-medium px-2 py-0.5 rounded-lg">
                {t.label}
              </span>
            ))}
          </div>
          <p className="text-[11px] text-muted">
            {p.neighborhood}{p.hourly_rate ? ` · ${p.hourly_rate} €/séance` : ''}{p.years_active ? ` · ${p.years_active}` : ''}
          </p>
        </div>
      </div>
      <div className="flex flex-row sm:flex-col gap-2 items-start sm:items-end mt-3 sm:mt-0">
        <ModeTag mode={p.consultation_mode} />
        <span className="text-[11px] font-bold px-4 py-2 rounded-md whitespace-nowrap bg-bg-alt text-green-dark border border-border">
          Voir le profil
        </span>
      </div>
    </Link>
  )
}
