'use client'

import { useState, useEffect, Suspense } from 'react'
import { siteConfig } from '@/lib/config'
import { track } from '@/lib/analytics'

type Specialty = { slug: string; name: string }

function FormContent() {
  const [specialties, setSpecialties] = useState<Specialty[]>([])
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    specialty_slug: '',
    email: '',
    phone: '',
    plan: 'standard',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [formStarted, setFormStarted] = useState(false)

  useEffect(() => {
    fetch('/api/specialties')
      .then(r => r.json())
      .then((data: Specialty[]) => {
        setSpecialties(data)
        if (data.length === 1) setForm(f => ({ ...f, specialty_slug: data[0].slug }))
      })
  }, [])

  function handleFieldChange(field: string, value: string) {
    if (!formStarted) {
      setFormStarted(true)
      track({ name: 'inscription_form_started', properties: { plan: form.plan as Plan } })
    }
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.first_name || !form.last_name || !form.specialty_slug || !form.email) {
      setError('Merci de remplir tous les champs obligatoires.')
      track({ name: 'inscription_form_error', properties: { plan: form.plan as Plan, error: 'missing_required_fields' } })
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
      track({ name: 'inscription_form_submitted', properties: { plan: form.plan as Plan, specialty: form.specialty_slug } })
      setSubmitted(true)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Une erreur est survenue, veuillez réessayer.'
      setError(message)
      track({ name: 'inscription_form_error', properties: { plan: form.plan as Plan, error: message } })
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-[calc(100vh-58px)] flex items-center justify-center px-5 py-16">
        <div className="max-w-[560px] w-full text-center">
          <div className="w-14 h-14 bg-green/15 rounded-full flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-foreground mb-2">Candidature reçue !</h2>
          <p className="text-muted text-sm leading-relaxed mb-8">
            Merci {form.first_name}, votre dossier a bien été transmis à notre équipe.
          </p>

          {/* Next steps */}
          <div className="bg-surface rounded-2xl p-6 text-left space-y-4">
            <p className="text-[10px] font-bold text-green uppercase tracking-[2px] mb-4 text-center">La suite</p>
            {[
              { icon: '✓', label: 'Candidature reçue', desc: 'Votre dossier est entre nos mains.', done: true },
              { icon: '2', label: 'Vérification sous 48h', desc: 'Notre équipe examine votre certification RNCP.', done: false },
              { icon: '3', label: 'Lien de paiement par email', desc: `Vous recevrez un email sur ${form.email} pour activer votre profil.`, done: false },
              { icon: '4', label: 'Profil en ligne', desc: 'Visible sur Google dès activation.', done: false },
            ].map((step) => (
              <div key={step.label} className="flex gap-3 items-start">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold shrink-0 mt-0.5 ${step.done ? 'bg-green text-white' : 'bg-border text-muted'}`}>
                  {step.done ? '✓' : step.icon}
                </span>
                <div>
                  <p className={`text-sm font-bold ${step.done ? 'text-green-dark' : 'text-muted'}`}>{step.label}</p>
                  <p className="text-[11px] text-muted leading-[1.6]">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[560px] mx-auto px-5 py-12">
      {/* Offer badge */}
      <div className="flex items-center gap-3 mb-6 px-4 py-3 rounded-xl border-[1.5px] bg-green/5 border-green">
        <div className="w-8 h-8 rounded-full bg-green/15 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 10 8" width="10" fill="none">
            <path d="M1 4l2.5 2.5L9 1" stroke="#3a8f5c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold text-green uppercase tracking-[1px]">Accès Réseau — offre de lancement</p>
          <p className="text-sm font-bold text-green-dark">24 €/mois <span className="text-xs font-normal text-muted line-through">49 €</span></p>
        </div>
        <a href="/inscription" className="text-[10px] font-semibold text-green underline underline-offset-2 whitespace-nowrap shrink-0">
          En savoir plus
        </a>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Rejoindre le réseau des{' '}
          <span className="text-green">{siteConfig.specialtyPlural} de {siteConfig.cityLabel}</span>
        </h1>
        <p className="text-muted text-sm leading-relaxed">
          Remplissez ce formulaire. Notre équipe examine votre dossier et vous envoie votre lien d&apos;activation sous 48h.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface rounded-2xl p-6 shadow-sm space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Prénom *" value={form.first_name} onChange={v => handleFieldChange('first_name', v)} placeholder="Marie" />
          <Field label="Nom *" value={form.last_name} onChange={v => handleFieldChange('last_name', v)} placeholder="Dupont" />
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">Métier *</label>
          <select
            value={form.specialty_slug}
            onChange={e => handleFieldChange('specialty_slug', e.target.value)}
            required
            className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
          >
            <option value="">Sélectionnez votre métier</option>
            {specialties.map(s => (
              <option key={s.slug} value={s.slug}>{s.name}</option>
            ))}
          </select>
        </div>

        <Field label="Email *" value={form.email} onChange={v => handleFieldChange('email', v)} type="email" placeholder="marie.dupont@gmail.com" />
        <Field label="Téléphone" value={form.phone} onChange={v => handleFieldChange('phone', v)} type="tel" placeholder="06 12 34 56 78" />

        {error && <p className="text-red-500 text-xs">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green text-white font-semibold py-3 rounded-xl text-sm hover:bg-green-dark transition-colors disabled:opacity-60"
        >
          {loading ? 'Envoi en cours…' : 'Envoyer ma candidature →'}
        </button>

        <p className="text-center text-[11px] text-muted">
          Aucun paiement maintenant · Vous serez contacté sous 48h
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
