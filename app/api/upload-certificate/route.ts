import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { siteConfig } from '@/lib/config'

const MAX_BYTES = 10 * 1024 * 1024 // 10 MB
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'Fichier trop volumineux (max 10 Mo)' }, { status: 400 })
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Format non supporté — PDF, JPG ou PNG uniquement' }, { status: 400 })
    }

    const firstName = (formData.get('first_name') as string | null) ?? ''
    const lastName = (formData.get('last_name') as string | null) ?? ''
    const firstSlug = slugify(firstName) || 'praticien'
    const lastSlug = slugify(lastName) || 'inconnu'

    const supabase = createServiceClient()
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'pdf'
    const path = `certificates/${siteConfig.city}/${siteConfig.specialty}/${firstSlug}-${lastSlug}-${Date.now()}.${ext}`

    const buffer = Buffer.from(await file.arrayBuffer())
    const { error } = await supabase.storage
      .from('media')
      .upload(path, buffer, { contentType: file.type, upsert: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(path)

    return NextResponse.json({ url: publicUrl, name: file.name })
  } catch {
    return NextResponse.json({ error: "Erreur lors de l'envoi du fichier" }, { status: 500 })
  }
}
