import Link from 'next/link'
import type { Practitioner } from '@/lib/types'
import ModeTag from './ModeTag'

interface Props { practitioner: Practitioner }

const avatarGradients = [
  'from-green-dark to-green',
  'from-[#3c6947] to-[#5cbe83]',
  'from-[#467954] to-[#6ab885]',
]

export default function PractitionerCard({ practitioner: p }: Props) {
  const idx = p.first_name.charCodeAt(0) % avatarGradients.length
  const initials = `${p.first_name[0]}${p.last_name[0]}`
  const tags = p.practitioner_tags ?? []

  return (
    <Link
      href={`/praticiens/${p.slug}`}
      className={[
        'block bg-white rounded-xl overflow-hidden transition-all duration-200',
        'hover:shadow-lg hover:-translate-y-0.5',
        p.is_premium ? 'border-[1.5px] border-green' : 'border-[1.5px] border-border',
      ].join(' ')}
    >
      <div className="h-[130px] relative bg-bg-alt flex items-center justify-center">
        <div className={`w-[72px] h-[72px] rounded-full border-[3px] border-white bg-gradient-to-br ${avatarGradients[idx]} flex items-center justify-center text-[26px] font-extrabold text-white`}>
          {initials}
        </div>
        {p.is_premium && (
          <span className="absolute top-2.5 left-2.5 bg-green-dark text-white text-[9px] font-bold px-2 py-0.5 rounded-[10px] uppercase tracking-[0.5px]">
            Premium
          </span>
        )}
        <span className="absolute top-2.5 right-2.5">
          <ModeTag mode={p.consultation_mode} />
        </span>
      </div>
      <div className="p-4">
        <p className="text-[10px] font-bold text-green uppercase tracking-[1px] mb-0.5">
          {p.certification ?? 'Sophrologue'}
        </p>
        <h3 className="text-[15px] font-extrabold text-green-dark mb-0.5">
          {p.first_name} {p.last_name}
        </h3>
        <p className="text-[11px] text-muted mb-2.5">
          {p.neighborhood}{p.hourly_rate ? ` — ${p.hourly_rate} €/séance` : ''}
        </p>
        <div className="flex flex-wrap gap-1 mb-3.5">
          {tags.slice(0, 3).map((t) => (
            <span key={t.id} className="bg-surface text-green-dark text-[10px] font-medium px-2 py-0.5 rounded-[10px]">
              {t.label}
            </span>
          ))}
        </div>
        <div className="h-px bg-[#f0ede8] mb-3.5" />
        <span className={[
          'block text-center text-xs font-bold py-2 rounded-md w-full',
          p.is_premium ? 'bg-green text-white' : 'bg-bg-alt text-green-dark border border-border',
        ].join(' ')}>
          {p.is_premium ? 'Prendre rendez-vous' : 'Voir le profil'}
        </span>
      </div>
    </Link>
  )
}
