const _city      = process.env.NEXT_PUBLIC_CITY      ?? 'lumevale'
const _specialty = process.env.NEXT_PUBLIC_SPECIALTY ?? 'sophrologiste'
const _supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''

export const siteConfig = {
  city:            _city,
  cityLabel:       process.env.NEXT_PUBLIC_CITY_LABEL             ?? 'Lumévale',
  specialty:       _specialty,
  specialtyLabel:  process.env.NEXT_PUBLIC_SPECIALTY_LABEL        ?? 'Sophrologiste',
  specialtyPlural: process.env.NEXT_PUBLIC_SPECIALTY_LABEL_PLURAL ?? 'Sophrologistes',
  domain:          process.env.NEXT_PUBLIC_SITE_DOMAIN            ?? 'sophrologiste-lumevale.fr',
  siteName:        process.env.NEXT_PUBLIC_SITE_NAME              ?? 'Sophrologiste Lumévale',
  heroImageUrl:    process.env.NEXT_PUBLIC_HERO_IMAGE_URL
    ?? (_supabaseUrl
      ? `${_supabaseUrl}/storage/v1/object/public/media/${_specialty}/${_city}/hero/hero.jpg`
      : null),
} as const
