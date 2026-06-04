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
      className={[
        'grid gap-4 items-center p-[18px] rounded-xl bg-white transition-all duration-150',
        'hover:shadow-md hover:-translate-y-px',
        p.is_premium ? 'border-[1.5px] border-green' : 'border-[1.5px] border-border',
      ].join(' ')}
      style={{ gridTemplateColumns: '72px 1fr auto' }}
    >
      <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${avatarGradients[idx]} flex items-center justify-center text-xl font-extrabold text-white shrink-0`}>
        {initials}
      </div>
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[15px] font-extrabold text-green-dark">{p.first_name} {p.last_name}</span>
          {p.is_premium && (
            <span className="text-[9px] font-bold bg-green text-white px-1.5 py-0.5 rounded-lg uppercase tracking-[0.3px]">
              Premium
            </span>
          )}
        </div>
        <p className="text-[10px] font-bold text-green uppercase tracking-[0.8px] mb-1.5">
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
          {p.neighborhood}{p.hourly_rate ? ` · ${p.hourly_rate} €/séance` : ''}{p.years_active ? ` · En activité depuis ${p.years_active}` : ''}
        </p>
      </div>
      <div className="flex flex-col gap-2 items-end">
        <ModeTag mode={p.consultation_mode} />
        <span className="text-[11px] font-bold px-4 py-2 rounded-md whitespace-nowrap bg-bg-alt text-green-dark border border-border">
          Voir le profil
        </span>
      </div>
    </Link>
  )
}
