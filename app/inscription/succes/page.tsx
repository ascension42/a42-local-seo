import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Inscription confirmée — Bienvenue !',
}

export default function InscriptionSuccesPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-[520px]">
        <div className="w-20 h-20 rounded-full bg-green flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green/25">
          <svg viewBox="0 0 32 32" width="36" fill="none">
            <path d="M6 16l7 7 13-13" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <p className="text-[10px] font-bold text-green uppercase tracking-[2px] mb-3">
          Paiement confirmé
        </p>
        <h1 className="text-[28px] font-extrabold text-green-dark tracking-tight mb-3">
          Bienvenue dans le réseau !
        </h1>
        <p className="text-[13px] text-muted leading-[1.75] mb-6">
          Votre abonnement est actif. Notre équipe publie votre profil sous
          <strong className="text-green-dark"> 24h ouvrées</strong> après vérification
          de votre certification.
        </p>

        <div className="bg-surface border border-green rounded-2xl p-6 text-left space-y-3 mb-8">
          {[
            ['Votre profil publié', 'Visible sur Google et dans l\'annuaire'],
            ['Badge "Certifié vérifié"', 'Affiché sur votre fiche praticien'],
            ['Lien de réservation direct', 'Patients → votre Doctolib ou Cal.com'],
            ['Premier mois offert', 'Offre de lancement — aucun débit immédiat'],
          ].map(([title, desc]) => (
            <div key={String(title)} className="flex gap-3 items-start">
              <span className="w-5 h-5 rounded-full bg-green flex items-center justify-center shrink-0 mt-0.5">
                <svg viewBox="0 0 10 8" width="10" fill="none">
                  <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div>
                <p className="text-[12px] font-bold text-green-dark">{title}</p>
                <p className="text-[11px] text-muted">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <Link
          href="/"
          className="inline-block bg-green text-white font-bold text-sm px-8 py-3.5 rounded-xl hover:bg-[#4faa73] transition-colors"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  )
}
