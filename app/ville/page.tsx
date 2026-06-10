import type { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig } from '@/lib/config'
import { getNetworkCityBySlug } from '@/lib/queries'
import { getCityContent } from '@/lib/cityContent'

export const revalidate = 3600

const siteUrl = `https://${siteConfig.domain}`
const content = getCityContent(siteConfig.city, siteConfig.cityLabel)
const sp = siteConfig.specialtyLabel.toLowerCase()

export const metadata: Metadata = {
  title: content.about.title,
  description: `${siteConfig.cityLabel} : patrimoine, cadre de vie et bien-être au quotidien. Découvrez la ville et trouvez un ${sp} certifié près de chez vous.`,
  alternates: { canonical: `${siteUrl}/ville` },
  openGraph: {
    title: content.about.title,
    description: `Présentation de ${siteConfig.cityLabel} : patrimoine, cadre de vie, et annuaire de ${siteConfig.specialtyPlural.toLowerCase()} certifiés.`,
    url: `${siteUrl}/ville`,
    type: 'website',
  },
}

export default async function AboutCityPage() {
  const networkCity = await getNetworkCityBySlug(siteConfig.city)

  const cityJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'City',
    name: siteConfig.cityLabel,
    ...(networkCity?.region ? { containedInPlace: { '@type': 'AdministrativeArea', name: networkCity.region } } : {}),
    ...(networkCity?.population ? { population: networkCity.population } : {}),
    url: `${siteUrl}/ville`,
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Accueil', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: content.about.title, item: `${siteUrl}/ville` },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(cityJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <div className="bg-green-dark px-4 md:px-10 py-10 md:py-12">
        <div className="max-w-[760px] mx-auto">
          <p className="text-[10px] font-bold text-green-light uppercase tracking-[2px] mb-3">
            Votre ville
          </p>
          <h1 className="text-[24px] md:text-[30px] font-extrabold text-white leading-[1.2] mb-3 tracking-tight">
            {content.about.title}
          </h1>
          <p className="text-sm text-white/70 leading-[1.65]">
            Patrimoine, cadre de vie et bien-être au quotidien à {siteConfig.cityLabel}.
          </p>
        </div>
      </div>

      <div className="max-w-[760px] mx-auto px-4 md:px-10 py-10 md:py-12 space-y-10">
        <section>
          <h2 className="text-base font-extrabold text-green-dark mb-4 pb-3 border-b-2 border-border tracking-tight">
            Présentation générale
          </h2>
          <div className="space-y-4">
            {content.about.intro.map((paragraph) => (
              <p key={paragraph} className="text-[13px] text-muted leading-[1.85]">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-base font-extrabold text-green-dark mb-4 pb-3 border-b-2 border-border tracking-tight">
            Cadre de vie &amp; bien-être local
          </h2>
          <div className="space-y-4">
            {content.about.wellbeing.map((paragraph) => (
              <p key={paragraph} className="text-[13px] text-muted leading-[1.85]">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        <div className="bg-surface border border-green rounded-2xl p-8 text-center">
          <h2 className="text-base font-extrabold text-green-dark mb-2 tracking-tight">
            Trouver un {sp} à {siteConfig.cityLabel}
          </h2>
          <p className="text-[13px] text-muted leading-[1.65] mb-5 max-w-[480px] mx-auto">
            Consultez notre annuaire de praticiens certifiés et vérifiés, en cabinet ou en ligne.
          </p>
          <Link
            href="/praticiens"
            className="inline-flex items-center gap-2 bg-green text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-[#4faa73] transition-colors"
          >
            Voir les praticiens →
          </Link>
        </div>
      </div>
    </>
  )
}
