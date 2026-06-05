/**
 * Seed script for Pézenas — inserts test practitioners and blog covers.
 *
 * Storage convention (conflict-free):
 *   media/{specialty_slug}/{city_slug}/practitioners/{practitioner_uuid}.{ext}
 *   media/{specialty_slug}/{city_slug}/blog/{post_uuid}.{ext}
 *
 * Flow for practitioners:
 *   1. Upsert row (no photo yet) → get UUID from DB
 *   2. Upload image to path containing that UUID
 *   3. Update photo_url with the final storage URL
 *
 * Usage:
 *   npx tsx scripts/seed-pezenas.ts
 * (reads NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY from env or .env.local)
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing env: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)
const BUCKET   = 'media'

function publicUrl(path: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`
}

async function uploadFromUrl(storagePath: string, sourceUrl: string): Promise<string> {
  const res = await fetch(sourceUrl)
  if (!res.ok) throw new Error(`Cannot download ${sourceUrl}: HTTP ${res.status}`)
  const buf = Buffer.from(await res.arrayBuffer())

  const { error } = await supabase.storage.from(BUCKET).upload(storagePath, buf, {
    contentType: 'image/jpeg',
    upsert: true,
  })
  if (error) throw new Error(`Storage upload to ${storagePath}: ${error.message}`)
  return publicUrl(storagePath)
}

// ── Practitioner image sources (Unsplash CDN) ────────────────────────────────
const PRACTITIONER_IMGS: Record<string, string> = {
  'marie-durand-pezenas':   'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&q=80',
  'jean-moreau-pezenas':    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80',
  'sophie-blanc-pezenas':   'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&q=80',
  'nathalie-simon-pezenas': 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&q=80',
}

// ── Blog cover sources ────────────────────────────────────────────────────────
// Keyed by the actual blog post slug in the DB.
const BLOG_COVER_IMGS: Record<string, string> = {
  'choisir-sophrologue-pezenas':        'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&q=80',
  'tarifs-sophrologie-pezenas':         'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&q=80',
  'burnout-quand-consulter-sophrologue': 'https://images.unsplash.com/photo-1541199249251-f713e6145474?w=1200&q=80',
}

async function main() {
  console.log('\n🌱 Seed Pézenas\n')

  // ── 1. Fetch city + specialty IDs ──────────────────────────────────────────
  const [{ data: city }, { data: specialty }] = await Promise.all([
    supabase.from('cities').select('id, slug').eq('slug', 'pezenas').single(),
    supabase.from('specialties').select('id, slug').eq('slug', 'sophrologue').single(),
  ])
  if (!city || !specialty) {
    console.error('❌  City or specialty not found in DB')
    process.exit(1)
  }
  console.log(`✓  city: ${city.slug} (${city.id})`)
  console.log(`✓  specialty: ${specialty.slug} (${specialty.id})`)

  const citySlug      = city.slug      as string
  const specialtySlug = specialty.slug as string

  // ── 2. Upsert practitioners (without photo first) ─────────────────────────
  console.log('\n👩‍⚕️  Upserting practitioners...')

  const practitioners = [
    {
      slug: 'marie-durand-pezenas',
      first_name: 'Marie', last_name: 'Durand',
      city_id: city.id, specialty_id: specialty.id,
      bio: 'Sophrologue certifiée RNCP depuis 8 ans, spécialisée dans la gestion du stress et l\'accompagnement des adultes en burn-out. Je propose des séances individuelles et des ateliers en groupe à Pézenas.',
      certification: 'Sophrologue RNCP', school: 'Institut de Sophrologie de Montpellier',
      years_active: 8, hourly_rate: 65, consultation_mode: 'both',
      neighborhood: 'Centre-ville', is_premium: true, is_verified: true, accepting_patients: true,
      lat: 43.4618, lng: 3.4231,
    },
    {
      slug: 'jean-moreau-pezenas',
      first_name: 'Jean', last_name: 'Moreau',
      city_id: city.id, specialty_id: specialty.id,
      bio: 'Sophrologue spécialisé dans la préparation sportive et la performance. J\'accompagne également les enfants dès 6 ans pour la confiance en soi et la gestion des émotions.',
      certification: 'Sophrologue RNCP', school: 'École Supérieure de Sophrologie',
      years_active: 5, hourly_rate: 55, consultation_mode: 'cabinet',
      neighborhood: 'Saint-Jean', is_premium: false, is_verified: true, accepting_patients: true,
      lat: 43.4625, lng: 3.4245,
    },
    {
      slug: 'sophie-blanc-pezenas',
      first_name: 'Sophie', last_name: 'Blanc',
      city_id: city.id, specialty_id: specialty.id,
      bio: 'Sophrologue et coach certifiée, j\'aide les femmes à retrouver confiance et équilibre. Spécialiste de l\'accompagnement périnatal et de la ménopause.',
      certification: 'Sophrologue RNCP', school: 'ISRP Paris',
      years_active: 12, hourly_rate: 70, consultation_mode: 'both',
      neighborhood: 'Vieille ville', is_premium: true, is_verified: true, accepting_patients: true,
      lat: 43.4612, lng: 3.4220,
    },
    {
      slug: 'nathalie-simon-pezenas',
      first_name: 'Nathalie', last_name: 'Simon',
      city_id: city.id, specialty_id: specialty.id,
      bio: 'Formée à la sophrologie caycédienne, j\'accompagne les personnes souffrant de troubles du sommeil, d\'anxiété et de phobies. Séances en ligne disponibles partout en France.',
      certification: 'Sophrologue Caycédienne', school: 'Sofrocay',
      years_active: 6, hourly_rate: 60, consultation_mode: 'online',
      neighborhood: 'Les Berges', is_premium: false, is_verified: true, accepting_patients: false,
      lat: 43.4630, lng: 3.4215,
    },
  ]

  const insertedPractitioners: Array<{ id: string; slug: string }> = []

  for (const p of practitioners) {
    const { data, error } = await supabase
      .from('practitioners')
      .upsert(p, { onConflict: 'slug' })
      .select('id, slug')
      .single()

    if (error) { console.error(`  ❌  ${p.slug}: ${error.message}`); continue }
    insertedPractitioners.push(data)
    console.log(`  ✓  ${p.first_name} ${p.last_name} → id: ${data.id}`)

    // Tags
    const tagsMap: Record<string, string[]> = {
      'marie-durand-pezenas':   ['Stress & anxiété', 'Burn-out', 'Gestion des émotions', 'Sommeil'],
      'jean-moreau-pezenas':    ['Sport & performance', 'Confiance en soi', 'Enfants & ados'],
      'sophie-blanc-pezenas':   ['Maternité & périnatal', 'Confiance en soi', 'Bien-être féminin'],
      'nathalie-simon-pezenas': ['Troubles du sommeil', 'Stress & anxiété', 'Phobies'],
    }
    const tags = tagsMap[p.slug] ?? []
    if (tags.length) {
      await supabase.from('practitioner_tags').delete().eq('practitioner_id', data.id)
      await supabase.from('practitioner_tags').insert(tags.map(label => ({ practitioner_id: data.id, label })))
    }
  }

  // ── 3. Upload practitioner photos (now that we have UUIDs) ────────────────
  console.log('\n📸  Uploading practitioner photos...')

  for (const { id, slug } of insertedPractitioners) {
    const sourceUrl = PRACTITIONER_IMGS[slug]
    if (!sourceUrl) { console.log(`  ⚠  no image source for ${slug}`); continue }

    // Convention: {specialty_slug}/{city_slug}/practitioners/{uuid}.jpg
    const storagePath = `${specialtySlug}/${citySlug}/practitioners/${id}.jpg`

    try {
      const finalUrl = await uploadFromUrl(storagePath, sourceUrl)
      await supabase.from('practitioners').update({ photo_url: finalUrl }).eq('id', id)
      console.log(`  ✓  ${slug} → ${storagePath}`)
    } catch (err) {
      console.error(`  ❌  ${slug}: ${(err as Error).message}`)
    }
  }

  // ── 4. Blog covers — upload to storage + update DB ────────────────────────
  console.log('\n📝  Uploading blog covers...')

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, slug')
    .in('slug', Object.keys(BLOG_COVER_IMGS))

  for (const post of posts ?? []) {
    const sourceUrl = BLOG_COVER_IMGS[post.slug]
    if (!sourceUrl) continue

    // Convention: {specialty_slug}/{city_slug}/blog/{uuid}.jpg
    const storagePath = `${specialtySlug}/${citySlug}/blog/${post.id}.jpg`

    try {
      const finalUrl = await uploadFromUrl(storagePath, sourceUrl)
      await supabase.from('blog_posts').update({ cover_url: finalUrl }).eq('id', post.id)
      console.log(`  ✓  ${post.slug} → ${storagePath}`)
    } catch (err) {
      console.error(`  ❌  ${post.slug}: ${(err as Error).message}`)
    }
  }

  console.log('\n✅  Seed complete!\n')
}

main().catch(e => { console.error('\n❌', e.message); process.exit(1) })
