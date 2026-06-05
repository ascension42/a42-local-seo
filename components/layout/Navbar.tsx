'use client'
import Link from 'next/link'
import { siteConfig } from '@/lib/config'
import { useState } from 'react'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <nav className="bg-green-deep sticky top-0 z-50 h-[58px] flex items-center justify-between px-5 md:px-10">
        <Link href="/" className="text-white font-extrabold text-[15px] tracking-tight no-underline">
          {siteConfig.specialty}<span className="text-green-light">{siteConfig.cityLabel.toLowerCase()}</span>.fr
        </Link>
        {/* Desktop */}
        <div className="hidden md:flex gap-7 items-center">
          <Link href="/praticiens" className="text-white/75 text-xs font-medium hover:text-white transition-colors">Trouver un praticien</Link>
          <Link href="/blog" className="text-white/75 text-xs font-medium hover:text-white transition-colors">Blog</Link>
          <Link href="/faq" className="text-white/75 text-xs font-medium hover:text-white transition-colors">FAQ</Link>
          <Link href="/inscription" className="bg-green text-white text-xs font-semibold px-4 py-[7px] rounded-[5px] hover:bg-[#4faa73] transition-colors">Inscrire mon cabinet</Link>
        </div>
        {/* Hamburger */}
        <button className="md:hidden relative w-6 h-5 flex flex-col justify-between" onClick={() => setOpen(o => !o)} aria-label="Menu">
          <span className={`block h-[2px] w-full bg-white rounded transition-all origin-center ${open ? 'rotate-45 translate-y-[9px]' : ''}`} />
          <span className={`block h-[2px] w-full bg-white rounded transition-all ${open ? 'opacity-0' : ''}`} />
          <span className={`block h-[2px] w-full bg-white rounded transition-all origin-center ${open ? '-rotate-45 -translate-y-[9px]' : ''}`} />
        </button>
      </nav>
      {/* Mobile overlay */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40 bg-green-deep flex flex-col items-center justify-center gap-8 pt-[58px]">
          {[{href:'/praticiens',label:'Trouver un praticien'},{href:'/blog',label:'Blog'},{href:'/faq',label:'FAQ'}].map(({href,label})=>(
            <Link key={href} href={href} className="text-white text-xl font-bold" onClick={() => setOpen(false)}>{label}</Link>
          ))}
          <Link href="/inscription" className="mt-2 bg-green text-white font-bold text-base px-8 py-3.5 rounded-lg" onClick={() => setOpen(false)}>
            Inscrire mon cabinet →
          </Link>
        </div>
      )}
    </>
  )
}
