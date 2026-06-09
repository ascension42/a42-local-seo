import type { Metadata } from 'next'
import { siteConfig } from '@/lib/config'
import Link from 'next/link'
import FaqAccordion from '@/components/ui/FaqAccordion'

const siteUrl = `https://${siteConfig.domain}`
const city = siteConfig.cityLabel

export const metadata: Metadata = {
  title: `FAQ Sophrologie ${city} — Tarifs, séances, remboursement`,
  description: `Tout savoir sur la sophrologie à ${city} : tarifs (50–90€), remboursement mutuelle, nombre de séances, différences avec la psychologie. Réponses claires.`,
  alternates: { canonical: `${siteUrl}/faq` },
  openGraph: {
    title: `FAQ Sophrologie ${city} — Tarifs, séances, remboursement`,
    description: `Questions fréquentes sur la sophrologie à ${city} : tarifs, remboursement, comment choisir son sophrologue.`,
    url: `${siteUrl}/faq`,
    type: 'website',
  },
}

const faqs = [
  {
    category: 'La sophrologie, c\'est quoi ?',
    questions: [
      {
        q: 'Qu\'est-ce que la sophrologie ?',
        a: 'La sophrologie est une méthode de relaxation dynamique créée par Alfonso Caycedo dans les années 1960. Elle combine des techniques de respiration, de décontraction musculaire progressive et de visualisation positive pour aider à mieux gérer le stress, améliorer le sommeil et renforcer la confiance en soi.',
      },
      {
        q: 'Quelle est la différence entre sophrologie et psychologie ?',
        a: 'Le sophrologue travaille sur le bien-être et le développement personnel à travers des techniques corporelles et mentales. Il ne traite pas les pathologies psychiatriques. Le psychologue, lui, a une formation universitaire en psychologie clinique et accompagne les troubles psychiques. Les deux approches sont complémentaires.',
      },
      {
        q: 'La sophrologie est-elle reconnue médicalement ?',
        a: 'La sophrologie n\'est pas une profession de santé réglementée en France. Elle n\'est donc pas remboursée par la Sécurité Sociale. En revanche, de nombreuses mutuelles proposent un forfait "médecines douces" qui peut couvrir une partie des séances.',
      },
    ],
  },
  {
    category: 'Les séances',
    questions: [
      {
        q: 'Comment se déroule une séance de sophrologie ?',
        a: 'Une séance dure généralement 45 minutes à 1 heure. Elle commence par un échange verbal sur votre état et vos objectifs, suivi d\'exercices pratiques (respiration, relaxation musculaire, visualisation) en position assise ou debout. La séance se termine par un temps d\'intégration et d\'échange.',
      },
      {
        q: 'Combien de séances sont nécessaires ?',
        a: 'Un suivi type comprend entre 6 et 10 séances hebdomadaires. Les premiers effets se ressentent souvent dès la 3ème ou 4ème séance. Certaines personnes continuent au-delà pour un travail de fond, d\'autres s\'arrêtent une fois leurs objectifs atteints.',
      },
      {
        q: 'La sophrologie fonctionne-t-elle en ligne ?',
        a: 'Oui. Les séances en visioconférence sont aussi efficaces qu\'en cabinet pour la grande majorité des problématiques. Elles offrent plus de flexibilité (pas de déplacement, créneaux plus larges) et permettent de pratiquer dans un environnement familier.',
      },
    ],
  },
  {
    category: 'Tarifs et remboursements',
    questions: [
      {
        q: `Combien coûte une séance de sophrologie à ${siteConfig.cityLabel} ?`,
        a: `À ${siteConfig.cityLabel}, le tarif d'une séance individuelle varie entre 50 et 90 € selon l'expérience du praticien et ses spécialités. Les séances en ligne sont généralement 5 à 10 € moins chères qu'en cabinet. Certains praticiens proposent des forfaits multi-séances à tarif réduit.`,
      },
      {
        q: 'La sophrologie est-elle remboursée par la mutuelle ?',
        a: 'La sophrologie n\'est pas remboursée par la Sécurité Sociale. En revanche, de nombreuses mutuelles (Harmonie Mutuelle, MGEN, Alan, Groupama...) proposent un forfait annuel pour les médecines douces, souvent entre 50 et 200 € par an. Consultez votre contrat ou appelez votre mutuelle pour vérifier.',
      },
      {
        q: 'Faut-il une ordonnance pour consulter un sophrologue ?',
        a: 'Non. Vous n\'avez pas besoin d\'ordonnance médicale pour consulter un sophrologue. Cependant, votre médecin peut vous orienter vers un praticien en cas de burn-out, de trouble anxieux, ou de préparation à une intervention chirurgicale.',
      },
    ],
  },
  {
    category: 'Choisir son sophrologue',
    questions: [
      {
        q: 'Comment choisir un sophrologue certifié ?',
        a: 'Vérifiez que le praticien est titulaire d\'un titre RNCP (Répertoire National des Certifications Professionnelles) de niveau 5 minimum. Méfiez-vous des formations de quelques week-ends sans certification reconnue. N\'hésitez pas à demander le diplôme avant de commencer un suivi.',
      },
      {
        q: `Y a-t-il des sophrologues qui consultent en ligne à ${siteConfig.cityLabel} ?`,
        a: `Oui, plusieurs sophrologues référencés sur notre annuaire proposent des consultations en visioconférence. Vous pouvez filtrer par "En ligne" sur notre page annuaire pour les voir.`,
      },
    ],
  },
]

const allQuestions = faqs.flatMap((s) => s.questions)

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: allQuestions.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Accueil', item: siteUrl },
    { '@type': 'ListItem', position: 2, name: `FAQ Sophrologie ${city}`, item: `${siteUrl}/faq` },
  ],
}

export default function FaqPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <div className="bg-green-dark px-4 md:px-10 py-10 md:py-12">
        <div className="max-w-[760px] mx-auto">
          <p className="text-[10px] font-bold text-green-light uppercase tracking-[2px] mb-3">
            Questions fréquentes
          </p>
          <h1 className="text-[24px] md:text-[30px] font-extrabold text-white leading-[1.2] mb-3 tracking-tight">
            La sophrologie à {siteConfig.cityLabel} :<br />toutes vos questions
          </h1>
          <p className="text-sm text-white/70 leading-[1.65]">
            Définition, tarifs, remboursements, nombre de séances... Tout ce qu&apos;il faut savoir avant de consulter.
          </p>
        </div>
      </div>

      <div className="max-w-[760px] mx-auto px-4 md:px-10 py-10 md:py-12 space-y-10">
        {faqs.map((section) => (
          <div key={section.category}>
            <h2 className="text-base font-extrabold text-green-dark mb-4 pb-3 border-b-2 border-border tracking-tight">
              {section.category}
            </h2>
            <FaqAccordion items={section.questions} />
          </div>
        ))}

        <div className="bg-surface border border-green rounded-2xl p-8 text-center">
          <h2 className="text-base font-extrabold text-green-dark mb-2">
            Prêt à trouver votre sophrologue ?
          </h2>
          <p className="text-xs text-muted mb-5">
            Consultez notre annuaire des praticiens certifiés à {siteConfig.cityLabel}.
          </p>
          <Link
            href="/praticiens"
            className="inline-block bg-green text-white font-bold text-sm px-6 py-2.5 rounded-lg hover:bg-[#4faa73] transition-colors"
          >
            Voir les praticiens →
          </Link>
        </div>
      </div>
    </>
  )
}
