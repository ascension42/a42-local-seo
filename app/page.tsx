import { getRotatingPractitioners, getHeroStats, getBlogPosts } from '@/lib/queries'
import Hero from '@/components/home/Hero'
import CategoryGrid from '@/components/home/CategoryGrid'
import SectionHeader from '@/components/ui/SectionHeader'
import PractitionerCard from '@/components/practitioners/PractitionerCard'
import BlogSection from '@/components/home/BlogSection'
import SeoText from '@/components/home/SeoText'
import Link from 'next/link'
import { siteConfig } from '@/lib/config'

export const revalidate = 3600

export default async function HomePage() {
  const [displayedPractitioners, heroStats, posts] = await Promise.all([
    getRotatingPractitioners(3),
    getHeroStats(),
    getBlogPosts(),
  ])

  return (
    <>
      <Hero practitionerCount={heroStats.practitionerCount} neighborhoodCount={heroStats.neighborhoodCount} tagCount={heroStats.tagCount} />

      <section className="py-[52px] pb-11">
        <div className="max-w-[1060px] mx-auto px-4 md:px-10">
          <SectionHeader
            eyebrow="Je cherche de l'aide pour..."
            title="Trouver le bon accompagnement"
            subtitle="Sélectionnez votre problématique pour voir les praticiens disponibles"
          />
          <CategoryGrid />
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
