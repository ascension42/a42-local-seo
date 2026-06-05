import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { first_name, last_name, specialty_slug, email, phone, plan } = await req.json()

    if (!first_name || !last_name || !specialty_slug || !email) {
      return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 })
    }

    const validPlan = plan === 'premium' ? 'premium' : 'standard'
    const citySlug = process.env.NEXT_PUBLIC_CITY_SLUG ?? 'pezenas'

    const supabase = createServiceClient()
    const { data: row, error } = await supabase
      .from('inscription_requests')
      .insert({
        first_name,
        last_name,
        specialty_slug,
        email,
        phone: phone || null,
        plan: validPlan,
        city_slug: citySlug,
      })
      .select('id')
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Notifier les admins via n8n (fire-and-forget)
    const n8nUrl = process.env.N8N_INSCRIPTION_WEBHOOK_URL
    if (n8nUrl) {
      fetch(n8nUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inscription_id: row.id, first_name, last_name, specialty_slug, email, phone: phone || '', plan: validPlan }),
      }).catch(() => {})
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
