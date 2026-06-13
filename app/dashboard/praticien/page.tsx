import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { signOut } from '../actions'
import { siteConfig } from '@/lib/config'

export const dynamic = 'force-dynamic'

export default async function PractitionerDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/dashboard/login')

  // Get this user's practitioner profile
  const { data: practitioner } = await supabase
    .from('practitioners')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!practitioner) {
    return (
      <div className="min-h-screen bg-bg-alt flex items-center justify-center">
        <div className="bg-white rounded-2xl border border-border p-10 text-center max-w-[420px]">
          <p className="text-[10px] font-bold text-muted uppercase tracking-[2px] mb-3">Dashboard</p>
          <h1 className="text-xl font-extrabold text-green-dark mb-3">Profil non lié</h1>
          <p className="text-[13px] text-muted leading-[1.7]">
            Votre compte n'est pas encore associé à un profil praticien.
            Contactez l'administrateur pour lier votre compte.
          </p>
          <form action={signOut} className="mt-6">
            <button type="submit" className="text-xs font-semibold text-muted hover:text-ink transition-colors">
              Se déconnecter
            </button>
          </form>
        </div>
      </div>
    )
  }

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const [{ count: views }, { count: clicks }] = await Promise.all([
    supabase.from('profile_views').select('*', { count: 'exact', head: true })
      .eq('practitioner_id', practitioner.id).gte('viewed_at', since),
    supabase.from('booking_clicks').select('*', { count: 'exact', head: true })
      .eq('practitioner_id', practitioner.id).gte('clicked_at', since),
  ])

  // Weekly views for sparkline
  const { data: weeklyViews } = await supabase
    .from('profile_views')
    .select('viewed_at')
    .eq('practitioner_id', practitioner.id)
    .gte('viewed_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

  const dayBuckets: Record<string, number> = {}
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000)
    dayBuckets[d.toISOString().slice(0, 10)] = 0
  }
  for (const v of weeklyViews ?? []) {
    const day = v.viewed_at.slice(0, 10)
    if (day in dayBuckets) dayBuckets[day]++
  }
  const sparkData = Object.values(dayBuckets)
  const maxSpark = Math.max(...sparkData, 1)

  const modeLabel: Record<string, string> = {
    cabinet: 'En cabinet',
    online: 'En ligne',
    both: 'Cabinet & en ligne',
  }

  return (
    <div className="min-h-screen bg-bg-alt">
      {/* Header */}
      <div className="bg-green-dark px-8 py-5 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-green-light uppercase tracking-[2px] mb-0.5">
            Mon espace
          </p>
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            {practitioner.first_name} {practitioner.last_name}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <a
            href={`/praticiens/${practitioner.slug}`}
            target="_blank"
            className="text-xs font-semibold text-white/70 hover:text-white transition-colors"
          >
            Voir mon profil →
          </a>
          <form action={signOut}>
            <button type="submit" className="text-xs font-semibold text-white/60 hover:text-white transition-colors bg-white/10 px-4 py-2 rounded-lg">
              Déconnexion
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-8 py-8 space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-3 gap-5">
          {[
            { label: 'Vues profil (30j)', value: views ?? 0, sub: 'visiteurs uniques estimés' },
            { label: 'Clics réservation (30j)', value: clicks ?? 0, sub: 'vers votre agenda' },
            { label: 'Taux de clic', value: views ? `${Math.round(((clicks ?? 0) / views) * 100)}%` : '—', sub: 'vues → réservation' },
          ].map((k) => (
            <div key={k.label} className="bg-white rounded-2xl p-6 border border-border">
              <p className="text-[11px] font-bold text-muted uppercase tracking-[1px] mb-1">{k.label}</p>
              <p className="text-[36px] font-extrabold text-green-dark leading-none mb-1">{k.value}</p>
              <p className="text-[11px] text-muted">{k.sub}</p>
            </div>
          ))}
        </div>

        {/* Sparkline 7 jours */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <p className="text-[11px] font-bold text-muted uppercase tracking-[1px] mb-4">Vues profil — 7 derniers jours</p>
          <div className="flex items-end gap-2 h-[60px]">
            {sparkData.map((v, i) => {
              const dayLabel = new Date(Date.now() - (6 - i) * 86400000)
                .toLocaleDateString('fr-FR', { weekday: 'short' })
              return (
                <div key={i} className="flex flex-col items-center gap-1 flex-1">
                  <div
                    className="w-full rounded-t-md bg-green transition-all"
                    style={{ height: `${(v / maxSpark) * 50 + 4}px`, minHeight: '4px', opacity: v === 0 ? 0.2 : 1 }}
                    title={`${v} vue${v !== 1 ? 's' : ''}`}
                  />
                  <span className="text-[9px] text-muted capitalize">{dayLabel}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Profile summary */}
        <div className="bg-white rounded-2xl border border-border p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-extrabold text-green-dark">Votre profil</h2>
            <div className="flex gap-2">
              {practitioner.is_premium && (
                <span className="text-[9px] font-extrabold bg-green text-white px-2.5 py-1 rounded-full">Premium</span>
              )}
              {practitioner.is_verified && (
                <span className="text-[9px] font-extrabold bg-green-dark text-white px-2.5 py-1 rounded-full">Certifié ✓</span>
              )}
              {practitioner.accepting_patients && (
                <span className="text-[9px] font-extrabold bg-surface text-green-dark border border-green px-2.5 py-1 rounded-full">Accepte patients</span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            {[
              ['Mode', modeLabel[practitioner.consultation_mode] ?? '—'],
              ['Tarif', practitioner.hourly_rate ? `${practitioner.hourly_rate} €` : '—'],
              ['Quartier', practitioner.neighborhood ?? '—'],
              ['Certification', practitioner.certification ?? '—'],
              ['École', practitioner.school ?? '—'],
              ['Expérience', practitioner.years_active ? `${practitioner.years_active} ans` : '—'],
            ].map(([label, value]) => (
              <div key={String(label)} className="flex justify-between items-center py-2 border-b border-bg-alt text-xs">
                <span className="text-muted font-medium">{label}</span>
                <span className="font-semibold text-ink">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Next steps if incomplete */}
        {(!practitioner.bio || !practitioner.booking_url) && (
          <div className="bg-surface border border-green rounded-2xl p-6">
            <p className="text-[11px] font-bold text-green uppercase tracking-[1px] mb-3">Complétez votre profil</p>
            <div className="space-y-2.5">
              {!practitioner.bio && (
                <p className="text-[12px] text-ink">
                  <span className="text-green font-bold mr-2">→</span>
                  Ajoutez une biographie — les profils avec bio reçoivent 3× plus de clics.
                </p>
              )}
              {!practitioner.booking_url && !practitioner.doctolib_url && (
                <p className="text-[12px] text-ink">
                  <span className="text-green font-bold mr-2">→</span>
                  Ajoutez un lien de réservation (Doctolib, Cal.com, site perso).
                </p>
              )}
            </div>
            <p className="text-[11px] text-muted mt-4">
              Contactez <a href={`mailto:contact@${siteConfig.domain}`} className="text-green hover:underline">notre équipe</a> pour mettre à jour votre fiche.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
