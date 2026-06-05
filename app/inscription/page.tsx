import { siteConfig } from '@/lib/config'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `Inscrire mon cabinet — ${siteConfig.siteName}`,
  description: `Soyez visible par les patients qui vous cherchent à ${siteConfig.cityLabel}. Profil complet, lien de réservation, visibilité Google.`,
}

const features = [
  { text: "Profil public dans l'annuaire",   active: true },
  { text: 'Nom, spécialité, quartier',        active: true },
  { text: 'Lien vers votre site',             active: true },
  { text: 'Position mise en avant (top 3)',   active: true },
  { text: 'Lien de réservation direct',       active: true },
  { text: 'Badge "Certifié vérifié"',         active: true },
  { text: 'Profil complet (bio, avis)',        active: true },
  { text: 'Mis en avant dans les articles',   active: true },
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
      {/* Hero */}
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

      {/* Stats */}
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

      {/* Offre unique */}
      <section className="py-14 px-10">
        <div className="max-w-[520px] mx-auto">
          <p className="text-[10px] font-bold text-green uppercase tracking-[2px] text-center mb-2">Tarif</p>
          <h2 className="text-2xl font-extrabold text-green-dark text-center mb-2 tracking-tight">
            Une seule offre, tout inclus
          </h2>
          <p className="text-[13px] text-muted text-center mb-6">Sans engagement. Résiliable à tout moment.</p>

          {/* Bandeau promo */}
          <div className="bg-surface border border-green rounded-xl px-5 py-3.5 mb-6 text-center">
            <p className="text-sm font-bold text-green-dark">
              Offre de lancement — Les 3 premiers inscrits bénéficient du premier mois offert !
            </p>
            <p className="text-[11px] text-muted mt-1">Plus que quelques places disponibles.</p>
          </div>

          {/* Plan unique */}
          <div className="relative bg-white rounded-2xl p-8 border-2 border-green shadow-lg">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green text-white text-[10px] font-extrabold px-4 py-1 rounded-[10px] whitespace-nowrap">
              Accès complet
            </div>

            <div className="text-center mb-6">
              <div className="flex items-end justify-center gap-1">
                <span className="text-[48px] font-extrabold text-green-dark tracking-tight leading-none">24</span>
                <span className="text-xl font-bold text-green-dark mb-1">€</span>
                <span className="text-sm font-medium text-muted mb-2">/mois</span>
              </div>
              <p className="text-[11px] text-muted mt-1">Soit moins de 1 € par jour</p>
            </div>

            <ul className="space-y-3 mb-8">
              {features.map((f) => (
                <li key={f.text} className="flex gap-3 items-center text-sm text-ink">
                  <span className="w-5 h-5 rounded-full bg-green flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 10 8" width="10" fill="none">
                      <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {f.text}
                </li>
              ))}
            </ul>

            <a href="/inscription/formulaire" className="block w-full py-4 rounded-xl font-bold text-[15px] bg-green text-white hover:bg-[#4faa73] transition-colors text-center">
              Inscrire mon cabinet — 24 €/mois
            </a>
            <p className="text-center text-[11px] text-muted mt-3">
              Sans engagement · Annulable à tout moment · Paiement sécurisé
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
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

      {/* FAQ */}
      <section className="py-[52px] px-10">
        <div className="max-w-[680px] mx-auto">
          <h2 className="text-2xl font-extrabold text-green-dark text-center mb-8 tracking-tight">
            Questions fréquentes
          </h2>
          {[
            ['Puis-je annuler à tout moment ?', 'Oui, sans frais ni préavis. Votre profil est retiré dans les 24h suivant votre résiliation.'],
            ['Comment est vérifiée ma certification ?', 'Nous vous demandons de télécharger votre diplôme RNCP. Notre équipe valide sous 24h ouvrées.'],
            ['Dois-je avoir un système de réservation en ligne ?', 'Non. Si vous n\'avez pas de Doctolib ou Cal.com, nous affichons votre numéro ou email.'],
            ['Qu\'est-ce que l\'offre de lancement ?', 'Les 3 premiers praticiens à s\'inscrire bénéficient du premier mois totalement offert. Aucune carte bancaire requise pendant ce mois.'],
          ].map(([q, a]) => (
            <div key={String(q)} className="border-b border-border py-4">
              <p className="text-sm font-bold text-green-dark mb-2">{q}</p>
              <p className="text-xs text-muted leading-[1.7]">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-green-dark text-center py-[52px] px-10">
        <h2 className="text-[26px] font-extrabold text-white mb-2.5">Prêt à remplir votre agenda ?</h2>
        <p className="text-[13px] text-white/70 mb-2">
          Rejoignez les praticiens déjà référencés sur {siteConfig.domain}
        </p>
        <p className="text-[12px] text-green-light mb-6 font-semibold">
          Offre de lancement : premier mois offert pour les 3 premiers inscrits
        </p>
        <a href="/inscription/formulaire" className="inline-block bg-green text-white font-bold text-sm px-8 py-3.5 rounded-lg hover:bg-[#4faa73] transition-colors">
          Inscrire mon cabinet — 24 €/mois
        </a>
      </section>
    </>
  )
}
