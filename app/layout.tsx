import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Fraunces } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { siteConfig } from '@/lib/config'
import { Analytics } from '@vercel/analytics/react'
import PostHogProvider from '@/components/analytics/PostHogProvider'

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

const siteUrl = `https://${siteConfig.domain}`
const sp = siteConfig.specialtyLabel.toLowerCase()
const city = siteConfig.cityLabel

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.specialtyLabel} ${city} — Annuaire certifié RNCP`,
    template: `%s | ${siteConfig.siteName}`,
  },
  description: `Trouvez un ${sp} certifié RNCP à ${city}. Praticiens vérifiés, consultations en cabinet ou en ligne. Prise de rendez-vous directe, sans ordonnance.`,
  keywords: [
    `${sp} ${city}`,
    sp,
    `trouver un ${sp} ${city}`,
    `annuaire ${sp} ${city}`,
    `${sp} certifié ${city}`,
    `séance sophrologie ${city}`,
    `sophrologie stress ${city}`,
    `sophrologie sommeil ${city}`,
    `sophrologie anxiété ${city}`,
    `sophrologie en ligne ${city}`,
    `cabinet sophrologie ${city}`,
    city,
  ],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: siteUrl,
    siteName: siteConfig.siteName,
    title: `${siteConfig.specialtyLabel} ${city} — Annuaire certifié RNCP`,
    description: `Annuaire des ${sp}s certifiés RNCP à ${city}. Praticiens vérifiés, disponibles en cabinet ou en ligne.`,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.specialtyLabel} ${city} — Annuaire certifié`,
    description: `Trouvez votre ${sp} certifié RNCP à ${city}. Praticiens vérifiés.`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: '/favicon.ico',
  },
}

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${siteUrl}/#organization`,
  name: siteConfig.siteName,
  url: siteUrl,
  description: `Annuaire certifié de ${sp}s à ${city}. Praticiens vérifiés RNCP, consultations en cabinet ou en ligne.`,
  areaServed: { '@type': 'City', name: city },
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${siteUrl}/#website`,
  name: siteConfig.siteName,
  url: siteUrl,
  inLanguage: 'fr-FR',
  publisher: { '@id': `${siteUrl}/#organization` },
  potentialAction: {
    '@type': 'SearchAction',
    target: { '@type': 'EntryPoint', urlTemplate: `${siteUrl}/praticiens?tag={search_term_string}` },
    'query-input': 'required name=search_term_string',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${jakarta.variable} ${fraunces.variable}`} suppressHydrationWarning>
      <body className="bg-bg text-ink font-sans antialiased flex flex-col min-h-screen">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
        <PostHogProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </PostHogProvider>
        <Analytics />
      </body>
    </html>
  )
}
