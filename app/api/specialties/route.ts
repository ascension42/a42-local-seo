import { createStaticClient } from '@/lib/supabase/static'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createStaticClient()
  const { data } = await supabase.from('specialties').select('slug, name').order('name')
  return NextResponse.json(data ?? [])
}
