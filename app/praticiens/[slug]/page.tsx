import { notFound } from 'next/navigation'
import { getPractitionerBySlug } from '@/lib/queries'
import { createStaticClient } from '@/lib/supabase/static'
import { siteConfig } from '@/lib/config'
import type { Metadata } from 'next'
import Badge from '@/components/ui/Badge'
import PatientsBadge from '@/components/practitioners/PatientsBadge'
import ProfileViewTracker from '@/components/practitioners/ProfileViewTracker'
import BookingButton from '@/components/practitioners/BookingButton'

export const revalidate = 3600

export async function generateStaticParams() {
  const supabase = createStaticClient()
  const { data } = await supabase
    .from('practitioners')
    .select('slug, cities!inner(slug), specialties!inner(slug)')
    .eq('cities.slug', siteConfig.city)
    .eq('specialties.slug', siteConfig.specialty)
  return (data ?? []).map((p: { slug: string }) => ({ slug: p.slug }))
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const p = await getPractitionerBySlug(slug)
  if (!p) return {}
  return {
    title: `${p.first_name} ${p.last_name} — ${siteConfig.specialtyLabel} à ${siteConfig.cityLabel}`,
    description: p.bio?.slice(0, 160) ?? `${siteConfig.specialtyLabel} certifié à ${siteConfig.cityLabel}.`,
  }
}

const gradients = [
  'from-green-dark to-green',
  'from-[#3c6947] to-[#5cbe83]',
  'from-[#467954] to-[#6ab885]',
]

const modeLabel: Record<string, string> = {
  cabinet: 'Cabinet uniquement',
  online: 'En ligne uniquement',
  both: 'Cabinet & En ligne',
}

