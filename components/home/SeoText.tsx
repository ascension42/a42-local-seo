import { siteConfig } from '@/lib/config'

export default function SeoText() {
  const sp = siteConfig.specialtyLabel.toLowerCase()
  const city = siteConfig.cityLabel
  return (
    <section className="py-12">
      <div className="max-w-[1060px] mx-auto px-10 grid grid-cols-2 gap-10">
        <div>
          <h2 className="text-xl font-extrabold text-green-dark mb-3.5 tracking-tight">
            La {sp} à {city}
          </h2>
          <p className="text-xs text-muted leading-[1.8]">
            La sophrologie est une méthode de relaxation dynamique combinant des techniques de respiration,
            de décontraction musculaire progressive et de visualisation positive. À {city}, de nombreux
            praticiens certifiés RNCP vous accompagnent dans tous les quartiers.
          </p>
          <p className="text-xs text-muted leading-[1.8] mt-2.5">
            Que ce soit en cabinet, en ligne ou en ateliers collectifs, l&apos;offre est riche et accessible.
          </p>
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-green-dark mb-3.5 tracking-tight">
            Pourquoi consulter un {sp} ?
          </h2>
          <p className="text-xs text-muted leading-[1.8]">
            Les motifs de consultation sont nombreux : stress professionnel, troubles du sommeil, phobies,
            préparation à un examen ou à un accouchement, accompagnement des enfants. Le praticien adapte
            son approche à chaque situation.
          </p>
          <p className="text-xs text-muted leading-[1.8] mt-2.5">
            Le tarif moyen à {city} se situe entre 50 et 80 € la séance.
          </p>
        </div>
      </div>
    </section>
  )
}
