import type { Metadata } from 'next'
import { getRotatingPractitioners, getHeroStats, getBlogPosts, getTopTags, getNetworkCityBySlug } from '@/lib/queries'
import Hero from '@/components/home/Hero'
import CategoryGrid from '@/components/home/CategoryGrid'
import SectionHeader from '@/components/ui/SectionHeader'
import PractitionerCard from '@/components/practitioners/PractitionerCard'
import BlogSection from '@/components/home/BlogSection'
import SeoText from '@/components/home/SeoText'
import Link from 'next/link'
import { siteConfig } from '@/lib/config'

export const revalidate = 3600

const siteUrl = `https://${siteConfig.domain}`
const sp = siteConfig.specialtyLabel.toLowerCase()
const city = siteConfig.cityLabel

export const metadata: Metadata = {
  title: `${siteConfig.specialtyLabel} ${city} — Annuaire certifié`,
  description: `Trouvez votre ${sp} certifié à ${city}. Praticiens vérifiés, consultations en cabinet ou en ligne. Prise de rendez-vous directe, sans ordonnance.`,
  alternates: { canonical: siteUrl },
  openGraph: {
    title: `${siteConfig.specialtyLabel} ${city} — Annuaire certifié`,
    description: `Annuaire des ${sp}s certifiés à ${city}. Praticiens vérifiés, disponibles en cabinet ou en ligne.`,
    url: siteUrl,
    type: 'website',
  },
}

export default async function HomePage() {
  const [displayedPractitioners, heroStats, posts, topTags, homeCity] = await Promise.all([
    getRotatingPractitioners(3),
    getHeroStats(),
    getBlogPosts(),
    getTopTags(8),
    getNetworkCityBySlug(siteConfig.city),
  ])

  const directoryJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HealthAndBeautyBusiness',
    '@id': `${siteUrl}/#directory`,
    name: `${siteConfig.siteName} — Annuaire certifié`,
    url: siteUrl,
    description: `Annuaire des ${sp}s certifiés à ${city}. ${heroStats.practitionerCount} praticien${heroStats.practitionerCount > 1 ? 's' : ''} vérifiés, consultations en cabinet ou en ligne.`,
    areaServed: { '@type': 'City', name: city },
    numberOfEmployees: { '@type': 'QuantitativeValue', value: heroStats.practitionerCount },
    knowsAbout: [siteConfig.specialty, 'relaxation', 'gestion du stress', 'troubles du sommeil', 'anxiété', 'bien-être'],
    publisher: { '@id': `${siteUrl}/#organization` },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(directoryJsonLd) }} />
      <Hero
        practitionerCount={heroStats.practitionerCount}
        neighborhoodCount={heroStats.neighborhoodCount}
        tagCount={heroStats.tagCount}
        region={homeCity?.region}
        population={homeCity?.population}
      />

      <section className="py-[52px] pb-11">
        <div className="max-w-[1060px] mx-auto px-4 md:px-10">
          <SectionHeader
            eyebrow="Je cherche de l'aide pour..."
            title="Trouver le bon accompagnement"
            subtitle="Sélectionnez votre problématique pour voir les praticiens disponibles"
          />
          <CategoryGrid tags={topTags} />
        </div>
      </section>

      <section className="pb-[52px]">
        <div className="max-w-[1060px] mx-auto px-4 md:px-10">
          <SectionHeader
            eyebrow="Praticiens du réseau"
            title={`Les ${siteConfig.specialtyLabel.toLowerCase()}s de ${siteConfig.cityLabel}`}
            subtitle="Certifiés et vérifiés par notre équipe"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[18px]">
            {displayedPractitioners.map((p) => (
              <PractitionerCard key={p.id} practitioner={p} />
            ))}
          </div>
          <div className="text-center mt-7">
            <Link
              href="/praticiens"
              className="text-green-dark text-[13px] font-semibold border-b-2 border-green pb-px hover:text-green transition-colors"
            >
              Voir tous les praticiens →
            </Link>
          </div>
        </div>
      </section>

      <BlogSection posts={posts} />
      <SeoText />
    </>
  )
}
