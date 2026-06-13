'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { siteConfig } from '@/lib/config'
import { getZonesForCity, SUGGESTED_NICHES } from '@/lib/zones'

type Specialty = { slug: string; name: string }

type FormData = {
  first_name: string; last_name: string; email: string; phone: string
  specialty_slug: string; cabinet_address: string; neighborhood: string
  zone: string; niche: string
  hourly_rate: string; website_url: string; booking_url: string
  selected_tags: string[]
  siret: string; years_experience: string; training_description: string
  certificate_url: string
  plan: string
}

const STEPS = [
  { n: 1, label: 'Identité' },
  { n: 2, label: 'Activité' },
  { n: 3, label: 'Certification' },
]

function StepTabs({ current }: { current: number }) {
  return (
    <div className="flex rounded-t-2xl overflow-hidden border-b border-border">
      {STEPS.map((s) => (
        <div
          key={s.n}
          className={`flex-1 flex flex-col items-center gap-1.5 py-4 transition-colors ${
            s.n === current
              ? 'bg-green text-white'
              : s.n < current
                ? 'bg-green/10 text-green-dark'
                : 'bg-surface text-muted'
          }`}
        >
          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold ${
            s.n === current ? 'bg-white/25 text-white' :
            s.n < current  ? 'bg-green text-white' : 'bg-border/60 text-muted'
          }`}>
            {s.n < current ? (
              <svg viewBox="0 0 9 7" width="9" fill="none">
                <path d="M1 3.5l2 2L8 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : s.n}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-[0.8px]">{s.label}</span>
        </div>
      ))}
    </div>
  )
}

function FormContent() {
  const zones = getZonesForCity(siteConfig.city)

  const [step, setStep] = useState(1)
  const [specialties, setSpecialties] = useState<Specialty[]>([])
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [customTagInput, setCustomTagInput] = useState('')
  const [nicheInput, setNicheInput] = useState('')
  const [slotStatus, setSlotStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')
  const [certUpload, setCertUpload] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle')
  const [certError, setCertError] = useState('')
  const [certFileName, setCertFileName] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState<FormData>({
    first_name: '', last_name: '', email: '', phone: '',
    specialty_slug: '', cabinet_address: '', neighborhood: '',
    zone: '', niche: '',
    hourly_rate: '', website_url: '', booking_url: '',
    selected_tags: [],
    siret: '', years_experience: '', training_description: '',
    certificate_url: '',
    plan: 'standard',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    fetch('/api/specialties').then(r => r.json()).then((data: Specialty[]) => {
      setSpecialties(data)
      if (data.length === 1) setForm(f => ({ ...f, specialty_slug: data[0].slug }))
    })
    fetch('/api/tags').then(r => r.json()).then(setAvailableTags)
  }, [])

  function set<K extends keyof FormData>(field: K, value: FormData[K]) {
    setForm(f => ({ ...f, [field]: value }))
    setError('')
  }

  function toggleTag(tag: string) {
    setForm(f => ({
      ...f,
      selected_tags: f.selected_tags.includes(tag)
        ? f.selected_tags.filter(t => t !== tag)
        : [...f.selected_tags, tag],
    }))
  }

  function addCustomTag() {
    const tag = customTagInput.trim()
    if (!tag) return
    if (!availableTags.includes(tag)) setAvailableTags(prev => [...prev, tag])
    if (!form.selected_tags.includes(tag)) {
      setForm(f => ({ ...f, selected_tags: [...f.selected_tags, tag] }))
    }
    setCustomTagInput('')
  }

  async function handleCertFile(file: File) {
    if (!file) return
    setCertUpload('uploading')
    setCertError('')
    const fd = new FormData()
    fd.append('file', file)
    fd.append('first_name', form.first_name)
    fd.append('last_name', form.last_name)
    try {
      const res = await fetch('/api/upload-certificate', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setForm(f => ({ ...f, certificate_url: data.url }))
      setCertFileName(data.name)
      setCertUpload('done')
    } catch (err: unknown) {
      setCertError(err instanceof Error ? err.message : 'Erreur lors de l\'envoi')
      setCertUpload('error')
    }
  }

  async function checkSlot(zone: string, niche: string) {
    if (!zone || !niche) { setSlotStatus('idle'); return }
    setSlotStatus('checking')
    try {
      const r = await fetch(`/api/check-slot?zone=${encodeURIComponent(zone)}&niche=${encodeURIComponent(niche)}`)
      const d = await r.json()
      setSlotStatus(d.available ? 'available' : 'taken')
    } catch {
      setSlotStatus('idle')
    }
  }

  function validateStep(n: number): string {
    if (n === 1) {
      if (!form.first_name.trim()) return 'Le prénom est requis.'
      if (!form.last_name.trim()) return 'Le nom est requis.'
      if (!form.email.trim() || !form.email.includes('@')) return 'Un email valide est requis.'
    }
    if (n === 2) {
      if (!form.specialty_slug) return 'Veuillez sélectionner votre métier.'
      if (!form.cabinet_address.trim()) return "L'adresse de votre cabinet est requise."
      if (zones.length > 0 && !form.zone) return 'Veuillez sélectionner votre zone.'
      if (!form.niche.trim()) return 'Veuillez renseigner votre niche.'
      if (slotStatus === 'taken') return 'Ce slot (zone + niche) est déjà pris. Choisissez une autre combinaison.'
    }
    if (n === 3) {
      if (!form.siret.trim()) return 'Le numéro SIRET est requis.'
    }
    return ''
  }

  function nextStep() {
    const err = validateStep(step)
    if (err) { setError(err); return }
    setError('')
    setStep(s => s + 1)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const err = validateStep(3)
    if (err) { setError(err); return }
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
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.')
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
            Merci {form.first_name}, votre dossier a été transmis à notre équipe.
          </p>
          <div className="bg-surface rounded-2xl p-6 text-left space-y-4">
            <p className="text-[10px] font-bold text-green uppercase tracking-[2px] mb-4 text-center">La suite</p>
            {[
              { label: 'Candidature reçue', desc: 'Votre dossier complet est entre nos mains.', done: true },
              { label: 'Vérification sous 48h', desc: 'Notre équipe examine votre SIRET et vos certifications.', done: false },
              { label: 'Lien de paiement par email', desc: `Vous recevrez un email sur ${form.email} pour activer votre profil.`, done: false },
              { label: 'Profil en ligne', desc: 'Visible sur Google dès activation.', done: false },
            ].map((s, i) => (
              <div key={s.label} className="flex gap-3 items-start">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold shrink-0 mt-0.5 ${s.done ? 'bg-green text-white' : 'bg-border text-muted'}`}>
                  {s.done ? '✓' : i + 1}
                </span>
                <div>
                  <p className={`text-sm font-bold ${s.done ? 'text-green-dark' : 'text-muted'}`}>{s.label}</p>
                  <p className="text-[11px] text-muted leading-[1.6]">{s.desc}</p>
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
          <svg viewBox="0 0 9 7" width="9" fill="none">
            <path d="M1 3.5l2 2L8 1" stroke="#3a8f5c" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-[11px] font-bold text-green uppercase tracking-[1px]">Accès Réseau — offre de lancement</p>
          <p className="text-sm font-bold text-green-dark">24 €/mois <span className="text-xs font-normal text-muted line-through">49 €</span></p>
        </div>
        <a href="/inscription" className="text-[10px] font-semibold text-green underline underline-offset-2 whitespace-nowrap shrink-0">En savoir plus</a>
      </div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Rejoindre le réseau des <span className="text-green">{siteConfig.specialtyPlural} de {siteConfig.cityLabel}</span>
        </h1>
        <p className="text-muted text-sm leading-relaxed">
          Remplissez ce formulaire en 3 étapes. Notre équipe examine votre dossier et vous envoie votre lien d&apos;activation sous 48h.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-surface rounded-2xl shadow-sm overflow-hidden">

        {/* Step tabs — full-width header */}
        <StepTabs current={step} />

        <div className="p-6 space-y-4">

          {/* Step 1 — Identité */}
          {step === 1 && <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Prénom *" value={form.first_name} onChange={v => set('first_name', v)} placeholder="Marie" />
              <Field label="Nom *" value={form.last_name} onChange={v => set('last_name', v)} placeholder="Dupont" />
            </div>
            <Field label="Email professionnel *" value={form.email} onChange={v => set('email', v)} type="email" placeholder="marie.dupont@gmail.com" />
            <Field label="Téléphone" value={form.phone} onChange={v => set('phone', v)} type="tel" placeholder="06 12 34 56 78" />
          </>}

          {/* Step 2 — Activité */}
          {step === 2 && <>
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Métier *</label>
              <select value={form.specialty_slug} onChange={e => set('specialty_slug', e.target.value)}
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green">
                <option value="">Sélectionnez votre métier</option>
                {specialties.map(s => <option key={s.slug} value={s.slug}>{s.name}</option>)}
              </select>
            </div>
            <Field label="Adresse du cabinet *" value={form.cabinet_address} onChange={v => set('cabinet_address', v)} placeholder="12 rue de la Paix, Pézenas" />
            <Field label="Quartier (affiché sur votre profil)" value={form.neighborhood} onChange={v => set('neighborhood', v)} placeholder="Centre-ville" />

            {/* Zone d'exclusivité */}
            {zones.length > 0 && (
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Votre zone d&apos;exclusivité *
                  <span className="ml-1.5 text-muted font-normal">— vous serez le seul dans cette zone pour votre niche</span>
                </label>
                <select
                  value={form.zone}
                  onChange={e => { set('zone', e.target.value); checkSlot(e.target.value, form.niche) }}
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-foreground bg-white focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
                >
                  <option value="">Sélectionnez votre zone</option>
                  {zones.map(z => (
                    <option key={z.slug} value={z.slug}>{z.label} — {z.description}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Niche d'exclusivité */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1">
                Votre niche *
                <span className="ml-1.5 text-muted font-normal">— votre spécialité principale dans votre zone</span>
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2 mt-1.5">
                {SUGGESTED_NICHES.map(n => (
                  <button
                    key={n} type="button"
                    onClick={() => { set('niche', n); setNicheInput(n); checkSlot(form.zone, n) }}
                    className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                      form.niche === n
                        ? 'bg-green text-white border-green'
                        : 'bg-white text-green-dark border-border hover:border-green'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={nicheInput}
                  onChange={e => { setNicheInput(e.target.value); set('niche', e.target.value); if (e.target.value.length > 2) checkSlot(form.zone, e.target.value) }}
                  placeholder="Ou saisissez votre propre niche…"
                  className="flex-1 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground bg-white placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
                />
              </div>
              {slotStatus === 'checking' && (
                <p className="text-[11px] text-muted mt-1.5">Vérification de disponibilité…</p>
              )}
              {slotStatus === 'available' && form.zone && form.niche && (
                <p className="text-[11px] text-green font-semibold mt-1.5">✓ Ce slot est disponible — vous serez le seul !</p>
              )}
              {slotStatus === 'taken' && (
                <p className="text-[11px] text-red-500 font-semibold mt-1.5">✗ Ce slot est déjà pris. Choisissez une autre zone ou niche.</p>
              )}
            </div>
            <Field label="Tarif moyen (€/séance)" value={form.hourly_rate} onChange={v => set('hourly_rate', v)} type="number" placeholder="55" />
            <Field label="Site web" value={form.website_url} onChange={v => set('website_url', v)} type="url" placeholder="https://marie-dupont-sophro.fr" />
            <Field
              label="Lien de réservation"
              value={form.booking_url}
              onChange={v => set('booking_url', v)}
              type="url"
              placeholder="https://… (Doctolib, Calendly, site personnel…)"
            />

            {/* Domaines d'intervention — at end */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-0.5">
                Domaines d&apos;intervention <span className="text-muted font-normal">(choisissez vos spécialités)</span>
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2.5 mt-2">
                {availableTags.map(tag => (
                  <button key={tag} type="button" onClick={() => toggleTag(tag)}
                    className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                      form.selected_tags.includes(tag)
                        ? 'bg-green text-white border-green'
                        : 'bg-white text-green-dark border-border hover:border-green'
                    }`}>
                    {tag}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2.5">
                <input
                  type="text"
                  value={customTagInput}
                  onChange={e => setCustomTagInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addCustomTag() } }}
                  placeholder="Autre spécialité…"
                  className="w-[180px] border border-border rounded-full px-3.5 py-2 text-xs text-foreground bg-white placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
                />
                <button
                  type="button"
                  onClick={addCustomTag}
                  className="w-11 h-11 rounded-full bg-green text-white flex items-center justify-center hover:bg-green-dark active:scale-95 transition-all shrink-0 shadow-md"
                  aria-label="Ajouter ce domaine"
                >
                  <svg viewBox="0 0 14 14" width="14" height="14" fill="none">
                    <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
              {form.selected_tags.length > 0 && (
                <p className="text-[10px] text-green mt-1.5">
                  {form.selected_tags.length} domaine{form.selected_tags.length > 1 ? 's' : ''} sélectionné{form.selected_tags.length > 1 ? 's' : ''}
                </p>
              )}
            </div>
          </>}

          {/* Step 3 — Certification */}
          {step === 3 && <>
            <Field label="Années d'expérience" value={form.years_experience} onChange={v => set('years_experience', v)} type="number" placeholder="3" min={0} />
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">Formation(s) et diplômes</label>
              <textarea
                value={form.training_description}
                onChange={e => set('training_description', e.target.value)}
                placeholder="Ex : Formation sophrologue certifiée ISEBA Montpellier (2021), DU Gestion du stress — Université de Montpellier (2022)"
                rows={3}
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-foreground bg-white placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green resize-none"
              />
            </div>
            {/* Certificate upload */}
            <div>
              <label className="block text-xs font-semibold text-foreground mb-1.5">
                Certificat / Diplôme <span className="text-muted font-normal">(PDF, JPG ou PNG · max 10 Mo)</span>
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                onChange={e => { const f = e.target.files?.[0]; if (f) handleCertFile(f) }}
                className="hidden"
              />
              <div
                role="button"
                tabIndex={0}
                onClick={() => certUpload !== 'uploading' && fileInputRef.current?.click()}
                onKeyDown={e => e.key === 'Enter' && fileInputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={e => {
                  e.preventDefault(); setIsDragging(false)
                  const f = e.dataTransfer.files[0]
                  if (f) handleCertFile(f)
                }}
                className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
                  isDragging ? 'border-green bg-green/8 scale-[1.01]' :
                  certUpload === 'done' ? 'border-green bg-green/5 cursor-default' :
                  certUpload === 'error' ? 'border-red-300 bg-red-50/40' :
                  'border-border hover:border-green/50 hover:bg-surface'
                }`}
              >
                {certUpload === 'uploading' && (
                  <div className="flex flex-col items-center gap-3 py-2">
                    <div className="w-8 h-8 border-[3px] border-green/30 border-t-green rounded-full animate-spin" />
                    <p className="text-xs text-muted">Envoi en cours…</p>
                  </div>
                )}
                {certUpload === 'done' && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green/15 flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 16 12" width="16" fill="none">
                        <path d="M1 6l4 4L15 1" stroke="#3a8f5c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-semibold text-green-dark">Fichier envoyé</p>
                      <p className="text-[11px] text-muted truncate max-w-[260px]">{certFileName}</p>
                    </div>
                    <button
                      type="button"
                      onClick={e => { e.stopPropagation(); setCertUpload('idle'); setForm(f => ({ ...f, certificate_url: '' })) }}
                      className="text-muted hover:text-red-400 transition-colors text-lg leading-none shrink-0"
                      aria-label="Supprimer le fichier"
                    >
                      ×
                    </button>
                  </div>
                )}
                {certUpload === 'error' && (
                  <div className="flex flex-col items-center gap-1.5 py-1">
                    <p className="text-sm font-semibold text-red-500">Erreur d&apos;envoi</p>
                    <p className="text-[11px] text-red-400">{certError}</p>
                    <p className="text-[11px] text-muted mt-1">Cliquez pour réessayer</p>
                  </div>
                )}
                {certUpload === 'idle' && (
                  <div className="flex flex-col items-center gap-2.5 py-2">
                    <div className="w-11 h-11 rounded-full bg-surface border border-border flex items-center justify-center">
                      <svg viewBox="0 0 20 18" width="20" fill="none">
                        <path d="M10 12V4m0 0L7 7m3-3l3 3" stroke="#3a8f5c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M3 13v2a2 2 0 002 2h10a2 2 0 002-2v-2" stroke="#3a8f5c" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">Glissez votre diplôme ici</p>
                      <p className="text-[11px] text-muted">ou cliquez pour parcourir · PDF, JPG, PNG</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Field label="Numéro SIRET *" value={form.siret} onChange={v => set('siret', v)} placeholder="123 456 789 00012" />
          </>}

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <div className="flex gap-3 pt-1">
            {step > 1 && (
              <button type="button" onClick={() => { setError(''); setStep(s => s - 1) }}
                className="flex-1 border border-border text-green-dark font-semibold py-3 rounded-xl text-sm hover:bg-bg-alt transition-colors">
                ← Retour
              </button>
            )}
            {step < 3 ? (
              <button type="button" onClick={nextStep}
                className="flex-1 bg-green text-white font-semibold py-3 rounded-xl text-sm hover:bg-green-dark transition-colors">
                Continuer →
              </button>
            ) : (
              <button type="submit" disabled={loading}
                className="flex-1 bg-green text-white font-semibold py-3 rounded-xl text-sm hover:bg-green-dark transition-colors disabled:opacity-60">
                {loading ? 'Envoi en cours…' : 'Envoyer ma candidature →'}
              </button>
            )}
          </div>

          <p className="text-center text-[11px] text-muted">Aucun paiement maintenant · Vous serez contacté sous 48h</p>
        </div>
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

function Field({ label, value, onChange, type = 'text', placeholder, min }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; min?: number
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-foreground mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        {...(min !== undefined ? { min } : {})}
        className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-foreground bg-white placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-green/30 focus:border-green"
      />
    </div>
  )
}
