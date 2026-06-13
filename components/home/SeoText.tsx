import { siteConfig } from '@/lib/config'
import Link from 'next/link'

export default function SeoText() {
  const sp = siteConfig.specialtyLabel.toLowerCase()
  const spPlural = siteConfig.specialtyPlural.toLowerCase()
  const city = siteConfig.cityLabel
  return (
    <section className="py-12 border-t border-border">
      <div className="max-w-[1060px] mx-auto px-4 md:px-10">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
          <div>
            <h2 className="text-xl font-extrabold text-green-dark mb-3.5 tracking-tight">
              La {sp} à {city}
            </h2>
            <p className="text-xs text-muted leading-[1.8]">
              La {sp} est une approche de bien-être et d'accompagnement personnel qui aide à mieux gérer
              le stress, améliorer la qualité de vie et renforcer les ressources intérieures.
              À {city}, nos praticiens certifiés vous accompagnent à votre rythme,
              en cabinet ou en ligne.
            </p>
            <p className="text-xs text-muted leading-[1.8] mt-2.5">
              Que ce soit pour un suivi individuel ou des ateliers collectifs, l&apos;offre est large et adaptée
              à tous les profils : adultes, adolescents, femmes enceintes, sportifs.
            </p>
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-green-dark mb-3.5 tracking-tight">
              Pourquoi consulter un {sp} ?
            </h2>
            <p className="text-xs text-muted leading-[1.8]">
              Les motifs de consultation sont nombreux : gestion du stress au travail, troubles du sommeil,
              anxiété et crises d&apos;angoisse, phobies, préparation mentale à un examen ou à un accouchement,
              accompagnement du burn-out, confiance en soi. Le praticien adapte chaque suivi à votre situation.
            </p>
            <p className="text-xs text-muted leading-[1.8] mt-2.5">
              Un suivi type comprend 6 à 10 séances. Les premiers effets se ressentent dès la 3ème séance.
              Le tarif moyen d&apos;un {sp} à {city} se situe entre 50 et 90 €.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h2 className="text-base font-extrabold text-green-dark mb-3 tracking-tight">
              Comment choisir son {sp} ?
            </h2>
            <p className="text-xs text-muted leading-[1.8]">
              Vérifiez que le praticien est titulaire d&apos;une certification reconnue. Méfiez-vous des
              formations courtes sans accréditation sérieuse. Tous les praticiens de notre annuaire sont
              vérifiés par notre équipe avant publication.
            </p>
            <p className="text-xs text-muted leading-[1.8] mt-2">
              Vous pouvez consulter sans ordonnance et sans délai d&apos;attente.
            </p>
          </div>
          <div>
            <h2 className="text-base font-extrabold text-green-dark mb-3 tracking-tight">
              {siteConfig.specialtyLabel} en ligne à {city}
            </h2>
            <p className="text-xs text-muted leading-[1.8]">
              Plusieurs {spPlural} de notre annuaire proposent des séances en visioconférence.
              Aussi efficaces qu&apos;en cabinet, elles offrent plus de flexibilité : pas de déplacement,
              créneaux élargis, pratique depuis chez vous.
            </p>
            <p className="text-xs text-muted leading-[1.8] mt-2">
              Idéal si vous êtes à {city} ou dans les communes environnantes, ou si votre agenda est chargé.
            </p>
          </div>
          <div>
            <h2 className="text-base font-extrabold text-green-dark mb-3 tracking-tight">
              Remboursement & tarifs
            </h2>
            <p className="text-xs text-muted leading-[1.8]">
              La {sp} n&apos;est pas remboursée par la Sécurité Sociale. En revanche, de nombreuses
              mutuelles (Harmonie, MGEN, Alan…) proposent un forfait médecines douces couvrant une partie
              des séances. Renseignez-vous auprès de votre mutuelle.
            </p>
            <p className="text-xs text-muted leading-[1.8] mt-2">
              Tarifs à {city} : entre 50 € et 90 € la séance individuelle.{' '}
              <Link href="/faq" className="text-green hover:underline font-semibold">
                Voir la FAQ
              </Link>
            </p>
          </div>
        </div>

      </div>
    </section>
  )
}
