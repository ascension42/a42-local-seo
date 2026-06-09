import { createStaticClient } from '@/lib/supabase/static'
import { NextResponse } from 'next/server'

// Default tags shown when DB has none yet
const DEFAULT_TAGS = [
  'Gestion du stress', 'Anxiété', 'Troubles du sommeil', 'Confiance en soi',
  'Gestion des émotions', 'Préparation mentale', 'Douleurs chroniques',
  'Burn-out', 'Phobies', 'Sevrage tabac', 'Accompagnement périnatal',
  'Enfants & adolescents', 'Performance sportive', 'Sophrologie en entreprise',
]

export async function GET() {
  try {
    const supabase = createStaticClient()
    const { data } = await supabase
      .from('practitioner_tags')
      .select('label')

    const fromDb = [...new Set((data ?? []).map((t: { label: string }) => t.label as string))].sort()
    const tags = fromDb.length > 0 ? fromDb : DEFAULT_TAGS
    return NextResponse.json(tags)
  } catch {
    return NextResponse.json(DEFAULT_TAGS)
  }
}
