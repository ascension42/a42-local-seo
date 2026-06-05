/**
 * Storage reorganization script.
 *
 * Moves existing flat files to the organised path convention:
 *   media/{specialty_slug}/{city_slug}/practitioners/{file}
 *   media/{specialty_slug}/{city_slug}/blog/{file}
 *
 * Run once per deployment:
 *   npx tsx scripts/reorganize-storage.ts
 *
 * Requires env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

const BUCKET = 'media'

async function moveFile(oldPath: string, newPath: string): Promise<boolean> {
  // Download from old path
  const { data: blob, error: downloadError } = await supabase.storage
    .from(BUCKET)
    .download(oldPath)

  if (downloadError || !blob) {
    console.warn(`  ⚠ Skip (not found): ${oldPath}`)
    return false
  }

  // Upload to new path
  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(newPath, blob, { upsert: true, contentType: blob.type || 'image/jpeg' })

  if (uploadError) {
    console.error(`  ✗ Upload failed for ${newPath}:`, uploadError.message)
    return false
  }

  // Delete old path
  await supabase.storage.from(BUCKET).remove([oldPath])
  console.log(`  ✓ ${oldPath} → ${newPath}`)
  return true
}

function publicUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!
  return `${base}/storage/v1/object/public/${BUCKET}/${path}`
}

async function migratePractitioners() {
  console.log('\n── Practitioners ──')

  // Fetch all practitioners with old-style photo_url (flat path)
  const { data: practitioners, error } = await supabase
    .from('practitioners')
    .select(`
      id, slug, photo_url,
      cities!inner(slug),
      specialties!inner(slug)
    `)
    .not('photo_url', 'is', null)

  if (error) { console.error(error); return }

  for (const p of practitioners ?? []) {
    const citySlug = (p.cities as { slug: string }).slug
    const specialtySlug = (p.specialties as { slug: string }).slug
    const filename = p.photo_url!.split('/').pop()!

    // Skip if already in new format
    if (p.photo_url!.includes(`/${specialtySlug}/${citySlug}/`)) {
      console.log(`  ✓ Already migrated: ${p.slug}`)
      continue
    }

    const oldPath = `practitioners/${filename}`
    const newPath = `${specialtySlug}/${citySlug}/practitioners/${filename}`

    const moved = await moveFile(oldPath, newPath)
    if (moved) {
      await supabase
        .from('practitioners')
        .update({ photo_url: publicUrl(newPath) })
        .eq('id', p.id)
    }
  }
}

async function migrateBlogPosts() {
  console.log('\n── Blog posts ──')

  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select(`
      id, slug, cover_url,
      cities!inner(slug),
      specialties!inner(slug)
    `)
    .not('cover_url', 'is', null)

  if (error) { console.error(error); return }

  for (const p of posts ?? []) {
    const citySlug = (p.cities as { slug: string }).slug
    const specialtySlug = (p.specialties as { slug: string }).slug

    // Skip external URLs (Unsplash, etc.)
    if (!p.cover_url!.includes('supabase.co')) {
      console.log(`  ℹ External URL, skipping: ${p.slug}`)
      continue
    }

    // Skip if already in new format
    if (p.cover_url!.includes(`/${specialtySlug}/${citySlug}/`)) {
      console.log(`  ✓ Already migrated: ${p.slug}`)
      continue
    }

    const filename = p.cover_url!.split('/').pop()!
    const oldPath = `blog/${filename}`
    const newPath = `${specialtySlug}/${citySlug}/blog/${filename}`

    const moved = await moveFile(oldPath, newPath)
    if (moved) {
      await supabase
        .from('blog_posts')
        .update({ cover_url: publicUrl(newPath) })
        .eq('id', p.id)
    }
  }
}

async function main() {
  console.log('Storage reorganization')
  console.log('Convention: media/{specialty_slug}/{city_slug}/{type}/{file}')
  await migratePractitioners()
  await migrateBlogPosts()
  console.log('\nDone.')
}

main().catch(console.error)
