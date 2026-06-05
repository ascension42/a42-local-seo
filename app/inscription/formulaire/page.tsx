'use client'
import { useState } from 'react'

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
  doctolib_url: string
  bio: string
  tags: string[]
}

const EMPTY: FormData = {
  first_name: '', last_name: '', email: '', phone: '',
  certification: '', school: '', years_active: '',
  consultation_mode: 'cabinet', neighborhood: '', hourly_rate: '',
  website_url: '', doctolib_url: '',
  bio: '', tags: [],
}

const TAG_OPTIONS = [
  'Stress & anxiété', 'Burn-out', 'Troubles du sommeil', 'Gestion des émotions',
  'Confiance en soi', 'Douleurs chroniques', 'Accompagnement périnatal', 'Enfants & adolescents',
  'Sport & performance', 'Préparation aux examens',
]

const STEPS = ['Identité', 'Formation', 'Cabinet', 'Confirmation']

export default function InscriptionFormulairePage() {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<FormData>(EMPTY)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function set(field: keyof FormData, value: string | string[]) {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  function toggleTag(tag: string) {
    set('tags', data.tags.includes(tag)
      ? data.tags.filter((t) => t !== tag)
      : [...data.tags, tag]
    )
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
      if (res.ok) {
        setSubmitted(true)
      } else {
        const json = await res.json()
        setError(json.error ?? 'Une erreur est survenue.')
      }
    } catch {
      setError('Une erreur est survenue, veuillez réessayer.')
    }
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-[480px]">
          <div className="w-16 h-16 rounded-full bg-green flex items-center justify-center mx-auto mb-5">
            <svg viewBox="0 0 24 24" width="28" fill="none">
              <path d="M5 12l5 5L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-green-dark mb-3 tracking-tight">
            Demande envoyée !
          </h1>
          <p className="text-[13px] text-muted leading-[1.7]">
            Nous avons bien reçu votre demande. Notre équipe examine votre dossier et vous contacte
            sous <strong className="text-green-dark">24h ouvrées</strong> à l&apos;adresse <strong className="text-green-dark">{data.email}</strong>.
          </p>
          <a href="/" className="inline-block mt-6 text-sm font-bold text-green hover:underline">
            ← Retour à l'accueil
          </a>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Hero */}
      <div className="bg-green-dark px-10 py-10 text-center">
        <p className="text-[10px] font-bold text-green-light uppercase tracking-[2px] mb-2">
          Inscription praticien
        </p>
        <h1 className="text-[26px] font-extrabold text-white tracking-tight mb-2">
          Créez votre profil en ligne
        </h1>
        <p className="text-[13px] text-white/65">
          Remplissez ce formulaire — examen sous 24h, publication immédiate.
        </p>
      </div>

      {/* Stepper */}
      <div className="bg-white border-b border-border px-10 py-4">
        <div className="max-w-[600px] mx-auto flex items-center gap-0">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold transition-colors ${
                  i < step ? 'bg-green text-white' :
                  i === step ? 'bg-green-dark text-white' :
                  'bg-bg-alt text-muted border border-border'
                }`}>
                  {i < step ? (
                    <svg viewBox="0 0 12 10" width="12" fill="none">
                      <path d="M1 5l3 3 7-7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : i + 1}
                </div>
                <span className={`text-[9px] font-bold mt-1 ${i === step ? 'text-green-dark' : 'text-muted'}`}>
                  {label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-[2px] mx-2 mb-3 ${i < step ? 'bg-green' : 'bg-border'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form card */}
      <div className="max-w-[600px] mx-auto px-4 py-10">
        <div className="bg-white rounded-2xl border border-border p-8 shadow-sm">

          {/* Step 1 — Identity */}
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="text-lg font-extrabold text-green-dark mb-1">Votre identité</h2>
              <p className="text-xs text-muted mb-4">Informations personnelles de contact.</p>
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
              <h2 className="text-lg font-extrabold text-green-dark mb-1">Votre formation</h2>
              <p className="text-xs text-muted mb-4">Ces informations apparaissent sur votre profil public.</p>
              <Field label="Certification (ex: RNCP Niveau 5)" value={data.certification} onChange={(v) => set('certification', v)} placeholder="RNCP Niveau 5 — Sophrologue" />
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
            <div className="space-y-5">
              <h2 className="text-lg font-extrabold text-green-dark mb-1">Votre cabinet</h2>
              <p className="text-xs text-muted mb-4">Informations pratiques pour les patients.</p>

              <div>
                <label className="block text-xs font-bold text-green-dark mb-2">Mode de consultation *</label>
                <div className="grid grid-cols-3 gap-3">
                  {([['cabinet', 'En cabinet'], ['online', 'En ligne'], ['both', 'Les deux']] as const).map(([val, label]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => set('consultation_mode', val)}
                      className={`p-3 rounded-xl border-2 text-xs font-bold transition-colors ${
                        data.consultation_mode === val
                          ? 'border-green bg-surface text-green-dark'
                          : 'border-border text-muted hover:border-green-light'
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <Field label="Quartier / Ville" value={data.neighborhood} onChange={(v) => set('neighborhood', v)} placeholder="Bordeaux centre" />

              <div>
                <label className="block text-xs font-bold text-green-dark mb-1.5">Tarif indicatif</label>
                <select
                  value={data.hourly_rate}
                  onChange={(e) => set('hourly_rate', e.target.value)}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-green bg-white"
                >
                  <option value="">Non précisé</option>
                  <option value="45">Moins de 50 €</option>
                  <option value="60">50 – 70 €</option>
                  <option value="75">70 – 90 €</option>
                  <option value="95">Plus de 90 €</option>
                </select>
              </div>

              <Field label="Lien site web" value={data.website_url} onChange={(v) => set('website_url', v)} type="url" placeholder="https://marie-sophro.fr" />
              <Field label="Lien Doctolib" value={data.doctolib_url} onChange={(v) => set('doctolib_url', v)} type="url" placeholder="https://doctolib.fr/sophrologue/..." />

              <div>
                <label className="block text-xs font-bold text-green-dark mb-1.5">
                  Courte présentation <span className="text-muted font-normal">(facultatif)</span>
                </label>
                <textarea
                  value={data.bio}
                  onChange={(e) => set('bio', e.target.value)}
                  rows={3}
                  className="w-full border border-border rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-green resize-none"
                  placeholder="Sophrologue certifiée, j'accompagne..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-green-dark mb-2">
                  Domaines d&apos;intervention <span className="text-muted font-normal">(plusieurs choix)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {TAG_OPTIONS.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => toggleTag(tag)}
                      className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                        data.tags.includes(tag)
                          ? 'bg-green text-white border-green'
                          : 'bg-white text-muted border-border hover:border-green-light'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4 — Recap */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="text-lg font-extrabold text-green-dark mb-1">Récapitulatif</h2>
              <p className="text-xs text-muted mb-4">
                Vérifiez vos informations avant d&apos;envoyer votre demande.
              </p>

              <div className="space-y-3">
                <Section title="Identité">
                  <Row label="Nom" value={`${data.first_name} ${data.last_name}`} />
                  <Row label="Email" value={data.email} />
                  {data.phone && <Row label="Téléphone" value={data.phone} />}
                </Section>

                <Section title="Formation">
                  {data.certification && <Row label="Certification" value={data.certification} />}
                  {data.school && <Row label="École" value={data.school} />}
                  {data.years_active && <Row label="Expérience" value={`${data.years_active}+ ans`} />}
                </Section>

                <Section title="Cabinet">
                  <Row label="Mode" value={{ cabinet: 'En cabinet', online: 'En ligne', both: 'Cabinet & en ligne' }[data.consultation_mode]} />
                  {data.neighborhood && <Row label="Quartier" value={data.neighborhood} />}
                  {data.hourly_rate && <Row label="Tarif" value={`${data.hourly_rate} €`} />}
                  {data.website_url && <Row label="Site web" value={data.website_url} />}
                  {data.doctolib_url && <Row label="Doctolib" value={data.doctolib_url} />}
                </Section>

                {data.tags.length > 0 && (
                  <Section title="Domaines">
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {data.tags.map((t) => (
                        <span key={t} className="text-[10px] font-semibold bg-surface text-green-dark border border-border px-2.5 py-1 rounded-full">
                          {t}
                        </span>
                      ))}
                    </div>
                  </Section>
                )}
              </div>

              <div className="bg-surface border border-green rounded-xl p-4 mt-2">
                <p className="text-[12px] text-green-dark font-semibold leading-[1.6]">
                  Votre demande sera examinée sous 24h ouvrées. Vous recevrez un email de confirmation à <strong>{data.email}</strong>.
                </p>
              </div>

              {error && (
                <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-5 border-t border-border">
            {step > 0 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="text-sm font-bold text-muted hover:text-ink transition-colors"
              >
                ← Précédent
              </button>
            ) : (
              <div />
            )}
            {step < 3 ? (
              <button
                onClick={() => {
                  if (step === 0 && (!data.first_name || !data.last_name || !data.email)) {
                    setError('Veuillez remplir les champs obligatoires.')
                    return
                  }
                  setError(null)
                  setStep(step + 1)
                }}
                className="bg-green text-white font-bold text-sm px-7 py-3 rounded-xl hover:bg-[#4faa73] transition-colors"
              >
                Suivant →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-green text-white font-bold text-sm px-7 py-3 rounded-xl hover:bg-[#4faa73] transition-colors disabled:opacity-50"
              >
                {loading ? 'Envoi...' : 'Envoyer ma demande →'}
              </button>
            )}
          </div>
          {error && step !== 3 && (
            <p className="text-xs text-red-600 mt-2">{error}</p>
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
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-border rounded-xl px-4 py-3 text-sm text-ink focus:outline-none focus:border-green"
      />
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <div className="bg-surface px-4 py-2.5 border-b border-border">
        <p className="text-[10px] font-extrabold text-green-dark uppercase tracking-[1px]">{title}</p>
      </div>
      <div className="px-4 py-3 space-y-2">{children}</div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-muted font-medium">{label}</span>
      <span className="font-semibold text-ink text-right max-w-[260px] truncate">{value}</span>
    </div>
  )
}
