import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { practitioner_id, referrer } = await req.json()
    if (!practitioner_id) return NextResponse.json({ error: 'missing id' }, { status: 400 })
    const supabase = await createClient()
    await supabase.from('profile_views').insert({ practitioner_id, referrer: referrer ?? null })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
