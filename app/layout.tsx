import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Fraunces } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { siteConfig } from '@/lib/config'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  weight: ['700'],
})

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.specialtyPlural} à ${siteConfig.cityLabel} — Trouvez votre praticien`,
    template: `%s | ${siteConfig.siteName}`,
  },
  description: `Annuaire des ${siteConfig.specialtyLabel.toLowerCase()}s certifiés à ${siteConfig.cityLabel}. Consultations en cabinet ou en ligne.`,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${jakarta.variable} ${fraunces.variable}`} suppressHydrationWarning>
      <body className="bg-bg text-ink font-sans antialiased flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
