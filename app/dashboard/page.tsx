import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { signOut } from './actions'

export const dynamic = 'force-dynamic'

interface PractitionerStat {
  id: string
  first_name: string
  last_name: string
  slug: string
  is_premium: boolean
  is_verified: boolean
  accepting_patients: boolean
  views_30d: number
  clicks_30d: number
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/dashboard/login')

  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

  const [{ data: practitioners }, { data: views }, { data: clicks }, { data: inscriptions }] =
    await Promise.all([
      supabase.from('practitioners').select('id, first_name, last_name, slug, is_premium, is_verified, accepting_patients').order('is_premium', { ascending: false }),
      supabase.from('profile_views').select('practitioner_id').gte('viewed_at', since),
      supabase.from('booking_clicks').select('practitioner_id').gte('clicked_at', since),
      supabase.from('inscription_requests').select('id, first_name, last_name, email, status, created_at').order('created_at', { ascending: false }).limit(10),
    ])

  const viewsMap = (views ?? []).reduce<Record<string, number>>((acc, v) => {
    acc[v.practitioner_id] = (acc[v.practitioner_id] ?? 0) + 1
    return acc
  }, {})

  const clicksMap = (clicks ?? []).reduce<Record<string, number>>((acc, c) => {
    acc[c.practitioner_id] = (acc[c.practitioner_id] ?? 0) + 1
    return acc
  }, {})

  const stats: PractitionerStat[] = (practitioners ?? []).map((p) => ({
    ...p,
    views_30d: viewsMap[p.id] ?? 0,
    clicks_30d: clicksMap[p.id] ?? 0,
  }))

  const totalViews = Object.values(viewsMap).reduce((a, b) => a + b, 0)
  const totalClicks = Object.values(clicksMap).reduce((a, b) => a + b, 0)

  return (
    <div className="min-h-screen bg-bg-alt">
      {/* Header */}
      <div className="bg-green-dark px-8 py-5 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-bold text-green-light uppercase tracking-[2px] mb-0.5">
            Administration
          </p>
          <h1 className="text-xl font-extrabold text-white tracking-tight">
            Dashboard Praticiens
          </h1>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="text-xs font-semibold text-white/60 hover:text-white transition-colors bg-white/10 px-4 py-2 rounded-lg"
          >
            Déconnexion
          </button>
        </form>
      </div>

      <div className="max-w-[1100px] mx-auto px-8 py-8 space-y-8">
        {/* KPI cards */}
        <div className="grid grid-cols-3 gap-5">
          {[
            { label: 'Praticiens référencés', value: stats.length, sub: `${stats.filter((p) => p.is_premium).length} premium` },
            { label: 'Vues profil (30j)', value: totalViews, sub: 'toutes pages confondues' },
            { label: 'Clics réservation (30j)', value: totalClicks, sub: 'vers Doctolib / site perso' },
          ].map((k) => (
            <div key={k.label} className="bg-white rounded-2xl p-6 border border-border">
              <p className="text-[11px] font-bold text-muted uppercase tracking-[1px] mb-1">{k.label}</p>
              <p className="text-[36px] font-extrabold text-green-dark leading-none mb-1">{k.value}</p>
              <p className="text-[11px] text-muted">{k.sub}</p>
            </div>
          ))}
        </div>

        {/* Practitioners table */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-green-dark">Praticiens</h2>
            <span className="text-[11px] text-muted">Statistiques sur 30 jours</span>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-bg-alt">
                {['Praticien', 'Vues profil', 'Clics RDV', 'Statut', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-[10px] font-bold text-muted uppercase tracking-[1px]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {stats.map((p) => (
                <tr key={p.id} className="border-b border-bg-alt last:border-0 hover:bg-surface/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-bold text-green-dark">
                        {p.first_name} {p.last_name}
                      </p>
                      <p className="text-[10px] text-muted">{p.slug}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-extrabold text-green-dark">{p.views_30d}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-extrabold text-green-dark">{p.clicks_30d}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-1.5 flex-wrap">
                      {p.is_premium && (
                        <span className="text-[9px] font-extrabold bg-green text-white px-2 py-0.5 rounded-full">Premium</span>
                      )}
                      {p.is_verified && (
                        <span className="text-[9px] font-extrabold bg-green-dark text-white px-2 py-0.5 rounded-full">Vérifié</span>
                      )}
                      {p.accepting_patients && (
                        <span className="text-[9px] font-extrabold bg-surface text-green-dark border border-green px-2 py-0.5 rounded-full">Accepte patients</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={`/praticiens/${p.slug}`}
                      target="_blank"
                      className="text-[11px] font-semibold text-green hover:underline"
                    >
                      Voir profil →
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Inscription requests */}
        {(inscriptions ?? []).length > 0 && (
          <div className="bg-white rounded-2xl border border-border overflow-hidden">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-sm font-extrabold text-green-dark">Demandes d'inscription récentes</h2>
            </div>
            <table className="w-full">
              <thead>
                <tr className="border-b border-bg-alt">
                  {['Nom', 'Email', 'Date', 'Statut'].map((h) => (
                    <th key={h} className="text-left px-6 py-3 text-[10px] font-bold text-muted uppercase tracking-[1px]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(inscriptions ?? []).map((r) => (
                  <tr key={r.id} className="border-b border-bg-alt last:border-0">
                    <td className="px-6 py-3 text-sm font-semibold text-ink">
                      {r.first_name} {r.last_name}
                    </td>
                    <td className="px-6 py-3 text-xs text-muted">{r.email}</td>
                    <td className="px-6 py-3 text-xs text-muted">
                      {new Date(r.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-3">
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full ${
                        r.status === 'approved' ? 'bg-green text-white' :
                        r.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-50 text-yellow-700 border border-yellow-200'
                      }`}>
                        {r.status === 'approved' ? 'Approuvé' : r.status === 'rejected' ? 'Refusé' : 'En attente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
