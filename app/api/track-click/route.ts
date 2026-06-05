import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { practitioner_id } = await req.json()
    if (!practitioner_id) return NextResponse.json({ error: 'missing id' }, { status: 400 })
    const supabase = await createClient()
    await supabase.from('booking_clicks').insert({ practitioner_id })
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 })
  }
}
