import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      first_name, last_name, email, phone,
      certification, school, years_active,
      consultation_mode, neighborhood, hourly_rate,
      website_url, booking_url, bio, tags,
    } = body

    if (!first_name || !last_name || !email) {
      return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 })
    }

    const supabase = createServiceClient()
    const { data: row, error } = await supabase
      .from('inscription_requests')
      .insert({
        first_name, last_name, email,
        phone: phone || null,
        certification: certification || null,
        school: school || null,
        years_active: years_active ? parseInt(years_active) : null,
        consultation_mode: consultation_mode || 'cabinet',
        neighborhood: neighborhood || null,
        hourly_rate: hourly_rate ? parseInt(hourly_rate) : null,
        website_url: website_url || null,
        booking_url: booking_url || null,
        bio: bio || null,
        tags: tags?.length ? tags : null,
      })
      .select('id')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Trigger n8n verification workflow (fire-and-forget)
    const n8nWebhookUrl = process.env.N8N_INSCRIPTION_WEBHOOK_URL
    if (n8nWebhookUrl) {
      fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          inscription_id: row.id,
          first_name, last_name, email, phone,
          certification, school, years_active,
          consultation_mode, neighborhood, hourly_rate,
          website_url, booking_url, bio,
          tags: tags ?? [],
        }),
      }).catch(() => {}) // non-blocking
    }

    return NextResponse.json({ ok: true, id: row.id })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
