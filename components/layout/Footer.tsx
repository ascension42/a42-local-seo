import Link from 'next/link'
import { siteConfig } from '@/lib/config'

export default function Footer() {
  return (
    <footer className="bg-green-deep text-white/65 px-10 py-7 flex justify-between items-center">
      <div>
        <Link href="/" className="text-white font-extrabold text-sm no-underline">
          {siteConfig.specialty}
          <span className="text-green-light">{siteConfig.cityLabel.toLowerCase()}</span>
          .fr
        </Link>
        <p className="text-xs mt-1.5">Annuaire indépendant — {siteConfig.cityLabel} &amp; région</p>
      </div>
      <nav className="flex gap-5">
        <Link href="/praticiens" className="text-white/55 text-xs hover:text-white transition-colors">Tous les praticiens</Link>
        <Link href="/blog" className="text-white/55 text-xs hover:text-white transition-colors">Blog</Link>
        <Link href="/inscription" className="text-white/55 text-xs hover:text-white transition-colors">Inscrire mon cabinet</Link>
      </nav>
    </footer>
  )
}
