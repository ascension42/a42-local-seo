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

      <div className="flex flex-col items-end gap-2">
        <p className="text-[11px] text-white/50">Powered by</p>
        <a href="https://ascension42.fr" target="_blank" rel="noopener noreferrer">
          <Image
            src="/logo-blanc.png"
            alt="Ascension 42"
            width={120}
            height={52}
            className="opacity-80 hover:opacity-100 transition-opacity"
          />
        </a>
      </div>
    </footer>
  )
}
