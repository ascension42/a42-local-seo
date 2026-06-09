/**
 * One-shot storage normalization script.
 *
 * Convention cible : {specialty}/{city}/{type}/{nom-lisible}.ext
 *
 * Usage : npx tsx scripts/normalize-storage.ts
 * Requires .env.local with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY!
const SPECIALTY    = process.env.NEXT_PUBLIC_SPECIALTY ?? 'sophrologue'
const CITY         = process.env.NEXT_PUBLIC_CITY ?? 'pezenas'
const BUCKET       = 'media'

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY)
const BASE_URL = `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}`

function slugify(str: string): string {
  return str.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

function pathFromUrl(url: string): string {
  return url.replace(`${BASE_URL}/`, '')
}

async function moveFile(from: string, to: string): Promise<void> {
  if (from === to) { console.log(`  skip (already correct): ${to}`); return }
  const { error } = await supabase.storage.from(BUCKET).move(from, to)
  if (error) throw new Error(`move ${from} → ${to} : ${error.message}`)
  console.log(`  ✓ moved  ${from}`)
  console.log(`         → ${to}`)
}

// ---------------------------------------------------------------------------
// 1. Practitioner photos
// ---------------------------------------------------------------------------
async function normalizePractitioners() {
  console.log('\n── Praticiens ──')
  const { data, error } = await supabase
    .from('practitioners')
    .select('id, first_name, last_name, photo_url')
    .not('photo_url', 'is', null)
    .ilike('photo_url', `${BASE_URL}/%`)

  if (error) throw error

  for (const p of data ?? []) {
    const firstSlug = slugify(p.first_name)
    const lastSlug  = slugify(p.last_name)
    const newPath   = `${SPECIALTY}/${CITY}/practitioners/${firstSlug}-${lastSlug}.jpg`
    const newUrl    = `${BASE_URL}/${newPath}`

    if (p.photo_url === newUrl) { console.log(`  skip: ${p.first_name} ${p.last_name}`); continue }

    await moveFile(pathFromUrl(p.photo_url), newPath)
    await supabase.from('practitioners').update({ photo_url: newUrl }).eq('id', p.id)
    console.log(`  ✓ DB   ${p.first_name} ${p.last_name} → ${newUrl}`)
  }
}

// ---------------------------------------------------------------------------
// 2. Blog covers
// ---------------------------------------------------------------------------
async function normalizeBlogCovers() {
  console.log('\n── Blog covers ──')
  const { data, error } = await supabase
    .from('blog_posts')
    .select('id, slug, cover_url')
    .not('cover_url', 'is', null)
    .ilike('cover_url', `${BASE_URL}/%`)

  if (error) throw error

  for (const post of data ?? []) {
    const ext     = post.cover_url.split('.').pop()?.toLowerCase() ?? 'jpg'
    const newPath = `${SPECIALTY}/${CITY}/blog/${post.slug}.${ext}`
    const newUrl  = `${BASE_URL}/${newPath}`

    if (post.cover_url === newUrl) { console.log(`  skip: ${post.slug}`); continue }

    await moveFile(pathFromUrl(post.cover_url), newPath)
    await supabase.from('blog_posts').update({ cover_url: newUrl }).eq('id', post.id)
    console.log(`  ✓ DB   ${post.slug} → ${newUrl}`)
  }
}

// ---------------------------------------------------------------------------
// 3. Certificates — fix old city/specialty order + remove timestamp from name
// ---------------------------------------------------------------------------
async function normalizeCertificates() {
  console.log('\n── Certificats ──')
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list(`certificates/${CITY}/${SPECIALTY}`)

  if (error || !data?.length) {
    console.log('  nothing to migrate')
    return
  }

  for (const file of data) {
    const oldPath = `certificates/${CITY}/${SPECIALTY}/${file.name}`
    // Strip trailing timestamp: "prenom-nom-1234567890.ext" → "prenom-nom.ext"
    const cleanName = file.name.replace(/-\d{10,13}(\.[^.]+)$/, '$1')
    const newPath   = `${SPECIALTY}/${CITY}/certificates/${cleanName}`
    await moveFile(oldPath, newPath)
  }
}

// ---------------------------------------------------------------------------
async function main() {
  console.log(`Normalizing storage for ${SPECIALTY}/${CITY} …`)
  await normalizePractitioners()
  await normalizeBlogCovers()
  await normalizeCertificates()
  console.log('\n✅ Done.')
}

main().catch((e) => { console.error(e); process.exit(1) })
