import { siteConfig } from '@/lib/config'
import type { Metadata } from 'next'
import CountdownTimer from '@/components/inscription/CountdownTimer'
import { getPractitioners } from '@/lib/queries'

export const revalidate = 3600

export const metadata: Metadata = {
  title: `Rejoindre le réseau — ${siteConfig.siteName}`,
  description: `Intégrez un réseau sélectif de ${siteConfig.specialtyPlural} à ${siteConfig.cityLabel}. 5 places maximum. Candidature examinée sous 48h.`,
}

const MAX_SPOTS = 5

const steps = [
  { n: '1', title: 'Envoyez votre candidature', desc: 'Remplissez le formulaire en 2 minutes — nom, spécialité, email, téléphone.' },
  { n: '2', title: 'Vérification sous 48h',     desc: 'Notre équipe vérifie votre certification RNCP et examine votre profil.' },
  { n: '3', title: 'Recevez votre lien',        desc: 'Une fois approuvé·e, vous recevez votre lien de paiement par email.' },
  { n: '4', title: 'Profil en ligne',           desc: 'Votre profil est publié et visible sur Google immédiatement.' },
]

const benefits = [
  "Profil complet dans l'annuaire local",
  'Badge Certifié & Vérifié',
  'Lien de réservation direct',
  'Présent sur la page d\'accueil et dans les articles de blog',
  'Accès au groupe WhatsApp privé des praticiens de votre ville',
  'Afterworks trimestriels avec vos confrères',
  'Référent de ville nommé pour animer le réseau',
  'Newsletter mensuelle avec conseils SEO exclusifs',
  'Lien vers votre site personnel',
]

