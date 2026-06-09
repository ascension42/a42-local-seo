import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

const MAX_BYTES = 10 * 1024 * 1024 // 10 MB
const ALLOWED_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp']

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

    const supabase = createServiceClient()
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'pdf'
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const path = `certificates/${safeName}`

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
