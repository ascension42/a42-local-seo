'use client'
import { useState, useRef } from 'react'

type FormData = {
  first_name: string
  last_name: string
  email: string
  phone: string
  certification: string
  school: string
  years_active: string
  consultation_mode: 'cabinet' | 'online' | 'both'
  neighborhood: string
  hourly_rate: string
  website_url: string
  booking_url: string
  bio: string
  tags: string[]
}

const EMPTY: FormData = {
  first_name: '', last_name: '', email: '', phone: '',
  certification: '', school: '', years_active: '',
  consultation_mode: 'cabinet', neighborhood: '', hourly_rate: '',
  website_url: '', booking_url: '',
  bio: '', tags: [],
}

const PRESET_TAGS = [
  'Stress & anxiété', 'Burn-out', 'Troubles du sommeil', 'Gestion des émotions',
  'Confiance en soi', 'Douleurs chroniques', 'Accompagnement périnatal',
  'Enfants & adolescents', 'Sport & performance', 'Préparation aux examens',
  'Tabac & addictions', 'Phobies', 'Deuil & séparation', 'Sophrologie scolaire',
]

const STEPS = [
  { label: 'Identité',    icon: '👤' },
  { label: 'Formation',   icon: '🎓' },
  { label: 'Cabinet',     icon: '🏥' },
  { label: 'Confirmation',icon: '✅' },
]

const modeMap = { cabinet: 'En cabinet', online: 'En ligne', both: 'Cabinet & en ligne' }

