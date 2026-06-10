import type { Metadata } from 'next'
import Link from 'next/link'
import { siteConfig } from '@/lib/config'
import { getNetworkCityBySlug } from '@/lib/queries'
import { cityContent } from '@/lib/cityContent'

export const revalidate = 3600

const siteUrl = `https://${siteConfig.domain}`
const city = siteConfig.cityLabel

export const metadata: Metadata = {
  title: cityContent.about.title,
  description: `${city} en Occitanie : patrimoine, canal du Midi, cadre de vie au quotidien... Découvrez la ville et trouvez un sophrologue certifié près de chez vous.`,
  alternates: { canonical: `${siteUrl}/a-propos-de-beziers` },
  openGraph: {
    title: cityContent.about.title,
    description: `Présentation de ${city} : patrimoine, cadre de vie, et annuaire de sophrologues certifiés.`,
    url: `${siteUrl}/a-propos-de-beziers`,
    type: 'website',
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: cityContent.about.title, item: `${siteUrl}/a-propos-de-beziers` },
  ],
}

export default async function AboutCityPage() {
  const networkCity = await getNetworkCityBySlug(siteConfig.city)

  const cityJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'City',
    name: city,
    ...(networkCity?.region ? { containedInPlace: { '@type': 'AdministrativeArea', name: networkCity.region } } : {}),
    ...(networkCity?.population ? { population: networkCity.population } : {}),
    url: `${siteUrl}/a-propos-de-beziers`,
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
            {cityContent.about.title}
          </h1>
          <p className="text-sm text-white/70 leading-[1.65]">
            Patrimoine, cadre de vie et bien-être au quotidien à {city}.
          </p>
        </div>
      </div>

      <div className="max-w-[760px] mx-auto px-4 md:px-10 py-10 md:py-12 space-y-10">
        <section>
          <h2 className="text-base font-extrabold text-green-dark mb-4 pb-3 border-b-2 border-border tracking-tight">
            Présentation générale
          </h2>
          <div className="space-y-4">
            {cityContent.about.intro.map((paragraph) => (
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
            {cityContent.about.wellbeing.map((paragraph) => (
              <p key={paragraph} className="text-[13px] text-muted leading-[1.85]">
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        <div className="bg-surface border border-green rounded-2xl p-8 text-center">
          <h2 className="text-base font-extrabold text-green-dark mb-2 tracking-tight">
            Trouver un {siteConfig.specialtyLabel.toLowerCase()} à {city}
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
