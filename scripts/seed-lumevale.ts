/**
 * Seed script for Lumévale (demo générique) — sophrologiste.
 *
 * Crée / met à jour :
 *   - La ville fictive Lumévale dans `cities`
 *   - La spécialité "sophrologiste" dans `specialties`
 *   - 4 praticiens avec tags et témoignages
 *   - 3 articles de blog avec couvertures
 *   - Photos Unsplash uploadées en storage Supabase
 *
 * Usage :
 *   npx tsx --env-file=.env.local scripts/seed-lumevale.ts
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

// ── Photos praticiens (Unsplash) ────────────────────────────────────────────
const PRACTITIONER_IMGS: Record<string, string> = {
  'claire-valmont-lumevale': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&q=80',
  'marc-aurel-lumevale':     'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&q=80',
  'elise-bertrand-lumevale': 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&q=80',
  'david-leroux-lumevale':   'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&q=80',
}

// ── Couvertures blog (Unsplash) ─────────────────────────────────────────────
const BLOG_COVER_IMGS: Record<string, string> = {
  'choisir-sophrologiste-lumevale':     'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=1200&q=80',
  'tarifs-sophrologiste-lumevale':      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&q=80',
  'stress-burnout-sophrologiste':       'https://images.unsplash.com/photo-1541199249251-f713e6145474?w=1200&q=80',
}

async function main() {
  console.log('\n🌱  Seed Lumévale (démo générique)\n')

  // ── 1. Upsert ville fictive ─────────────────────────────────────────────────
  console.log('🏙  Upsert ville Lumévale...')
  const { data: city, error: cityErr } = await supabase
    .from('cities')
    .upsert({
      slug:    'lumevale',
      name:    'Lumévale',
      region:  'Vercordane',
      country: 'France',
      lat:     44.1234,
      lng:     3.4567,
    }, { onConflict: 'slug' })
    .select('id, slug')
    .single()

  if (cityErr || !city) {
    console.error('❌  Upsert ville:', cityErr?.message)
    process.exit(1)
  }
  console.log(`  ✓  ${city.slug} → id: ${city.id}`)

  // ── 2. Upsert spécialité ────────────────────────────────────────────────────
  console.log('\n🔖  Upsert spécialité sophrologiste...')
  const { data: specialty, error: specErr } = await supabase
    .from('specialties')
    .upsert({
      slug:        'sophrologiste',
      name:        'Sophrologiste',
      description: 'Praticien en sophrologie — accompagnement bien-être, gestion du stress, développement personnel.',
    }, { onConflict: 'slug' })
    .select('id, slug')
    .single()

  if (specErr || !specialty) {
    console.error('❌  Upsert spécialité:', specErr?.message)
    process.exit(1)
  }
  console.log(`  ✓  ${specialty.slug} → id: ${specialty.id}`)

  const citySlug      = city.slug      as string
  const specialtySlug = specialty.slug as string

  // ── 3. Blog posts ────────────────────────────────────────────────────────────
  console.log('\n📝  Upsert articles de blog...')

  const blogPosts = [
    {
      slug: 'choisir-sophrologiste-lumevale',
      title: 'Comment choisir son sophrologiste à Lumévale : 5 critères clés',
      excerpt: "Certification, spécialités, tarifs, téléconsultation… Tout ce qu'il faut savoir avant de prendre rendez-vous avec un sophrologiste à Lumévale.",
      content: `# Comment choisir son sophrologiste à Lumévale

La sophrologie n'est pas réglementée en France : n'importe qui peut théoriquement se déclarer "sophrologiste". C'est pourquoi la certification est le premier critère à vérifier.

## 1. La certification reconnue

Privilégiez un praticien titulaire d'une certification reconnue. Les écoles sérieuses forment sur au moins un an. Tous les praticiens de notre annuaire à Lumévale sont vérifiés avant d'être publiés.

## 2. La spécialité

Gestion du stress, troubles du sommeil, préparation à l'accouchement, accompagnement des enfants, burn-out… La sophrologie couvre de nombreuses problématiques. Vérifiez que le praticien a une expérience dans votre domaine.

## 3. Le mode de consultation

En cabinet, en ligne ou les deux ? À Lumévale, plusieurs sophrologistes proposent désormais des séances en visioconférence, aussi efficaces qu'en présentiel et bien plus flexibles.

## 4. Le tarif

Le tarif moyen d'une séance de sophrologie à Lumévale se situe entre 55 et 85 €. Méfiez-vous des prix trop bas, souvent synonymes d'une faible expérience.

## 5. Le feeling

La relation thérapeutique est essentielle. N'hésitez pas à prendre une première séance d'essai avant de vous engager sur un suivi.`,
      city_id: city.id,
      specialty_id: specialty.id,
      reading_time_min: 4,
      published_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      slug: 'tarifs-sophrologiste-lumevale',
      title: 'Tarifs d\'un sophrologiste à Lumévale — Ce qu\'on paye vraiment',
      excerpt: "Entre 55 et 85 € la séance, remboursement mutuelle, forfaits multi-séances… Le point complet sur le coût d'un suivi en sophrologie à Lumévale.",
      content: `# Tarifs d'un sophrologiste à Lumévale

## Combien coûte une séance ?

À Lumévale, le tarif d'une séance individuelle de sophrologie varie en général entre 55 et 85 € pour 45 à 60 minutes. Les praticiens les plus expérimentés (10 ans et plus) peuvent pratiquer jusqu'à 90 €.

Les séances en ligne sont souvent proposées 5 à 10 € moins cher qu'en cabinet.

## Remboursement mutuelle

La sophrologie n'est pas remboursée par la Sécurité Sociale. Mais de nombreuses mutuelles (Harmonie Mutuelle, MGEN, Alan, Groupama…) proposent un forfait annuel médecines douces, généralement entre 50 € et 200 € par an.

Vérifiez votre contrat ou appelez votre mutuelle avant votre première séance.

## Forfaits multi-séances

Certains praticiens de Lumévale proposent des forfaits : 5 séances pour le prix de 4, ou un abonnement mensuel. C'est une bonne option si vous savez que vous allez vous engager sur la durée.

## Combien de séances prévoir ?

Un suivi standard comprend 6 à 10 séances hebdomadaires. Budget à prévoir : entre 400 et 800 € sur 2 à 3 mois.`,
      city_id: city.id,
      specialty_id: specialty.id,
      reading_time_min: 3,
      published_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      slug: 'stress-burnout-sophrologiste',
      title: 'Stress, burn-out : quand consulter un sophrologiste ?',
      excerpt: "Fatigue chronique, perte de sens, crises d'angoisse… La sophrologie peut aider. Voici les signaux qui indiquent qu'il est temps de consulter.",
      content: `# Stress et burn-out : quand consulter un sophrologiste ?

## Les signaux d'alarme

- Fatigue persistante malgré le repos
- Difficulté à déconnecter du travail
- Troubles du sommeil (difficultés d'endormissement, réveils nocturnes)
- Irritabilité, hypersensibilité
- Perte de motivation ou de sens
- Crises d'angoisse, palpitations

Si vous vous reconnaissez dans plusieurs de ces symptômes, un suivi en sophrologie peut être bénéfique.

## Ce que fait le sophrologiste

Le sophrologiste ne diagnostique pas et ne prescrit pas. Il vous accompagne avec des outils concrets : respiration consciente, décontraction musculaire progressive, visualisation positive. L'objectif : vous donner des clés autonomes pour réguler votre stress au quotidien.

## En combien de séances ?

Pour un burn-out ou un stress chronique, comptez 8 à 12 séances. Les premiers effets se ressentent souvent dès la 3ème ou 4ème séance : meilleur sommeil, plus de recul face aux situations stressantes.

## En parallèle du médecin

La sophrologie est complémentaire de la médecine. En cas de burn-out avéré, elle s'articule idéalement avec un suivi médical ou psychologique.`,
      city_id: city.id,
      specialty_id: specialty.id,
      reading_time_min: 5,
      published_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  for (const post of blogPosts) {
    const { error } = await supabase.from('blog_posts').upsert(post, { onConflict: 'slug' })
    if (error) console.error(`  ❌  ${post.slug}: ${error.message}`)
    else console.log(`  ✓  ${post.slug}`)
  }

  // ── 4. Praticiens ────────────────────────────────────────────────────────────
  console.log('\n👩‍⚕️  Upsert praticiens...')

  const practitioners = [
    {
      slug: 'claire-valmont-lumevale',
      first_name: 'Claire', last_name: 'Valmont',
      city_id: city.id, specialty_id: specialty.id,
      bio: "Sophrologiste certifiée depuis 9 ans, je me suis spécialisée dans la gestion du stress professionnel et l'accompagnement des personnes en burn-out. Après 15 ans dans le secteur bancaire, j'ai fait le choix de me reconvertir dans l'accompagnement bien-être. Je comprends ce que vivent mes clients de l'intérieur. Séances en cabinet à Lumévale et en visioconférence.",
      certification: 'Sophrologiste certifiée',
      school: 'Institut de Sophrologie de Lyon',
      years_active: 9, hourly_rate: 70,
      consultation_mode: 'both',
      neighborhood: 'Quartier de la Lumière',
      website_url: null, doctolib_url: null,
      instagram_url: null, facebook_url: null,
      is_premium: true, is_verified: true, accepting_patients: true,
      lat: 44.1242, lng: 3.4571,
    },
    {
      slug: 'marc-aurel-lumevale',
      first_name: 'Marc', last_name: 'Aurel',
      city_id: city.id, specialty_id: specialty.id,
      bio: "Sophrologiste spécialisé en préparation mentale sportive et accompagnement des adolescents. Je travaille avec des clubs sportifs de la région et interviens dans les collèges et lycées de Lumévale. Ancien éducateur sportif, j'ai découvert la sophrologie lors d'un bilan de mi-carrière et n'ai plus lâché.",
      certification: 'Sophrologiste certifié',
      school: 'École Nationale de Sophrologie',
      years_active: 6, hourly_rate: 58,
      consultation_mode: 'cabinet',
      neighborhood: 'Les Berges de la Vèle',
      website_url: null, doctolib_url: null,
      instagram_url: null, facebook_url: null,
      is_premium: false, is_verified: true, accepting_patients: true,
      lat: 44.1228, lng: 3.4562,
    },
    {
      slug: 'elise-bertrand-lumevale',
      first_name: 'Élise', last_name: 'Bertrand',
      city_id: city.id, specialty_id: specialty.id,
      bio: "Sophrologiste et sage-femme de formation, je me consacre à l'accompagnement périnatal — grossesse, préparation à l'accouchement, post-partum — et aux troubles féminins (ménopause, endométriose, douleurs chroniques). Je propose des séances individuelles et des ateliers en groupe à Lumévale, ainsi que des consultations en ligne.",
      certification: 'Sophrologiste certifiée',
      school: 'ISRP Paris',
      years_active: 13, hourly_rate: 75,
      consultation_mode: 'both',
      neighborhood: 'Centre-ville',
      website_url: null, doctolib_url: null,
      instagram_url: null, facebook_url: null,
      is_premium: true, is_verified: true, accepting_patients: true,
      lat: 44.1236, lng: 3.4558,
    },
    {
      slug: 'david-leroux-lumevale',
      first_name: 'David', last_name: 'Leroux',
      city_id: city.id, specialty_id: specialty.id,
      bio: "Sophrologiste formé à la sophrologie caycédienne, je me concentre sur les troubles du sommeil, l'anxiété généralisée et les phobies. Je propose uniquement des séances en visioconférence, ce qui me permet d'accompagner des patients partout en France à des horaires flexibles (matin, soir, week-end).",
      certification: 'Sophrologiste Caycédien',
      school: 'Sofrocay',
      years_active: 4, hourly_rate: 55,
      consultation_mode: 'online',
      neighborhood: null,
      website_url: null, doctolib_url: null,
      instagram_url: null, facebook_url: null,
      is_premium: false, is_verified: true, accepting_patients: false,
      lat: null, lng: null,
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
      'claire-valmont-lumevale': ['Stress & anxiété', 'Burn-out', 'Gestion des émotions', 'Sommeil'],
      'marc-aurel-lumevale':     ['Sport & performance', 'Confiance en soi', 'Enfants & ados'],
      'elise-bertrand-lumevale': ['Maternité & périnatal', 'Bien-être féminin', 'Douleurs chroniques'],
      'david-leroux-lumevale':   ['Troubles du sommeil', 'Stress & anxiété', 'Phobies'],
    }
    const tags = tagsMap[p.slug] ?? []
    if (tags.length) {
      await supabase.from('practitioner_tags').delete().eq('practitioner_id', data.id)
      await supabase.from('practitioner_tags').insert(tags.map(label => ({ practitioner_id: data.id, label })))
    }

    // Témoignages
    const testimonialsMap: Record<string, Array<{ author_name: string; author_location: string; content: string; date: string }>> = {
      'claire-valmont-lumevale': [
        { author_name: 'Sophie M.', author_location: 'Lumévale', content: "J'ai consulté Claire après un burn-out sévère. Dès la 3ème séance, je dormais mieux. Au bout de 2 mois, j'avais retrouvé une capacité à décrocher que je pensais avoir perdue pour toujours. Recommande à 200%.", date: '2025-11-15' },
        { author_name: 'Romain L.', author_location: 'Lumévale', content: "Très professionnel et humain. Claire adapte chaque séance à ce qu'on vit. Le suivi post-séance par message est un vrai plus. Je me sens vraiment écouté.", date: '2025-10-03' },
      ],
      'marc-aurel-lumevale': [
        { author_name: 'Théo B.', author_location: 'Lumévale', content: "Marc m'accompagne pour ma prépa triathlon. Les séances de visualisation m'ont vraiment aidé à gérer la pression des compétitions. Mon temps sur le dernier semi a baissé de 8 minutes.", date: '2025-12-01' },
        { author_name: 'Amélie F.', author_location: 'Lumévale', content: "Mon fils de 14 ans souffrait de stress scolaire intense. Après 6 séances avec Marc, il a retrouvé confiance et les nuits difficiles ont disparu. Merci.", date: '2025-09-20' },
      ],
      'elise-bertrand-lumevale': [
        { author_name: 'Laura D.', author_location: 'Lumévale', content: "J'ai suivi Élise pendant toute ma grossesse. Les exercices de respiration pendant le travail ont été décisifs. Mon accouchement s'est passé de manière beaucoup plus sereine que je ne l'espérais.", date: '2025-12-10' },
        { author_name: 'Carole T.', author_location: 'Lumévale', content: "Sophrologiste ET sage-femme, Élise comprend vraiment les enjeux physiques et émotionnels. Elle ne fait pas que donner des outils, elle explique pourquoi ça marche.", date: '2025-08-14' },
      ],
      'david-leroux-lumevale': [
        { author_name: 'Pierre G.', author_location: 'Lyon', content: "Je pensais que les séances en ligne seraient moins efficaces qu'en cabinet. Erreur. David est très présent et les techniques fonctionnent très bien à distance. Je recommande pour les personnes qui n'ont pas le temps de se déplacer.", date: '2025-11-28' },
      ],
    }
    const testimonials = testimonialsMap[p.slug] ?? []
    if (testimonials.length) {
      await supabase.from('testimonials').delete().eq('practitioner_id', data.id)
      await supabase.from('testimonials').insert(testimonials.map(t => ({ ...t, practitioner_id: data.id })))
    }
  }

  // ── 5. Photos praticiens ────────────────────────────────────────────────────
  console.log('\n📸  Upload photos praticiens...')

  for (const { id, slug } of insertedPractitioners) {
    const sourceUrl = PRACTITIONER_IMGS[slug]
    if (!sourceUrl) { console.log(`  ⚠  pas d'image pour ${slug}`); continue }
    const storagePath = `${specialtySlug}/${citySlug}/practitioners/${id}.jpg`
    try {
      const finalUrl = await uploadFromUrl(storagePath, sourceUrl)
      await supabase.from('practitioners').update({ photo_url: finalUrl }).eq('id', id)
      console.log(`  ✓  ${slug} → ${storagePath}`)
    } catch (err) {
      console.error(`  ❌  ${slug}: ${(err as Error).message}`)
    }
  }

  // ── 6. Couvertures blog ─────────────────────────────────────────────────────
  console.log('\n🖼  Upload couvertures blog...')

  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, slug')
    .in('slug', Object.keys(BLOG_COVER_IMGS))

  for (const post of posts ?? []) {
    const sourceUrl = BLOG_COVER_IMGS[post.slug]
    if (!sourceUrl) continue
    const storagePath = `${specialtySlug}/${citySlug}/blog/${post.id}.jpg`
    try {
      const finalUrl = await uploadFromUrl(storagePath, sourceUrl)
      await supabase.from('blog_posts').update({ cover_url: finalUrl }).eq('id', post.id)
      console.log(`  ✓  ${post.slug} → ${storagePath}`)
    } catch (err) {
      console.error(`  ❌  ${post.slug}: ${(err as Error).message}`)
    }
  }

  console.log('\n✅  Seed Lumévale terminé !\n')
}

main().catch(e => { console.error('\n❌', e.message); process.exit(1) })