export default function InscriptionFormulairePage() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<FormData>(EMPTY)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [customTagInput, setCustomTagInput] = useState('')
  const tagInputRef = useRef<HTMLInputElement>(null)

  function set<K extends keyof FormData>(field: K, value: FormData[K]) {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  function toggleTag(tag: string) {
    set('tags', data.tags.includes(tag)
      ? data.tags.filter((t) => t !== tag)
      : [...data.tags, tag]
    )
  }

  function addCustomTag() {
    const tag = customTagInput.trim()
    if (!tag || data.tags.includes(tag)) return
    set('tags', [...data.tags, tag])
    setCustomTagInput('')
    tagInputRef.current?.focus()
  }

  function validateStep(): string | null {
    if (step === 0) {
      if (!data.first_name.trim()) return 'Le prénom est obligatoire.'
      if (!data.last_name.trim()) return 'Le nom est obligatoire.'
      if (!data.email.trim() || !data.email.includes('@')) return "L'email est invalide."
    }
    return null
  }

  function goNext() {
    const err = validateStep()
    if (err) { setError(err); return }
    setError(null)
    setStep(step + 1)
  }

  async function handleSubmit() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/inscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      if (!res.ok) { setError(json.error ?? 'Une erreur est survenue.'); setLoading(false); return }
      setSubmitted(true)
    } catch {
      setError('Une erreur est survenue, veuillez réessayer.')
    }
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-[500px]">
          <div className="w-20 h-20 rounded-full bg-green flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green/20">
            <svg viewBox="0 0 32 32" width="36" fill="none">
              <path d="M6 16l7 7 13-13" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-[10px] font-bold text-green uppercase tracking-[2px] mb-3">Demande reçue</p>
          <h1 className="text-[26px] font-extrabold text-green-dark tracking-tight mb-3">
            Votre profil est en cours<br />de vérification
          </h1>
          <p className="text-[13px] text-muted leading-[1.8]">
            Notre équipe vérifie vos informations. Vous recevrez un email à <strong className="text-green-dark">{data.email}</strong> dans <strong className="text-green-dark">moins d'1 heure</strong> avec la prochaine étape.
          </p>
          <div className="mt-6 bg-surface border border-border rounded-xl p-4 text-left space-y-2">
            <p className="text-[11px] font-bold text-green-dark">Prochaines étapes :</p>
            {[
              'Vérification de vos informations par notre équipe',
              'Email avec le lien de paiement sécurisé',
              'Publication de votre profil sous 24h',
            ].map((s, i) => (
              <div key={s} className="flex gap-2.5 items-start">
                <span className="w-4 h-4 rounded-full bg-green-light text-green-dark text-[9px] font-extrabold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                <span className="text-[11px] text-muted">{s}</span>
              </div>
            ))}
          </div>
          <a href="/" className="inline-block mt-6 text-sm font-bold text-green hover:underline">← Retour à l&apos;accueil</a>
        </div>
      </div>
    )
  }

  const progress = ((step + 1) / STEPS.length) * 100

  return (
    <>
      {/* Hero */}
      <div className="bg-green-dark px-10 py-10 text-center">
        <p className="text-[10px] font-bold text-green-light uppercase tracking-[2px] mb-2">Inscription praticien</p>
        <h1 className="text-[26px] font-extrabold text-white tracking-tight mb-2">Créez votre profil en ligne</h1>
        <p className="text-[13px] text-white/65">Remplissez ce formulaire — vérification sous 1h, publication immédiate.</p>
      </div>

      {/* Stepper */}
      <div className="bg-white border-b border-border">
        {/* Progress bar */}
        <div className="h-1 bg-border">
          <div className="h-1 bg-green transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
        </div>

        {/* Steps */}
        <div className="max-w-[560px] mx-auto px-6 py-5">
          <div className="flex items-start justify-between">
            {STEPS.map(({ label }, i) => {
              const done = i < step
              const active = i === step
              return (
                <div key={label} className="flex flex-col items-center gap-2 flex-1 relative">
                  {/* Connector line */}
                  {i < STEPS.length - 1 && (
                    <div className="absolute top-[18px] left-[calc(50%+18px)] right-[calc(-50%+18px)] h-[2px] bg-border -z-0">
                      <div className={`h-full bg-green transition-all duration-500 ${done ? 'w-full' : 'w-0'}`} />
                    </div>
                  )}
                  <div className={`
                    w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-extrabold z-10 transition-all duration-300 border-2
                    ${done ? 'bg-green border-green text-white shadow-sm shadow-green/30'
                    : active ? 'bg-white border-green text-green-dark shadow-[0_0_0_4px_rgba(92,190,131,0.15)]'
                    : 'bg-white border-border text-muted'}
                  `}>
                    {done ? (
                      <svg viewBox="0 0 12 10" width="12" fill="none">
                        <path d="M1 5l3 3 7-7" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : i + 1}
                  </div>
                  <span className={`text-[10px] font-bold leading-tight text-center transition-colors ${
                    active ? 'text-green-dark' : done ? 'text-green' : 'text-muted'
                  }`}>
                    {label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-[600px] mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
          {/* Step header */}
          <div className="px-8 pt-7 pb-5 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center">
                <span className="text-[18px]">{STEPS[step].icon}</span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-muted uppercase tracking-[1px]">Étape {step + 1} / {STEPS.length}</p>
                <h2 className="text-lg font-extrabold text-green-dark tracking-tight">{STEPS[step].label}</h2>
              </div>
            </div>
          </div>

          {/* Step content */}
          <div className="px-8 py-7">

            {/* Step 1 — Identity */}
            {step === 0 && (
              <div className="space-y-5">
                <p className="text-[12px] text-muted">Vos informations personnelles de contact.</p>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Prénom *" value={data.first_name} onChange={(v) => set('first_name', v)} placeholder="Marie" />
                  <Field label="Nom *" value={data.last_name} onChange={(v) => set('last_name', v)} placeholder="Dupont" />
                </div>
                <Field label="Email professionnel *" value={data.email} onChange={(v) => set('email', v)} type="email" placeholder="marie@sophro.fr" />
                <Field label="Téléphone" value={data.phone} onChange={(v) => set('phone', v)} placeholder="06 12 34 56 78" />
              </div>
            )}

            {/* Step 2 — Training */}
            {step === 1 && (
              <div className="space-y-5">
                <p className="text-[12px] text-muted">Ces informations apparaissent sur votre profil public.</p>
                <Field label="Certification (ex : RNCP Niveau 5)" value={data.certification} onChange={(v) => set('certification', v)} placeholder="RNCP Niveau 5 — Sophrologue" />
                <Field label="École de sophrologie" value={data.school} onChange={(v) => set('school', v)} placeholder="Institut de Sophrologie de Paris" />
                <div>
                  <label className="block text-xs font-bold text-green-dark mb-1.5">Années d&apos;expérience</label>
                  <select
                    value={data.years_active}
                    onChange={(e) => set('years_active', e.target.value)}
                    className="w-full border border-border rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-green bg-white"
                  >
                    <option value="">Sélectionner</option>
                    <option value="2">1 – 2 ans</option>
                    <option value="4">3 – 5 ans</option>
                    <option value="7">5 – 10 ans</option>
                    <option value="12">Plus de 10 ans</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 3 — Practice */}
            {step === 2 && (
              <div className="space-y-6">
                <p className="text-[12px] text-muted">Informations pratiques pour les patients.</p>

                <div>
                  <label className="block text-xs font-bold text-green-dark mb-2">Mode de consultation *</label>
                  <div className="grid grid-cols-3 gap-3">
                    {([['cabinet', 'En cabinet'], ['online', 'En ligne'], ['both', 'Les deux']] as const).map(([val, label]) => (
                      <button key={val} type="button" onClick={() => set('consultation_mode', val)}
                        className={`p-3 rounded-xl border-2 text-xs font-bold transition-colors ${
                          data.consultation_mode === val ? 'border-green bg-surface text-green-dark' : 'border-border text-muted hover:border-green-light'
                        }`}>{label}</button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Quartier / Ville" value={data.neighborhood} onChange={(v) => set('neighborhood', v)} placeholder="Bordeaux centre" />
                  <div>
                    <label className="block text-xs font-bold text-green-dark mb-1.5">Tarif indicatif</label>
                    <select value={data.hourly_rate} onChange={(e) => set('hourly_rate', e.target.value)}
                      className="w-full border border-border rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-green bg-white">
                      <option value="">Non précisé</option>
                      <option value="45">Moins de 50 €</option>
                      <option value="60">50 – 70 €</option>
                      <option value="75">70 – 90 €</option>
                      <option value="95">Plus de 90 €</option>
                    </select>
                  </div>
                </div>

                <Field label="Site web" value={data.website_url} onChange={(v) => set('website_url', v)} type="url" placeholder="https://marie-sophro.fr" />
                <Field
                  label="Lien de réservation (Doctolib, Cal.com, Calendly…)"
                  value={data.booking_url}
                  onChange={(v) => set('booking_url', v)}
                  type="url"
                  placeholder="https://doctolib.fr/sophrologue/..."
                />

                <div>
                  <label className="block text-xs font-bold text-green-dark mb-1.5">
                    Courte présentation <span className="text-muted font-normal">(facultatif)</span>
                  </label>
                  <textarea value={data.bio} onChange={(e) => set('bio', e.target.value)} rows={3}
                    className="w-full border border-border rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-green resize-none"
                    placeholder="Sophrologue certifiée, j'accompagne..." />
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs font-bold text-green-dark mb-1">
                    Domaines d&apos;intervention <span className="text-muted font-normal">(plusieurs choix)</span>
                  </label>
                  <p className="text-[11px] text-muted mb-3">Sélectionnez parmi les propositions ou ajoutez les vôtres.</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {PRESET_TAGS.map((tag) => (
                      <button key={tag} type="button" onClick={() => toggleTag(tag)}
                        className={`text-[11px] font-semibold px-4 py-2 rounded-full border transition-colors ${
                          data.tags.includes(tag) ? 'bg-green text-white border-green' : 'bg-white text-muted border-border hover:border-green-light'
                        }`}>{tag}</button>
                    ))}
                  </div>
                  {/* Custom tags */}
                  {data.tags.filter((t) => !PRESET_TAGS.includes(t)).length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {data.tags.filter((t) => !PRESET_TAGS.includes(t)).map((tag) => (
                        <span key={tag} className="flex items-center gap-1.5 text-[11px] font-semibold px-4 py-2 rounded-full bg-green-dark text-white">
                          {tag}
                          <button type="button" onClick={() => set('tags', data.tags.filter((t) => t !== tag))} className="hover:opacity-70">
                            <svg viewBox="0 0 10 10" width="9" fill="none"><path d="M2 2l6 6M8 2L2 8" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <input
                      ref={tagInputRef}
                      type="text"
                      value={customTagInput}
                      onChange={(e) => setCustomTagInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomTag() } }}
                      placeholder="Ajouter un domaine personnalisé…"
                      className="flex-1 border border-border rounded-xl px-4 py-2.5 text-sm text-ink focus:outline-none focus:border-green"
                    />
                    <button type="button" onClick={addCustomTag}
                      className="bg-surface border border-border text-green-dark font-bold text-sm px-4 py-2.5 rounded-xl hover:border-green transition-colors whitespace-nowrap">
                      + Ajouter
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4 — Confirmation */}
            {step === 3 && (
              <div className="space-y-5">
                <p className="text-[12px] text-muted">Vérifiez vos informations avant d&apos;envoyer votre demande.</p>

                {/* Profile preview card */}
                <div className="bg-green-dark rounded-2xl p-5 text-white">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-green flex items-center justify-center text-xl font-extrabold shrink-0">
                      {(data.first_name[0] ?? '?')}{(data.last_name[0] ?? '')}
                    </div>
                    <div>
                      <p className="font-extrabold text-lg leading-tight">{data.first_name} {data.last_name}</p>
                      <p className="text-white/65 text-[12px]">{data.email}</p>
                      {data.phone && <p className="text-white/65 text-[11px]">{data.phone}</p>}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[10px] font-semibold bg-green/80 px-3 py-1 rounded-full">{modeMap[data.consultation_mode]}</span>
                    {data.neighborhood && <span className="text-[10px] font-semibold bg-white/15 px-3 py-1 rounded-full">{data.neighborhood}</span>}
                    {data.hourly_rate && <span className="text-[10px] font-semibold bg-white/15 px-3 py-1 rounded-full">{data.hourly_rate} €/séance</span>}
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Certification', value: data.certification },
                    { label: 'École', value: data.school },
                    { label: 'Expérience', value: data.years_active ? `${data.years_active}+ ans` : null },
                    { label: 'Site web', value: data.website_url },
                    { label: 'Réservation', value: data.booking_url },
                  ].filter((r) => r.value).map(({ label, value }) => (
                    <div key={label} className="bg-surface rounded-xl px-4 py-3 border border-border">
                      <p className="text-[9px] font-bold text-muted uppercase tracking-[1px] mb-0.5">{label}</p>
                      <p className="text-[12px] font-semibold text-ink truncate">{value}</p>
                    </div>
                  ))}
                </div>

                {/* Tags */}
                {data.tags.length > 0 && (
                  <div>
                    <p className="text-[10px] font-bold text-muted uppercase tracking-[1px] mb-2">Domaines d&apos;intervention</p>
                    <div className="flex flex-wrap gap-1.5">
                      {data.tags.map((t) => (
                        <span key={t} className="text-[11px] font-semibold bg-surface text-green-dark border border-border px-3 py-1.5 rounded-full">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bio */}
                {data.bio && (
                  <div className="bg-surface rounded-xl px-4 py-3 border border-border">
                    <p className="text-[9px] font-bold text-muted uppercase tracking-[1px] mb-1">Présentation</p>
                    <p className="text-[12px] text-ink leading-[1.7]">{data.bio}</p>
                  </div>
                )}

                {/* What happens next */}
                <div className="bg-surface border border-green rounded-xl p-4">
                  <p className="text-[11px] font-bold text-green-dark mb-1.5">Ce qui se passe après l&apos;envoi :</p>
                  <ol className="space-y-1">
                    {[
                      'Notre équipe vérifie vos informations sous 1h',
                      'Vous recevez un email avec le lien de paiement sécurisé',
                      'Votre profil est publié après confirmation (24h max)',
                    ].map((s, i) => (
                      <li key={s} className="text-[11px] text-muted flex gap-2">
                        <span className="text-green font-bold">{i + 1}.</span> {s}
                      </li>
                    ))}
                  </ol>
                </div>

                {error && <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="px-8 py-5 border-t border-border flex justify-between items-center bg-bg-alt/50">
            {step > 0 ? (
              <button onClick={() => { setError(null); setStep(step - 1) }}
                className="flex items-center gap-1.5 text-sm font-bold text-muted hover:text-ink transition-colors">
                <svg viewBox="0 0 16 16" width="14" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
                Précédent
              </button>
            ) : <div />}

            {step < 3 ? (
              <button onClick={goNext}
                className="flex items-center gap-1.5 bg-green text-white font-bold text-sm px-7 py-3 rounded-xl hover:bg-[#4faa73] transition-colors">
                Suivant
                <svg viewBox="0 0 16 16" width="14" fill="none"><path d="M6 4l4 4-4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </button>
            ) : (
              <button onClick={handleSubmit} disabled={loading}
                className="flex items-center gap-2 bg-green text-white font-bold text-sm px-7 py-3 rounded-xl hover:bg-[#4faa73] transition-colors disabled:opacity-50">
                {loading ? (
                  <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Envoi...</>
                ) : (
                  <><svg viewBox="0 0 16 16" width="15" fill="none"><path d="M2 8h12M8 2l6 6-6 6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" /></svg>Envoyer ma demande</>
                )}
              </button>
            )}
          </div>

          {error && step !== 3 && (
            <p className="text-xs text-red-600 px-8 pb-4">{error}</p>
          )}
        </div>
      </div>
    </>
  )
}

function Field({ label, value, onChange, type = 'text', placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-green-dark mb-1.5">{label}</label>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="w-full border border-border rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-green" />
    </div>
  )
}
