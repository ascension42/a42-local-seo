/**
 * Seed script for Pézenas — uploads images to Supabase Storage,
 * inserts 4 test practitioners and updates blog post covers.
 *
 * Usage:
 *   NEXT_PUBLIC_SUPABASE_URL=https://... SUPABASE_SERVICE_ROLE_KEY=eyJ... npx tsx scripts/seed-pezenas.ts
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('❌  NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY requis')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)

// ── Images source (Unsplash, format crop carré pour praticiens, paysage pour blog) ──
const PRACTITIONER_IMGS = [
  { file: 'marie-durand.jpg',   url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&q=80' },
  { file: 'jean-moreau.jpg',    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80' },
  { file: 'sophie-blanc.jpg',   url: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&q=80' },
  { file: 'nathalie-simon.jpg', url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&q=80' },
]

const BLOG_IMGS = [
  { file: 'choisir-sophrologue.jpg', url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=450&fit=crop&q=80' },
  { file: 'burnout-sophrologue.jpg', url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=450&fit=crop&q=80' },
  { file: 'cout-sophrologie.jpg',    url: 'https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=800&h=450&fit=crop&q=80' },
]

async function uploadImage(path: string, sourceUrl: string): Promise<string> {
  const res = await fetch(sourceUrl)
  if (!res.ok) throw new Error(`Impossible de télécharger ${sourceUrl}`)
  const buf = Buffer.from(await res.arrayBuffer())

  const { error } = await supabase.storage.from('media').upload(path, buf, {
    contentType: 'image/jpeg',
    upsert: true,
  })
  if (error) throw new Error(`Upload ${path}: ${error.message}`)

  const { data } = supabase.storage.from('media').getPublicUrl(path)
  return data.publicUrl
}

async function main() {
  console.log('\n🌱 Seed Pézenas\n')

  // ── 1. Récupérer les IDs ville/spécialité ────────────────────────────────────
  const [{ data: city }, { data: specialty }] = await Promise.all([
    supabase.from('cities').select('id').eq('slug', 'pezenas').single(),
    supabase.from('specialties').select('id').eq('slug', 'sophrologue').single(),
  ])
  if (!city || !specialty) { console.error('❌  Ville ou spécialité introuvable'); process.exit(1) }
  console.log('✓ IDs récupérés — ville:', city.id, '/ spécialité:', specialty.id)

  // ── 2. Upload images praticiens ──────────────────────────────────────────────
  console.log('\n📸 Upload images praticiens...')
  const practitionerUrls: Record<string, string> = {}
  for (const img of PRACTITIONER_IMGS) {
    const url = await uploadImage(`practitioners/${img.file}`, img.url)
    practitionerUrls[img.file] = url
    console.log('  ✓', img.file)
  }

  // ── 3. Upload images blog ────────────────────────────────────────────────────
  console.log('\n📸 Upload images blog...')
  const blogUrls: Record<string, string> = {}
  for (const img of BLOG_IMGS) {
    const url = await uploadImage(`blog/${img.file}`, img.url)
    blogUrls[img.file] = url
    console.log('  ✓', img.file)
  }

  // ── 4. Insérer les praticiens ────────────────────────────────────────────────
  console.log('\n👩‍⚕️ Insertion des praticiens...')

  const practitioners = [
    {
      slug: 'marie-durand-pezenas',
      first_name: 'Marie', last_name: 'Durand',
      city_id: city.id, specialty_id: specialty.id,
      photo_url: practitionerUrls['marie-durand.jpg'],
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
      photo_url: practitionerUrls['jean-moreau.jpg'],
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
      photo_url: practitionerUrls['sophie-blanc.jpg'],
      bio: 'Sophrologue et coach certifiée, j\'aide les femmes à retrouver confiance et équilibre. Spécialiste de l\'accompagnement périnatal (grossesse, accouchement, post-partum) et de la ménopause.',
      certification: 'Sophrologue RNCP', school: 'ISRP Paris',
      years_active: 12, hourly_rate: 70, consultation_mode: 'both',
      neighborhood: 'Vieille ville', is_premium: true, is_verified: true, accepting_patients: true,
      lat: 43.4612, lng: 3.4220,
    },
    {
      slug: 'nathalie-simon-pezenas',
      first_name: 'Nathalie', last_name: 'Simon',
      city_id: city.id, specialty_id: specialty.id,
      photo_url: practitionerUrls['nathalie-simon.jpg'],
      bio: 'Formée à la sophrologie caycédienne, j\'accompagne les personnes souffrant de troubles du sommeil, d\'anxiété et de phobies. Séances en ligne disponibles partout en France.',
      certification: 'Sophrologue Caycédienne', school: 'Sofrocay',
      years_active: 6, hourly_rate: 60, consultation_mode: 'online',
      neighborhood: 'Les Berges', is_premium: false, is_verified: true, accepting_patients: false,
      lat: 43.4630, lng: 3.4215,
    },
  ]

  for (const p of practitioners) {
    const { data: inserted, error } = await supabase
      .from('practitioners')
      .upsert(p, { onConflict: 'slug' })
      .select('id, slug')
      .single()

    if (error) { console.error('  ❌', p.slug, error.message); continue }
    console.log('  ✓', p.first_name, p.last_name, '→', inserted.id)

    // Tags
    const tagsMap: Record<string, string[]> = {
      'marie-durand-pezenas':   ['Stress & anxiété', 'Burn-out', 'Gestion des émotions', 'Sommeil'],
      'jean-moreau-pezenas':    ['Sport & performance', 'Confiance en soi', 'Enfants & ados'],
      'sophie-blanc-pezenas':   ['Maternité & périnatal', 'Confiance en soi', 'Bien-être féminin'],
      'nathalie-simon-pezenas': ['Troubles du sommeil', 'Stress & anxiété', 'Phobies'],
    }
    const tags = tagsMap[p.slug] ?? []
    if (tags.length) {
      await supabase.from('practitioner_tags').delete().eq('practitioner_id', inserted.id)
      await supabase.from('practitioner_tags').insert(
        tags.map(label => ({ practitioner_id: inserted.id, label }))
      )
    }
  }

  // ── 5. Mettre à jour les cover des articles Pézenas ──────────────────────────
  console.log('\n📝 Mise à jour des articles blog...')

  const blogCovers = [
    { slug: 'comment-choisir-son-sophrologue-a-pezenas-les-5-criteres-essentiels', cover: blogUrls['choisir-sophrologue.jpg'] },
    { slug: 'burn-out-quand-consulter-un-sophrologue-pezenas',                    cover: blogUrls['burnout-sophrologue.jpg'] },
    { slug: 'combien-coute-une-seance-de-sophrologie-a-pezenas',                 cover: blogUrls['cout-sophrologie.jpg'] },
  ]

  for (const { slug, cover } of blogCovers) {
    const { error } = await supabase.from('blog_posts').update({ cover_url: cover }).eq('slug', slug)
    if (error) {
      // Try partial match
      const { data } = await supabase.from('blog_posts').select('slug').ilike('slug', `%pezenas%`)
      console.log('  ⚠️  Slugs disponibles:', data?.map(r => r.slug))
    } else {
      console.log('  ✓', slug)
    }
  }

  console.log('\n✅  Seed terminé !\n')
}

main().catch(e => { console.error('\n❌', e.message); process.exit(1) })
