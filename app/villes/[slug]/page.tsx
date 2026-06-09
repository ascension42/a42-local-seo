import { notFound } from 'next/navigation'
import { getNetworkCityBySlug } from '@/lib/queries'
import { createStaticClient } from '@/lib/supabase/static'
import { siteConfig } from '@/lib/config'
import type { Metadata } from 'next'
import Link from 'next/link'

export const revalidate = 3600

export async function generateStaticParams() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return []
  const supabase = createStaticClient()
  const { data } = await supabase.from('network_cities').select('slug')
  return (data ?? []).map((c: { slug: string }) => ({ slug: c.slug }))
}

const siteUrl = `https://${siteConfig.domain}`

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params
  const city = await getNetworkCityBySlug(slug)
  if (!city) return {}

  const title = `Sophrologue ${city.name} — Praticiens certifiés`
  const description = `Trouvez un sophrologue certifié à ${city.name}${city.region ? ` (${city.region})` : ''}. Praticiens vérifiés, consultations en cabinet ou en ligne.`

  return {
    title,
    description,
    keywords: [
      `sophrologue ${city.name}`,
      `sophrologie ${city.name}`,
      `sophrologue certifié`,
      'séance sophrologie',
    ],
    alternates: { canonical: `${siteUrl}/villes/${slug}` },
    openGraph: {
      title,
      description,
      url: `${siteUrl}/villes/${slug}`,
      type: 'website',
      locale: 'fr_FR',
    },
  }
}

