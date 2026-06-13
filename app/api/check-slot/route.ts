import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const zone  = searchParams.get('zone')?.trim()
  const niche = searchParams.get('niche')?.trim()
  const citySlug = process.env.NEXT_PUBLIC_CITY ?? 'lumevale'

  if (!zone || !niche) {
    return NextResponse.json({ available: false, error: 'Paramètres manquants' }, { status: 400 })
  }

  const supabase = createServiceClient()

  const { data: city } = await supabase
    .from('cities')
    .select('id')
    .eq('slug', citySlug)
    .single()

  if (!city) return NextResponse.json({ available: true })

  const { data } = await supabase
    .from('practitioners')
    .select('id')
    .eq('city_id', city.id)
    .ilike('zone',  zone)
    .ilike('niche', niche)
    .limit(1)

  return NextResponse.json({ available: !(data?.length) })
}
