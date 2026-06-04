import { siteConfig } from '@/lib/config'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `Inscrire mon cabinet — ${siteConfig.siteName}`,
  description: `Soyez visible par les patients qui vous cherchent à ${siteConfig.cityLabel}. Profil complet, lien de réservation, visibilité Google.`,
}

const plans = [
  {
    name: 'Standard',
    price: 'Gratuit',
    priceNote: '/toujours',
    featured: false,
    features: [
      { text: "Profil public dans l'annuaire", active: true },
      { text: 'Nom, spécialité, quartier',      active: true },
      { text: 'Lien vers votre site',           active: true },
      { text: 'Position mise en avant',         active: false },
      { text: 'Lien de réservation direct',     active: false },
      { text: '"Badge Certifié vérifié"',       active: false },
      { text: 'Profil complet (bio, avis)',     active: false },
    ],
  },
  {
    name: 'Premium',
    price: '59 €',
    priceNote: '/mois',
    featured: true,
    features: [
      { text: "Profil public dans l'annuaire", active: true },
      { text: 'Nom, spécialité, quartier',      active: true },
      { text: 'Lien vers votre site',           active: true },
      { text: 'Position mise en avant (top 3)', active: true },
      { text: 'Lien de réservation direct',     active: true },
      { text: 'Badge "Certifié vérifié"',       active: true },
      { text: 'Profil complet (bio, avis)',     active: true },
    ],
  },
]

const steps = [
  { n: '1', title: 'Créez votre compte',    desc: 'Remplissez votre profil — nom, spécialité, photo, bio, certifications.' },
  { n: '2', title: 'Vérification',          desc: 'Notre équipe vérifie votre certification RNCP sous 24h.' },
  { n: '3', title: 'Publication',           desc: 'Votre profil est publié et visible sur Google immédiatement.' },
  { n: '4', title: 'Patients reçus',        desc: 'Les visiteurs cliquent sur votre lien de réservation.' },
]

export default function InscriptionPage() {
  return (
    <>
      <div className="bg-green-dark text-center px-10 py-[52px]">
        <span className="inline-block bg-surface text-green-dark text-[10px] font-bold px-3.5 py-[5px] rounded-xl uppercase tracking-[1px] mb-4">
          Pour les praticiens
        </span>
        <h1 className="text-[34px] font-extrabold text-white leading-[1.2] mb-3 tracking-tight">
          Soyez visible par<br />les patients qui vous cherchent<br />
          <span className="text-green-light">à {siteConfig.cityLabel}</span>
        </h1>
        <p className="text-sm text-white/70 max-w-[560px] mx-auto leading-[1.65]">
          Inscrivez votre cabinet sur le premier annuaire de praticiens.
          Profil complet, lien de réservation direct, visibilité Google garantie.
        </p>
      </div>

      <div className="bg-green-deep border-b border-white/10 py-5">
        <div className="max-w-[1060px] mx-auto flex justify-center gap-[60px]">
          {[
            ['1 200', 'visites / mois'],
            ['340', 'clics vers les praticiens'],
            ['#1', `Google "${siteConfig.specialty} ${siteConfig.cityLabel.toLowerCase()}"`],
          ].map(([n, l]) => (
            <div key={String(l)} className="text-center">
              <span className="block text-[26px] font-extrabold text-green-light">{n}</span>
              <span className="text-[11px] text-white/55 font-medium">{l}</span>
            </div>
          ))}
        </div>
      </div>

      <section className="py-14 px-10">
        <div className="max-w-[860px] mx-auto">
          <p className="text-[10px] font-bold text-green uppercase tracking-[2px] text-center mb-2">Tarifs</p>
          <h2 className="text-2xl font-extrabold text-green-dark text-center mb-1.5 tracking-tight">
            Choisissez votre visibilité
          </h2>
          <p className="text-[13px] text-muted text-center mb-9">Sans engagement. Résiliable à tout moment.</p>
          <div className="grid grid-cols-2 gap-5">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-white rounded-2xl p-7 border-2 ${plan.featured ? 'border-green' : 'border-border'}`}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green text-white text-[10px] font-extrabold px-3.5 py-1 rounded-[10px] whitespace-nowrap">
                    Le plus choisi
                  </span>
                )}
                <p className="text-xs font-bold text-muted uppercase tracking-[1.5px] mb-2">{plan.name}</p>
                <p className="text-[38px] font-extrabold text-green-dark tracking-tight mb-0.5">
                  {plan.price}{' '}
                  <span className="text-sm font-medium text-muted">{plan.priceNote}</span>
                </p>
                <ul className="space-y-2.5 my-6">
                  {plan.features.map((f) => (
                    <li key={f.text} className={`flex gap-2.5 items-start text-xs leading-[1.5] ${f.active ? 'text-ink' : 'text-muted'}`}>
                      <span className={`w-4 h-4 rounded-full border-2 shrink-0 mt-0.5 ${f.active ? 'bg-green border-green' : 'bg-bg-alt border-border'}`} />
                      {f.text}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 rounded-lg font-bold text-[13px] border-2 transition-colors ${
                    plan.featured
                      ? 'bg-green text-white border-green hover:bg-[#4faa73]'
                      : 'bg-bg-alt text-green-dark border-border hover:border-green'
                  }`}
                >
                  {plan.featured ? 'Commencer — 59 €/mois' : 'Créer mon profil gratuit'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-bg-alt py-[52px] px-10">
        <div className="max-w-[860px] mx-auto">
          <p className="text-[10px] font-bold text-green uppercase tracking-[2px] text-center mb-2">
            Comment ça marche
          </p>
          <h2 className="text-2xl font-extrabold text-green-dark text-center mb-8 tracking-tight">
            En ligne en moins de 10 minutes
          </h2>
          <div className="grid grid-cols-4 gap-5">
            {steps.map((s) => (
              <div key={s.n} className="text-center">
                <div className="w-[52px] h-[52px] rounded-full bg-surface border-2 border-green-light flex items-center justify-center mx-auto mb-3.5 text-lg font-extrabold text-green-dark">
                  {s.n}
                </div>
                <p className="text-[13px] font-bold text-green-dark mb-1.5">{s.title}</p>
                <p className="text-[11px] text-muted leading-[1.6]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-green-dark text-center py-[52px] px-10">
        <h2 className="text-[26px] font-extrabold text-white mb-2.5">Prêt à remplir votre agenda ?</h2>
        <p className="text-[13px] text-white/70 mb-6">
          Rejoignez les praticiens déjà référencés sur {siteConfig.domain}
        </p>
        <button className="bg-green text-white font-bold text-sm px-8 py-3.5 rounded-lg hover:bg-[#4faa73] transition-colors">
          Inscrire mon cabinet gratuitement
        </button>
      </section>
    </>
  )
}
