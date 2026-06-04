import Link from 'next/link'
import { siteConfig } from '@/lib/config'

export default function Navbar() {
  return (
    <nav className="bg-green-deep sticky top-0 z-50 h-[58px] flex items-center justify-between px-10">
      <Link href="/" className="text-white font-extrabold text-[15px] tracking-tight no-underline">
        {siteConfig.specialty}
        <span className="text-green-light">{siteConfig.cityLabel.toLowerCase()}</span>
        .fr
      </Link>
      <div className="flex gap-7 items-center">
        <Link href="/praticiens" className="text-white/75 text-xs font-medium hover:text-white transition-colors">
          Trouver un praticien
        </Link>
        <Link href="/blog" className="text-white/75 text-xs font-medium hover:text-white transition-colors">
          Blog
        </Link>
        <Link href="/faq" className="text-white/75 text-xs font-medium hover:text-white transition-colors">
          FAQ
        </Link>
        <Link
          href="/inscription"
          className="bg-green text-white text-xs font-semibold px-4 py-[7px] rounded-[5px] hover:bg-[#4faa73] transition-colors"
        >
          Inscrire mon cabinet
        </Link>
      </div>
    </nav>
  )
}
