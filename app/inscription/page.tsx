import { siteConfig } from '@/lib/config'
import type { Metadata } from 'next'
import InscriptionPlanCTA from '@/components/inscription/InscriptionPlanCTA'
import CountdownTimer from '@/components/inscription/CountdownTimer'

export const revalidate = 86400

export const metadata: Metadata = {
  title: `Inscrire mon cabinet — ${siteConfig.siteName}`,
  description: `Soyez visible par les patients qui vous cherchent à ${siteConfig.cityLabel}. Profil complet, lien de réservation, visibilité Google garantie.`,
}

const steps = [
  { n: '1', title: 'Envoyez votre demande',  desc: 'Remplissez le formulaire en 2 minutes — nom, spécialité, email, téléphone.' },
  { n: '2', title: 'Vérification 24h',        desc: 'Notre équipe vérifie votre certification RNCP sous 24h.' },
  { n: '3', title: 'Profil publié',           desc: 'Votre profil est en ligne et visible sur Google immédiatement.' },
  { n: '4', title: 'Patients reçus',          desc: 'Les visiteurs cliquent sur votre lien de réservation.' },
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

function Cross() {
  return (
    <span className="w-5 h-5 rounded-full bg-[#f3f4f6] flex items-center justify-center shrink-0">
      <svg viewBox="0 0 10 10" width="10" fill="none">
        <path d="M3 3l4 4M7 3l-4 4" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </span>
  )
}

export default function InscriptionPage() {
  return (
    <>
      {/* Hero */}
      <div className="bg-green-dark text-center px-4 md:px-10 py-[52px]">
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

      {/* Plans */}
      <section className="py-14 px-4 md:px-10">
        <div className="max-w-[860px] mx-auto">
          <p className="text-[10px] font-bold text-green uppercase tracking-[2px] text-center mb-2">Tarifs</p>
          <h2 className="text-2xl font-extrabold text-green-dark text-center mb-2 tracking-tight">
            Choisissez votre visibilité
          </h2>
          <p className="text-[13px] text-muted text-center mb-7">Sans engagement. Résiliable à tout moment.</p>

          {/* Countdown timer */}
          <CountdownTimer />

          {/* 2 pricing cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

            {/* Plan Standard */}
            <div className="bg-white rounded-2xl p-7 border-[1.5px] border-border">
              <p className="text-[10px] font-bold text-muted uppercase tracking-[1.5px] mb-1">Standard</p>

              {/* Crossed-out price + promo */}
              <div className="flex items-baseline gap-2 mb-0.5">
                <span className="text-sm text-muted line-through">49 €/mois</span>
                <span className="text-[10px] font-bold bg-green/10 text-green px-1.5 py-0.5 rounded">
                  -51 %
                </span>
              </div>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-[42px] font-extrabold text-green-dark tracking-tight leading-none">24</span>
                <span className="text-lg font-bold text-green-dark mb-1">€</span>
                <span className="text-sm font-medium text-muted mb-2">/mois</span>
              </div>
              <p className="text-[11px] text-muted mb-6">Visibilité essentielle dans l&apos;annuaire</p>

              <ul className="space-y-3 mb-7">
                {[
                  "Profil dans l'annuaire local",
                  'Nom, spécialité, quartier',
                  'Lien de réservation direct',
                  'Badge Certifié & Vérifié',
                  'Profil complet (bio, avis, tarifs)',
                  'Lien vers votre site personnel',
                ].map((f) => (
                  <li key={f} className="flex gap-3 items-center text-[13px] text-ink">
                    <Check />
                    {f}
                  </li>
                ))}
                {[
                  "Affiché sur la page d'accueil",
                  'Présent dans les articles de blog',
                  'Position Premium (top liste)',
                ].map((f) => (
                  <li key={f} className="flex gap-3 items-center text-[13px] text-muted/60">
                    <Cross />
                    {f}
                  </li>
                ))}
              </ul>

              <InscriptionPlanCTA
                plan="standard"
                location="cards"
                href="/inscription/formulaire?plan=standard"
                className="block w-full py-3 rounded-xl font-bold text-[14px] bg-bg-alt text-green-dark border border-border hover:border-green hover:bg-surface transition-colors text-center"
              >
                Choisir le Standard
              </InscriptionPlanCTA>
            </div>

            {/* Plan Mise en avant */}
            <div className="relative bg-white rounded-2xl p-7 border-2 border-green shadow-lg">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green text-white text-[10px] font-extrabold px-4 py-1 rounded-[10px] whitespace-nowrap">
                ★ Recommandé
              </div>

              <p className="text-[10px] font-bold text-green uppercase tracking-[1.5px] mb-1">Mise en avant</p>

              {/* Crossed-out price + promo */}
              <div className="flex items-baseline gap-2 mb-0.5">
                <span className="text-sm text-muted line-through">99 €/mois</span>
                <span className="text-[10px] font-bold bg-green/10 text-green px-1.5 py-0.5 rounded">
                  -51 %
                </span>
              </div>
              <div className="flex items-end gap-1 mb-1">
                <span className="text-[42px] font-extrabold text-green-dark tracking-tight leading-none">49</span>
                <span className="text-lg font-bold text-green-dark mb-1">€</span>
                <span className="text-sm font-medium text-muted mb-2">/mois</span>
              </div>
              <p className="text-[11px] text-muted mb-6">Visibilité maximale sur tout le site</p>

              <ul className="space-y-3 mb-7">
                {[
                  "Profil dans l'annuaire local",
                  'Nom, spécialité, quartier',
                  'Lien de réservation direct',
                  'Badge Certifié & Vérifié',
                  'Profil complet (bio, avis, tarifs)',
                  'Lien vers votre site personnel',
                  "Affiché sur la page d'accueil",
                  'Présent dans les articles de blog',
                  'Position Premium (top liste)',
                ].map((f) => (
                  <li key={f} className="flex gap-3 items-center text-[13px] text-ink">
                    <Check />
                    {f}
                  </li>
                ))}
              </ul>

              <InscriptionPlanCTA
                plan="premium"
                location="cards"
                href="/inscription/formulaire?plan=premium"
                className="block w-full py-3 rounded-xl font-bold text-[14px] bg-green text-white hover:bg-[#4faa73] transition-colors text-center"
              >
                Choisir la Mise en avant
              </InscriptionPlanCTA>
            </div>
          </div>

          <p className="text-center text-[11px] text-muted mt-5">
            Sans engagement · Annulable à tout moment · Paiement sécurisé
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-bg-alt py-[52px] px-4 md:px-10">
        <div className="max-w-[860px] mx-auto">
          <p className="text-[10px] font-bold text-green uppercase tracking-[2px] text-center mb-2">Comment ça marche</p>
          <h2 className="text-2xl font-extrabold text-green-dark text-center mb-8 tracking-tight">
            En ligne en moins de 10 minutes
          </h2>
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
            ['Puis-je annuler à tout moment ?', 'Oui, sans frais ni préavis. Votre profil est retiré dans les 24h suivant votre résiliation.'],
            ['Comment est vérifiée ma certification ?', "Nous vous demandons de nous envoyer votre diplôme RNCP. Notre équipe valide sous 24h ouvrées."],
            ["Quelle est la différence entre Standard et Mise en avant ?", `La Mise en avant vous affiche sur la page d'accueil et dans les articles de blog. Si plus de 3 praticiens sont en Mise en avant, les profils tournent aléatoirement sur ces emplacements.`],
            ["Jusqu'à quand dure le tarif promotionnel ?", "Le tarif de lancement est valable jusqu'au 1er juillet 2026. Passé cette date, les prix reviendront à leur tarif standard."],
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
        <h2 className="text-[26px] font-extrabold text-white mb-2.5">Prêt à remplir votre agenda ?</h2>
        <p className="text-[13px] text-white/70 mb-6">
          Rejoignez les praticiens déjà référencés sur {siteConfig.domain}
        </p>
        <div className="flex justify-center gap-4">
          <InscriptionPlanCTA plan="standard" location="bottom_cta" href="/inscription/formulaire?plan=standard" className="inline-block bg-white/15 text-white font-bold text-sm px-7 py-3.5 rounded-lg hover:bg-white/25 transition-colors border border-white/30">
            Standard — 24 €/mois
          </InscriptionPlanCTA>
          <InscriptionPlanCTA plan="premium" location="bottom_cta" href="/inscription/formulaire?plan=premium" className="inline-block bg-green text-white font-bold text-sm px-7 py-3.5 rounded-lg hover:bg-[#4faa73] transition-colors">
            Mise en avant — 49 €/mois ★
          </InscriptionPlanCTA>
        </div>
      </section>
    </>
  )
}