function Check() {
  return (
    <span className="w-5 h-5 rounded-full bg-green flex items-center justify-center shrink-0">
      <svg viewBox="0 0 10 8" width="10" fill="none">
        <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

export default async function InscriptionPage() {
  const practitioners = await getPractitioners()
  const spotsUsed = practitioners.length
  const spotsLeft = Math.max(0, MAX_SPOTS - spotsUsed)
  const isFull = spotsLeft === 0

  return (
    <>
      {/* Hero */}
      <div className="bg-green-dark text-center px-4 md:px-10 py-[52px]">
        <span className="inline-block bg-surface text-green-dark text-[10px] font-bold px-3.5 py-[5px] rounded-xl uppercase tracking-[1px] mb-4">
          Réseau sélectif · {MAX_SPOTS} places par ville
        </span>
        <h1 className="text-[26px] md:text-[34px] font-extrabold text-white leading-[1.2] mb-3 tracking-tight">
          Rejoignez le réseau des<br />
          <span className="text-green-light">{siteConfig.specialtyPlural} de {siteConfig.cityLabel}</span>
        </h1>
        <p className="text-sm text-white/70 max-w-[560px] mx-auto leading-[1.65]">
          Un réseau fermé, sélectif et limité. Pas de concurrence entre membres —
          chaque praticien est unique et complémentaire.
        </p>
      </div>

      {/* Stats bar */}
      <div className="bg-green-deep border-b border-white/10 py-5">
        <div className="max-w-[1060px] mx-auto flex flex-wrap justify-center gap-6 md:gap-[60px]">
          {[
            ['1 200', 'visites / mois'],
            ['340', 'clics vers les praticiens'],
            ['#1', `Google "${siteConfig.specialty} ${siteConfig.cityLabel.toLowerCase()}"`],
          ].map(([n, l]) => (
            <div key={String(l)} className="text-center">
              <span className="block text-[20px] md:text-[26px] font-extrabold text-green-light">{n}</span>
              <span className="text-[11px] text-white/55 font-medium">{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <section className="py-14 px-4 md:px-10">
        <div className="max-w-[560px] mx-auto">
          <p className="text-[10px] font-bold text-green uppercase tracking-[2px] text-center mb-2">Offre unique</p>
          <h2 className="text-2xl font-extrabold text-green-dark text-center mb-2 tracking-tight">
            Accès complet au réseau
          </h2>
          <p className="text-[13px] text-muted text-center mb-7">Sans engagement. Résiliable à tout moment.</p>

          <CountdownTimer />

          {/* Single plan card */}
          <div className="bg-white rounded-2xl p-7 border-2 border-green shadow-lg">
            <p className="text-[10px] font-bold text-green uppercase tracking-[1.5px] mb-1">Accès Réseau</p>

            <div className="flex items-baseline gap-2 mb-0.5">
              <span className="text-sm text-muted line-through">49 €/mois</span>
              <span className="text-[10px] font-bold bg-green/10 text-green px-1.5 py-0.5 rounded">
                -51 %
              </span>
            </div>
            <div className="flex items-end gap-1 mb-1">
              <span className="text-[34px] md:text-[42px] font-extrabold text-green-dark tracking-tight leading-none">24</span>
              <span className="text-lg font-bold text-green-dark mb-1">€</span>
              <span className="text-sm font-medium text-muted mb-2">/mois</span>
            </div>
            <p className="text-[11px] text-muted mb-5">Tarif de lancement — valable jusqu&apos;au 1er juillet 2026</p>

            {/* Spots counter — inside card */}
            <div className={`rounded-xl px-4 py-3 mb-6 ${isFull ? 'bg-red-50 border border-red-200' : spotsLeft === 1 ? 'bg-orange-50 border border-orange-200' : 'bg-green/8 border border-green/20'}`}>
              <div className="flex gap-1.5 mb-2">
                {Array.from({ length: MAX_SPOTS }).map((_, i) => (
                  <div key={i} className={`h-1.5 flex-1 rounded-full ${i < spotsUsed ? (isFull ? 'bg-red-400' : 'bg-green') : 'bg-border'}`} />
                ))}
              </div>
              <p className={`text-[12px] font-bold ${isFull ? 'text-red-700' : spotsLeft === 1 ? 'text-orange-700' : 'text-green-dark'}`}>
                {isFull ? 'Complet — liste d\'attente ouverte' : spotsLeft === 1 ? '⚠ Dernière place disponible' : `${spotsLeft} place${spotsLeft > 1 ? 's' : ''} restante${spotsLeft > 1 ? 's' : ''} sur ${MAX_SPOTS}`}
              </p>
            </div>

            <ul className="space-y-3 mb-7">
              {benefits.map((f) => (
                <li key={f} className="flex gap-3 items-start text-[13px] text-ink">
                  <Check />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            {isFull ? (
              <a
                href="/inscription/formulaire"
                className="block w-full py-3 rounded-xl font-bold text-[14px] bg-bg-alt text-muted border border-border text-center cursor-default"
              >
                Rejoindre la liste d&apos;attente
              </a>
            ) : (
              <a
                href="/inscription/formulaire"
                className="block w-full py-3 rounded-xl font-bold text-[14px] bg-green text-white hover:bg-[#4faa73] transition-colors text-center"
              >
                Soumettre ma candidature →
              </a>
            )}
          </div>

          <p className="text-center text-[11px] text-muted mt-5">
            Sans engagement · Annulable à tout moment · Paiement après validation
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-bg-alt py-[52px] px-4 md:px-10">
        <div className="max-w-[860px] mx-auto">
          <p className="text-[10px] font-bold text-green uppercase tracking-[2px] text-center mb-2">Comment ça marche</p>
          <h2 className="text-2xl font-extrabold text-green-dark text-center mb-2 tracking-tight">
            Un processus en 4 étapes
          </h2>
          <p className="text-[13px] text-muted text-center mb-8">Votre profil n&apos;est activé qu&apos;après validation — pour garantir la qualité du réseau.</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
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

      {/* FAQ */}
      <section className="py-[52px] px-4 md:px-10">
        <div className="max-w-[680px] mx-auto">
          <h2 className="text-2xl font-extrabold text-green-dark text-center mb-8 tracking-tight">Questions fréquentes</h2>
          {[
            ['Pourquoi seulement 5 places ?', `Pour éviter la concurrence entre membres et garantir la valeur du réseau. Chaque praticien référencé est unique dans sa position — pas de mise en concurrence directe.`],
            ['Que se passe-t-il si le réseau est complet ?', `Vous pouvez rejoindre la liste d'attente. Vous serez contacté en priorité si une place se libère ou si nous ouvrons des places supplémentaires.`],
            ['Comment est vérifiée ma candidature ?', "Notre équipe examine votre certification RNCP et votre activité sous 48h ouvrées. Vous recevez ensuite votre lien de paiement par email."],
            ['Puis-je annuler à tout moment ?', 'Oui, sans frais ni préavis. Votre profil est retiré dans les 24h suivant votre résiliation.'],
            ["Jusqu'à quand dure le tarif promotionnel ?", "Le tarif de lancement à 24€/mois est valable jusqu'au 1er juillet 2026. Passé cette date, le tarif passera à 49€/mois."],
            ['Que comprend le groupe WhatsApp ?', `Un groupe privé réservé aux praticiens référencés de votre ville. Échanges professionnels, co-références de patients, entraide et organisation des afterworks.`],
          ].map(([q, a]) => (
            <div key={String(q)} className="border-b border-border py-4">
              <p className="text-sm font-bold text-green-dark mb-2">{q}</p>
              <p className="text-xs text-muted leading-[1.7]">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-green-dark text-center py-[52px] px-4 md:px-10">
        <h2 className="text-[22px] md:text-[26px] font-extrabold text-white mb-2.5">
          {isFull ? 'Réseau complet — rejoignez la liste d\'attente' : 'Prêt à rejoindre le réseau ?'}
        </h2>
        <p className="text-[13px] text-white/70 mb-6">
          {isFull
            ? `Soyez alerté en priorité à la prochaine ouverture de place à ${siteConfig.cityLabel}.`
            : `${spotsLeft} place${spotsLeft > 1 ? 's' : ''} restante${spotsLeft > 1 ? 's' : ''} sur ${MAX_SPOTS} — candidature examinée sous 48h.`
          }
        </p>
        <a
          href="/inscription/formulaire"
          className="inline-block bg-green text-white font-bold text-sm px-8 py-3.5 rounded-lg hover:bg-[#4faa73] transition-colors"
        >
          {isFull ? 'Rejoindre la liste d\'attente →' : 'Soumettre ma candidature →'}
        </a>
      </section>
    </>
  )
}
