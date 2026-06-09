const _city      = process.env.NEXT_PUBLIC_CITY      ?? 'bordeaux'
const _specialty = process.env.NEXT_PUBLIC_SPECIALTY ?? 'sophrologue'
const _supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''

export const siteConfig = {
  city:            _city,
  cityLabel:       process.env.NEXT_PUBLIC_CITY_LABEL             ?? 'Bordeaux',
  specialty:       _specialty,
  specialtyLabel:  process.env.NEXT_PUBLIC_SPECIALTY_LABEL        ?? 'Sophrologue',
  specialtyPlural: process.env.NEXT_PUBLIC_SPECIALTY_LABEL_PLURAL ?? 'Sophrologues',
  domain:          process.env.NEXT_PUBLIC_SITE_DOMAIN            ?? 'sophrologue-bordeaux.fr',
  siteName:        process.env.NEXT_PUBLIC_SITE_NAME              ?? 'Sophrologue Bordeaux',
  heroImageUrl:    process.env.NEXT_PUBLIC_HERO_IMAGE_URL
    ?? (_supabaseUrl
      ? `${_supabaseUrl}/storage/v1/object/public/media/${_specialty}/${_city}/hero/hero.jpg`
      : null),
} as const
