'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { siteConfig } from '@/lib/config'

type Specialty = { slug: string; name: string }
type Plan = 'standard' | 'premium'

const PLAN_LABELS: Record<Plan, { name: string; price: string; desc: string }> = {
  standard:  { name: 'Standard',        price: '24 €/mois', desc: "Profil dans l'annuaire local" },
  premium:   { name: 'Mise en avant',   price: '49 €/mois', desc: "Affiché sur la page d'accueil et dans les articles" },
}

function FormContent() {
  const searchParams = useSearchParams()
  const planParam = (searchParams.get('plan') ?? 'standard') as Plan
  const validPlan: Plan = planParam === 'premium' ? 'premium' : 'standard'

  const [specialties, setSpecialties] = useState<Specialty[]>([])
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    specialty_slug: '',
    email: '',
    phone: '',
    plan: validPlan,
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    fetch('/api/specialties')
      .then(r => r.json())
      .then((data: Specialty[]) => {
        setSpecialties(data)
        if (data.length === 1) setForm(f => ({ ...f, specialty_slug: data[0].slug }))
      })
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.first_name || !form.last_name || !form.specialty_slug || !form.email) {
      setError('Merci de remplir tous les champs obligatoires.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/inscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erreur serveur')
      setSubmitted(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue, veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    const planInfo = PLAN_LABELS[form.plan as Plan]
    return (
      <div className="min-h-[calc(100vh-58px)] flex items-center justify-center px-5 py-16">
        <div className="max-w-[680px] w-full text-center bg-surface rounded-2xl p-10 shadow-sm">
          <div className="w-14 h-14 bg-green/15 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Demande envoyée !</h2>
          <p className="text-[11px] font-semibold text-green uppercase tracking-[1px] mb-3">{planInfo.name} — {planInfo.price}</p>
          <p className="text-muted text-sm leading-relaxed">
            Merci {form.first_name}, nous avons bien reçu votre demande d&apos;inscription.
            Notre équipe vérifiera votre profil et vous contactera par email sous peu.
          </p>
        </div>
      </div>
    )
  }

  const planInfo = PLAN_LABELS[form.plan as Plan]

  return (
    <div className="max-w-[680px] mx-auto px-5 py-12">
      {/* Plan badge */}
      <div className={`flex items-center justify-between mb-6 px-4 py-3 rounded-xl border-[1.5px] ${form.plan === 'premium' ? 'bg-green/5 border-green' : 'bg-surface border-border'}`}>
        <div>
          <p className={`text-[11px] font-bold uppercase tracking-[1px] mb-0.5 ${form.plan === 'premium' ? 'text-green' : 'text-muted'}`}>
            Plan sélectionné {form.plan === 'premium' ? '★' : ''}
          </p>
          <p className="text-sm font-bold text-green-dark">{planInfo.name} — {planInfo.price}</p>
          <p className="text-[11px] text-muted">{planInfo.desc}</p>
        </div>
        <a
          href="/inscription"
          className="text-[10px] font-semibold text-green underline underline-offset-2 whitespace-nowrap"
        >
          Changer de plan
        </a>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Rejoindre l&apos;annuaire des{' '}
          <span className="text-green">{siteConfig.specialtyPlural} de {siteConfig.cityLabel}</span>
        </h1>
        <p className="text-muted text-sm leading-relaxed">
          Remplissez ce formulaire, nous vérifions votre profil et vous recontactons pour finaliser votre inscription.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface rounded-2xl p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Prénom *" value={form.first_name} onChange={v => setForm(f => ({ ...f, first_name: v }))} placeholder="Marie" />
          <Field label="Nom *" value={form.last_name} onChange={v => setForm(f => ({ ...f, last_name: v }))} placeholder="Dupont" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">Métier *</label>
          <select
            value={form.specialty_slug}
            onChange={e => setForm(f => ({ ...f, specialty_slug: e.target.value }))}
            required
            className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
          >
            <option value="">Sélectionnez votre métier</option>
            {specialties.map(s => (
              <option key={s.slug} value={s.slug}>{s.name}</option>
            ))}
          </select>
        </div>

        <Field label="Email *" value={form.email} onChange={v => setForm(f => ({ ...f, email: v }))} type="email" placeholder="marie.dupont@gmail.com" />
        <Field label="Téléphone" value={form.phone} onChange={v => setForm(f => ({ ...f, phone: v }))} type="tel" placeholder="06 12 34 56 78" />

        {error && <p className="text-red-500 text-xs">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green text-white font-semibold py-3 rounded-xl text-sm hover:bg-green-dark transition-colors disabled:opacity-60"
        >
          {loading ? 'Envoi en cours…' : `Envoyer ma demande — ${planInfo.name}`}
        </button>

        <p className="text-center text-[11px] text-muted">
          Pas de carte bancaire requise. Vous serez recontacté par email.
        </p>
      </form>
    </div>
  )
}

export default function InscriptionFormulairePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><p className="text-muted text-sm">Chargement…</p></div>}>
      <FormContent />
    </Suspense>
  )
}

function Field({ label, value, onChange, type = 'text', placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-foreground mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-foreground bg-white placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
      />
    </div>
  )
}
