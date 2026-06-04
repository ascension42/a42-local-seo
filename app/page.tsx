import { getFeaturedPractitioners, getBlogPosts, getPractitioners } from '@/lib/queries'
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
  const [featured, allPractitioners, posts] = await Promise.all([
    getFeaturedPractitioners(),
    getPractitioners(),
    getBlogPosts(),
  ])

  return (
    <>
      <Hero practitionerCount={allPractitioners.length} />

      <section className="py-[52px] pb-11">
        <div className="max-w-[1060px] mx-auto px-10">
          <SectionHeader
            eyebrow="Je cherche de l'aide pour..."
            title="Trouver le bon accompagnement"
            subtitle="Sélectionnez votre problématique pour voir les praticiens disponibles"
          />
          <CategoryGrid />
        </div>
      </section>

      <section className="pb-[52px]">
        <div className="max-w-[1060px] mx-auto px-10">
          <SectionHeader
            eyebrow="Praticiens mis en avant"
            title={`Les ${siteConfig.specialtyLabel.toLowerCase()}s de ${siteConfig.cityLabel}`}
            subtitle="Certifiés et vérifiés par notre équipe"
          />
          <div className="grid grid-cols-3 gap-[18px]">
            {featured.map((p) => <PractitionerCard key={p.id} practitioner={p} />)}
          </div>
          {allPractitioners.length > featured.length && (
            <div className="text-center mt-7">
              <Link href="/praticiens" className="text-green-dark text-[13px] font-semibold border-b-2 border-green pb-px hover:text-green transition-colors">
                Voir les {allPractitioners.length} praticiens →
              </Link>
            </div>
          )}
        </div>
      </section>

      <BlogSection posts={posts} />
      <SeoText />
    </>
  )
}