export default async function ProfilePage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const p = await getPractitionerBySlug(slug)
  if (!p) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: `${p.first_name} ${p.last_name} — ${siteConfig.specialtyLabel}`,
    description: p.bio ?? `${siteConfig.specialtyLabel} certifié à ${siteConfig.cityLabel}`,
    url: `https://${siteConfig.domain}/praticiens/${p.slug}`,
    priceRange: p.hourly_rate ? `${p.hourly_rate}€` : undefined,
    address: {
      '@type': 'PostalAddress',
      addressLocality: siteConfig.cityLabel,
      addressCountry: 'FR',
      streetAddress: p.cabinet_address ?? p.neighborhood ?? undefined,
    },
    ...(p.lat && p.lng ? { geo: { '@type': 'GeoCoordinates', latitude: p.lat, longitude: p.lng } } : {}),
    sameAs: [p.website_url, p.instagram_url ? `https://instagram.com/${p.instagram_url.replace('@', '')}` : null].filter(Boolean),
  }

  const tags = p.practitioner_tags ?? []
  const testimonials = p.testimonials ?? []
  const initials = `${p.first_name[0]}${p.last_name[0]}`
  const grad = gradients[p.first_name.charCodeAt(0) % gradients.length]

  return (
    <>
      <ProfileViewTracker practitionerId={p.id} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Header — gradient splits at 140px */}
      <div
        className="px-4 md:px-10 pt-6 md:pt-8 pb-0"
        style={{ background: 'linear-gradient(to bottom, #284a30 0%, #284a30 140px, #fbfaf8 140px)' }}
      >
        <div
          className="max-w-[1060px] mx-auto flex flex-col md:grid md:gap-7 md:items-end"
          style={{ gridTemplateColumns: 'auto 1fr auto' }}
        >
          {p.photo_url ? (
            <img src={p.photo_url} alt={`${p.first_name} ${p.last_name}`}
              className="w-[120px] h-[120px] rounded-full border-4 border-white object-cover mb-4 md:-mb-5 shrink-0" />
          ) : (
            <div className={`w-[120px] h-[120px] rounded-full border-4 border-white bg-gradient-to-br ${grad} flex items-center justify-center text-[40px] font-extrabold text-white mb-4 md:-mb-5 shrink-0`}>
              {initials}
            </div>
          )}
          <div className="pb-6">
            <h1 className="text-[28px] font-extrabold text-white tracking-tight mb-1.5">
              {p.first_name} {p.last_name}
            </h1>
            <p className="text-[13px] text-white/70 mb-2.5">
              {siteConfig.cityLabel}{p.neighborhood ? ` — ${p.neighborhood}` : ''}
            </p>
            <div className="flex gap-2 flex-wrap items-center">
              <Badge variant="mode">{modeLabel[p.consultation_mode]}</Badge>
              <PatientsBadge accepting={p.accepting_patients} />
              {p.is_verified && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full bg-green/20 text-green-light border border-green/30">
                  <svg viewBox="0 0 12 12" width="10" fill="none">
                    <circle cx="6" cy="6" r="5.5" stroke="currentColor" strokeWidth="1"/>
                    <path d="M3.5 6l1.5 1.5L8.5 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Certifié &amp; Vérifié
                </span>
              )}
            </div>
          </div>
          <div className="pb-6 flex flex-col gap-2.5 items-start md:items-end">
            <a
              href={`mailto:contact@${siteConfig.domain}?subject=Contact ${encodeURIComponent(p.first_name + ' ' + p.last_name)}`}
              className="bg-green text-white font-bold text-[13px] px-7 py-3 rounded-lg whitespace-nowrap hover:bg-[#4faa73] transition-colors"
            >
              Contacter le praticien
            </a>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-[1060px] mx-auto px-4 md:px-10 py-6 md:py-8 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
        {/* Left column */}
        <div className="space-y-[18px]">
          {p.bio && (
            <div className="bg-white border-[1.5px] border-border rounded-xl p-[22px]">
              <h2 className="text-base font-extrabold text-green-dark mb-3.5">
                À propos de {p.first_name}
              </h2>
              <p className="text-[13px] leading-[1.8] text-ink">{p.bio}</p>
            </div>
          )}

          {tags.length > 0 && (
            <div className="bg-white border-[1.5px] border-border rounded-xl p-[22px]">
              <h2 className="text-base font-extrabold text-green-dark mb-3.5">
                Domaines d&apos;intervention
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {tags.map((t) => (
                  <div key={t.id} className="bg-surface border-l-[3px] border-green rounded-r-lg p-3">
                    <p className="text-xs font-bold text-green-dark">{t.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white border-[1.5px] border-border rounded-xl p-[22px]">
            <h2 className="text-base font-extrabold text-green-dark mb-3.5">
              Comment se déroule un suivi ?
            </h2>
            <div className="space-y-3.5">
              {[
                ['Séance de bilan (gratuite, 20 min)', 'Échange pour comprendre votre situation et vos objectifs.'],
                ['Première séance — découverte', 'Anamnèse complète et initiation aux premières techniques. Durée : 1h.'],
                ['Suivi personnalisé (4 à 8 séances)', 'Programme adapté à votre rythme, avec exercices entre les séances.'],
                ['Autonomie & bilan final', 'Vous disposez des outils pour pratiquer seul(e).'],
              ].map(([title, desc], i) => (
                <div key={i} className="flex gap-3.5 items-start">
                  <span className="w-7 h-7 rounded-full bg-green text-white text-[11px] font-extrabold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-xs font-bold text-green-dark mb-0.5">{title}</p>
                    <p className="text-[11px] text-muted leading-[1.5]">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {testimonials.length > 0 && (
            <div className="bg-white border-[1.5px] border-border rounded-xl p-[22px]">
              <h2 className="text-base font-extrabold text-green-dark mb-3.5">
                Ce que disent mes patients
              </h2>
              <div className="space-y-3">
                {testimonials.map((t) => (
                  <div key={t.id} className="bg-bg-alt rounded-lg p-3.5 border-l-[3px] border-green-light">
                    <p className="text-xs italic leading-[1.6] text-ink mb-2">
                      &laquo; {t.content} &raquo;
                    </p>
                    <p className="text-[10px] font-bold text-muted">
                      {t.author_name}{t.author_location ? ` — ${t.author_location}` : ''}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          <div className="bg-green-dark rounded-xl p-[22px]">
            <h3 className="text-sm font-extrabold text-white mb-1.5">Prendre rendez-vous</h3>
            <p className="text-[11px] text-white/65 mb-4 leading-[1.5]">
              Réservation directe sur l&apos;agenda de {p.first_name}.
            </p>
            <BookingButton
              href={p.booking_url ?? p.doctolib_url ?? p.calendly_url ?? '#'}
              practitionerId={p.id}
              className="block bg-green text-white text-center font-bold text-[13px] py-3 rounded-lg mb-2.5 hover:bg-[#4faa73] transition-colors"
            >
              Réserver une séance →
            </BookingButton>
            <p className="text-[10px] text-white/50 text-center">Via Doctolib / Calendly / site personnel</p>
          </div>

          <div className="bg-white border-[1.5px] border-border rounded-xl p-5">
            <h3 className="text-[13px] font-extrabold text-green-dark mb-3.5 pb-2.5 border-b border-border">
              Infos pratiques
            </h3>
            {[
              ['Tarif séance', p.hourly_rate ? `${p.hourly_rate} €` : '—', true],
              ['Modalités', modeLabel[p.consultation_mode], false],
              ['Quartier', p.neighborhood ?? '—', false],
              ['En activité depuis', p.years_active ? `${p.years_active}` : '—', false],
            ].map(([label, value, highlight]) => (
              <div key={String(label)} className="flex justify-between items-center py-1.5 border-b border-bg-alt last:border-0 text-xs">
                <span className="text-muted font-medium">{label}</span>
                <span className={`font-semibold ${highlight ? 'text-green-dark' : 'text-ink'}`}>{value}</span>
              </div>
            ))}
          </div>

          {(p.website_url || p.doctolib_url || p.booking_url || p.calendly_url || p.instagram_url) && (
            <div className="bg-white border-[1.5px] border-border rounded-xl p-5">
              <h3 className="text-[13px] font-extrabold text-green-dark mb-3 pb-2.5 border-b border-border">
                Retrouver {p.first_name}
              </h3>
              <div className="space-y-2">
                {p.website_url && (
                  <a href={p.website_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2.5 p-2.5 rounded-lg border border-border hover:border-green text-xs font-semibold text-ink transition-colors">
                    <span className="w-7 h-7 rounded-md bg-surface text-green-dark text-xs font-extrabold flex items-center justify-center shrink-0">W</span>
                    <div><div>Site personnel</div><div className="text-[10px] text-muted font-normal">{p.website_url.replace('https://', '')}</div></div>
                  </a>
                )}
                {(p.booking_url ?? p.doctolib_url) && (
                  <a href={(p.booking_url ?? p.doctolib_url)!} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2.5 p-2.5 rounded-lg border border-border hover:border-green text-xs font-semibold text-ink transition-colors">
                    <span className="w-7 h-7 rounded-md bg-[#e0f2fe] text-[#0369a1] text-xs font-extrabold flex items-center justify-center shrink-0">R</span>
                    <div><div>Réservation en ligne</div><div className="text-[10px] text-muted font-normal">Doctolib / Calendly</div></div>
                  </a>
                )}
                {p.instagram_url && (
                  <a href={`https://instagram.com/${p.instagram_url.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2.5 p-2.5 rounded-lg border border-border hover:border-green text-xs font-semibold text-ink transition-colors">
                    <span className="w-7 h-7 rounded-md bg-[#fce7f3] text-[#9d174d] text-xs font-extrabold flex items-center justify-center shrink-0">In</span>
                    <div><div>Instagram</div><div className="text-[10px] text-muted font-normal">{p.instagram_url}</div></div>
                  </a>
                )}
              </div>
            </div>
          )}

          <div className="bg-white border-[1.5px] border-border rounded-xl p-5">
            <h3 className="text-[13px] font-extrabold text-green-dark mb-3.5 pb-2.5 border-b border-border">
              Certifications
            </h3>
            {[
              ['Diplôme', p.certification ?? '—'],
              ['École', p.school ?? '—'],
              ['En activité depuis', p.years_active ? `${p.years_active}` : '—'],
            ].map(([label, value]) => (
              <div key={String(label)} className="flex justify-between items-center py-1.5 border-b border-bg-alt last:border-0 text-xs">
                <span className="text-muted font-medium">{label}</span>
                <span className="font-semibold text-ink">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
