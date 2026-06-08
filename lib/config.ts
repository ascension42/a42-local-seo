export const siteConfig = {
  city:            process.env.NEXT_PUBLIC_CITY             ?? 'bordeaux',
  cityLabel:       process.env.NEXT_PUBLIC_CITY_LABEL       ?? 'Bordeaux',
  specialty:       process.env.NEXT_PUBLIC_SPECIALTY        ?? 'sophrologue',
  specialtyLabel:  process.env.NEXT_PUBLIC_SPECIALTY_LABEL  ?? 'Sophrologue',
  specialtyPlural: process.env.NEXT_PUBLIC_SPECIALTY_LABEL_PLURAL ?? 'Sophrologues',
  domain:          process.env.NEXT_PUBLIC_SITE_DOMAIN      ?? 'sophrologue-bordeaux.fr',
  siteName:        process.env.NEXT_PUBLIC_SITE_NAME        ?? 'Sophrologue Bordeaux',
  heroImageUrl:    process.env.NEXT_PUBLIC_HERO_IMAGE_URL   ?? null,
} as const