function formatPopulation(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace('.0', '')} M`
  if (n >= 10_000) return `${Math.round(n / 1_000)} 000`
  return n.toLocaleString('fr-FR')
}

const SPECIALTIES = [
  'Gestion du stress',
  'Troubles du sommeil',
  'Préparation mentale',
  'Confiance en soi',
  'Accompagnement périnatal',
  'Anxiété & burn-out',
]

export default async function CityPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const city = await getNetworkCityBySlug(slug)
  if (!city) notFound()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const heroImageUrl = supabaseUrl
    ? `${supabaseUrl}/storage/v1/object/public/media/${siteConfig.specialty}/${slug}/hero/hero.jpg`
    : null

  const cityJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'City',
    name: city.name,
    ...(city.region ? { containedInPlace: { '@type': 'AdministrativeArea', name: city.region } } : {}),
    ...(city.population ? { population: city.population } : {}),
    url: `${siteUrl}/villes/${slug}`,
  }

  const medicalJsonLd = city.is_live && city.domain
    ? {
        '@context': 'https://schema.org',
        '@type': 'MedicalBusiness',
        name: `Sophrologues à ${city.name}`,
        description: `Annuaire de sophrologues certifiés à ${city.name}`,
        url: `https://${city.domain}`,
        areaServed: { '@type': 'City', name: city.name },
        numberOfEmployees: { '@type': 'QuantitativeValue', value: city.practitioner_count },
      }
    : null

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Villes', item: `${siteUrl}/villes` },
      { '@type': 'ListItem', position: 3, name: city.name, item: `${siteUrl}/villes/${slug}` },
    ],
  }

  const popLabel = city.population ? formatPopulation(city.population) : null
  const isLargeCity = (city.population ?? 0) > 50_000

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(cityJsonLd) }} />
      {medicalJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(medicalJsonLd) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* Hero */}
      <div className="relative min-h-[320px] md:h-[360px] overflow-hidden">
        {heroImageUrl ? (
          <img
            src={heroImageUrl}
            alt={`Sophrologue ${city.name}`}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-green-dark via-[#3c6947] to-green" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-green-deep/90 via-green-deep/70 to-green-deep/30" />

        <div className="absolute inset-0 flex flex-col justify-center px-5 md:px-12 text-white w-full md:w-[60%]">
          <nav className="flex items-center gap-1.5 text-[10px] text-white/60 mb-5" aria-label="Fil d'Ariane">
            <Link href="/" className="hover:text-white transition-colors">Accueil</Link>
            <span>/</span>
            <Link href="/villes" className="hover:text-white transition-colors">Villes</Link>
            <span>/</span>
            <span className="text-white/90">{city.name}</span>
          </nav>
          <p className="text-[10px] font-semibold uppercase tracking-[2.5px] text-green-light mb-3">
            {city.region ?? 'France'}
          </p>
          <h1 className="text-[28px] md:text-[36px] leading-[1.15] mb-4 tracking-tight text-white font-extrabold">
            Sophrologue<br />
            à <span className="text-green-light">{city.name}</span>
          </h1>
          <p className="text-[13px] text-white/80 leading-[1.65] max-w-[340px]">
            Praticiens certifiés et vérifiés. Consultations en cabinet ou en ligne.
          </p>
        </div>

        {/* Stats chips */}
        <div className="absolute bottom-4 right-3 md:bottom-7 md:right-10 flex gap-1.5 md:gap-2">
          {city.practitioner_count > 0 && (
            <div className="text-center bg-black/30 backdrop-blur-sm px-2 py-1 md:px-4 md:py-2.5 rounded-md md:rounded-xl border border-white/10">
              <span className="block text-[13px] md:text-[20px] font-extrabold text-white leading-tight">
                {city.practitioner_count}
              </span>
              <span className="text-[7px] md:text-[10px] font-semibold text-white/70 uppercase tracking-[0.3px] md:tracking-[1px]">
                Praticiens
              </span>
            </div>
          )}
          {popLabel && (
            <div className="text-center bg-black/30 backdrop-blur-sm px-2 py-1 md:px-4 md:py-2.5 rounded-md md:rounded-xl border border-white/10">
              <span className="block text-[13px] md:text-[20px] font-extrabold text-white leading-tight">
                {popLabel}
              </span>
              <span className="text-[7px] md:text-[10px] font-semibold text-white/70 uppercase tracking-[0.3px] md:tracking-[1px]">
                Habitants
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-[1060px] mx-auto px-4 md:px-10 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 md:gap-12">
          {/* Left */}
          <div>
            <h2 className="text-xl font-extrabold text-green-dark mb-4 tracking-tight">
              La sophrologie à {city.name}
            </h2>
            <p className="text-[13px] text-muted leading-[1.85] mb-4">
              À {city.name}{city.region ? `, en ${city.region},` : ','} la sophrologie accompagne de nombreux
              habitants dans la gestion du stress, l&apos;amélioration du sommeil et le renforcement de la confiance
              en soi.{' '}
              {isLargeCity
                ? `Avec ${popLabel} habitants, la ville dispose d'un tissu de praticiens qualifiés pour répondre à toutes les demandes.`
                : 'Ville à taille humaine, elle offre un cadre propice à un accompagnement personnalisé et à l\'écoute.'}
            </p>
            <p className="text-[13px] text-muted leading-[1.85] mb-8">
              Nos sophrologues certifiés à {city.name} interviennent pour adultes, adolescents et seniors — en
              cabinet ou en visioconférence. Chaque praticien est vérifié avant d&apos;être référencé sur notre
              annuaire.
            </p>

            <h3 className="text-[14px] font-extrabold text-green-dark mb-4 tracking-tight">
              Motifs de consultation fréquents
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {SPECIALTIES.map((label) => (
                <div
                  key={label}
                  className="flex items-center gap-2.5 px-4 py-3 bg-surface rounded-xl border border-border"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-green shrink-0" />
                  <span className="text-[12px] font-semibold text-green-dark">{label}</span>
                </div>
              ))}
            </div>

            {city.is_live && city.domain ? (
              <Link
                href={`https://${city.domain}`}
                className="inline-flex items-center gap-2 bg-green text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-[#4faa73] transition-colors"
              >
                Voir les praticiens à {city.name} →
              </Link>
            ) : (
              <div className="inline-flex items-center gap-2.5 bg-bg-alt text-muted font-semibold text-[13px] px-5 py-3 rounded-xl border border-border">
                <span className="w-2 h-2 rounded-full bg-muted" />
                Annuaire en cours de déploiement à {city.name}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="bg-white border-[1.5px] border-border rounded-xl p-5">
              <h3 className="text-[13px] font-extrabold text-green-dark mb-4 pb-2.5 border-b border-border">
                {city.name} en bref
              </h3>
              <dl className="space-y-3.5">
                {city.region && (
                  <div>
                    <dt className="text-[10px] font-bold text-muted uppercase tracking-[1px]">Région</dt>
                    <dd className="text-[13px] font-semibold text-green-dark mt-0.5">{city.region}</dd>
                  </div>
                )}
                {city.population && (
                  <div>
                    <dt className="text-[10px] font-bold text-muted uppercase tracking-[1px]">Population</dt>
                    <dd className="text-[13px] font-semibold text-green-dark mt-0.5">
                      {city.population.toLocaleString('fr-FR')} habitants
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-[10px] font-bold text-muted uppercase tracking-[1px]">Praticiens</dt>
                  <dd className="mt-0.5 flex items-center gap-1.5">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${city.practitioner_count > 0 ? 'bg-green' : 'bg-muted'}`}
                    />
                    <span className="text-[13px] font-semibold text-green-dark">
                      {city.practitioner_count > 0
                        ? `${city.practitioner_count} référencé${city.practitioner_count > 1 ? 's' : ''}`
                        : 'Bientôt disponible'}
                    </span>
                  </dd>
                </div>
                {city.domain && (
                  <div>
                    <dt className="text-[10px] font-bold text-muted uppercase tracking-[1px]">Site dédié</dt>
                    <dd className="text-[13px] mt-0.5">
                      <span className={city.is_live ? 'text-green font-semibold' : 'text-muted'}>{city.domain}</span>
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="bg-green-dark rounded-xl p-5 text-center">
              <h4 className="text-sm font-extrabold text-white mb-1.5">
                Vous exercez à {city.name} ?
              </h4>
              <p className="text-[11px] text-white/65 leading-[1.5] mb-4">
                Rejoignez l&apos;annuaire et développez votre clientèle locale.
              </p>
              <Link
                href="/inscription"
                className="block bg-green text-white font-bold text-xs py-2.5 rounded-md hover:bg-[#4faa73] transition-colors"
              >
                Inscrire mon cabinet →
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}
