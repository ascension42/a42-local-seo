/**
 * Storage migration — UUID-based path convention.
 *
 * NEW convention (conflict-free):
 *   media/{specialty_slug}/{city_slug}/practitioners/{practitioner_uuid}.{ext}
 *   media/{specialty_slug}/{city_slug}/blog/{post_uuid}.{ext}
 *
 * WHY uuid as filename:
 *   - Two practitioners named "Jean Moreau" in different cities → no conflict
 *   - Same blog slug duplicated across cities → no conflict
 *   - Globally unique: uuid is the primary key in the DB
 *
 * Usage:
 *   npx tsx scripts/reorganize-storage.ts
 *
 * Requires env: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

const BUCKET = 'media'

function publicUrl(path: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${path}`
}

function extractStoragePath(url: string): string | null {
  // Returns the path after /public/{bucket}/ from a Supabase storage URL.
  const marker = `/object/public/${BUCKET}/`
  const idx = url.indexOf(marker)
  if (idx === -1) return null
  return url.slice(idx + marker.length)
}

function ext(filename: string): string {
  const parts = filename.split('.')
  return parts.length > 1 ? parts.pop()! : 'jpg'
}

async function copyFile(oldPath: string, newPath: string): Promise<boolean> {
  if (oldPath === newPath) return true

  // Download
  const { data: blob, error: dlErr } = await supabase.storage.from(BUCKET).download(oldPath)
  if (dlErr || !blob) {
    console.warn(`  ⚠  not found in storage: ${oldPath}`)
    return false
  }

  // Upload to new path
  const { error: ulErr } = await supabase.storage.from(BUCKET).upload(newPath, blob, {
    upsert: true,
    contentType: blob.type || 'image/jpeg',
  })
  if (ulErr) {
    console.error(`  ✗  upload failed for ${newPath}: ${ulErr.message}`)
    return false
  }

  // Remove old file only after upload succeeds
  await supabase.storage.from(BUCKET).remove([oldPath])
  console.log(`  ✓  ${oldPath}`)
  console.log(`     → ${newPath}`)
  return true
}

async function migratePractitioners() {
  console.log('\n══ Practitioners ══════════════════════════════════════')

  const { data, error } = await supabase
    .from('practitioners')
    .select(`
      id, slug, photo_url,
      cities!inner(slug),
      specialties!inner(slug)
    `)
    .not('photo_url', 'is', null)

  if (error) { console.error(error.message); return }

  for (const p of data ?? []) {
    const citySlug      = (p.cities as unknown as { slug: string }).slug
    const specialtySlug = (p.specialties as unknown as { slug: string }).slug

    console.log(`\n  ${p.slug}`)

    // Skip external URLs (Unsplash, etc.)
    if (!p.photo_url!.includes('supabase.co')) {
      console.log('  ℹ  external URL, skipped')
      continue
    }

    const oldPath   = extractStoragePath(p.photo_url!)
    if (!oldPath) { console.warn('  ⚠  cannot parse URL'); continue }

    const extension = ext(oldPath.split('/').pop()!)
    const newPath   = `${specialtySlug}/${citySlug}/practitioners/${p.id}.${extension}`

    if (oldPath === newPath) {
      console.log('  ✓  already at correct path')
      continue
    }

    const moved = await copyFile(oldPath, newPath)
    if (moved) {
      const { error: dbErr } = await supabase
        .from('practitioners')
        .update({ photo_url: publicUrl(newPath) })
        .eq('id', p.id)
      if (dbErr) console.error(`  ✗  DB update failed: ${dbErr.message}`)
      else console.log(`  ✓  DB updated → ${publicUrl(newPath)}`)
    }
  }
}

async function migrateBlogPosts() {
  console.log('\n══ Blog posts ══════════════════════════════════════════')

  const { data, error } = await supabase
    .from('blog_posts')
    .select(`
      id, slug, cover_url,
      cities!inner(slug),
      specialties!inner(slug)
    `)
    .not('cover_url', 'is', null)

  if (error) { console.error(error.message); return }

  for (const p of data ?? []) {
    const citySlug      = (p.cities as unknown as { slug: string }).slug
    const specialtySlug = (p.specialties as unknown as { slug: string }).slug

    console.log(`\n  ${p.slug}`)

    if (!p.cover_url!.includes('supabase.co')) {
      console.log('  ℹ  external URL (Unsplash etc.), skipped')
      continue
    }

    const oldPath   = extractStoragePath(p.cover_url!)
    if (!oldPath) { console.warn('  ⚠  cannot parse URL'); continue }

    const extension = ext(oldPath.split('/').pop()!)
    const newPath   = `${specialtySlug}/${citySlug}/blog/${p.id}.${extension}`

    if (oldPath === newPath) {
      console.log('  ✓  already at correct path')
      continue
    }

    const moved = await copyFile(oldPath, newPath)
    if (moved) {
      const { error: dbErr } = await supabase
        .from('blog_posts')
        .update({ cover_url: publicUrl(newPath) })
        .eq('id', p.id)
      if (dbErr) console.error(`  ✗  DB update failed: ${dbErr.message}`)
      else console.log(`  ✓  DB updated → ${publicUrl(newPath)}`)
    }
  }
}

async function main() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing env: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required')
    process.exit(1)
  }

  console.log('Storage migration — UUID-based path convention')
  console.log('  media/{specialty}/{city}/practitioners/{uuid}.{ext}')
  console.log('  media/{specialty}/{city}/blog/{uuid}.{ext}')

  await migratePractitioners()
  await migrateBlogPosts()

  console.log('\n✓ Migration complete.')
}

main().catch(console.error)
