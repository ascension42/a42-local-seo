import Link from 'next/link'
import Image from 'next/image'
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

      <a
        href="https://ascension42.fr"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 hover:opacity-100 transition-opacity opacity-90"
      >
        <span className="text-[11px] text-white/60">Powered by</span>
        <Image
          src="/logo-blanc.png"
          alt="Ascension 42"
          width={80}
          height={34}
        />
      </a>
    </footer>
  )
}
