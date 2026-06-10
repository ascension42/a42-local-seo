import { redirect } from 'next/navigation'
import { createStaticClient } from '@/lib/supabase/static'

export default async function PaiementPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const { id } = await searchParams
  if (!id) redirect('/inscription')

  const supabase = createStaticClient()
  const { data: req_ } = await supabase
    .from('inscription_requests')
    .select('id, status')
    .eq('id', id)
    .single()

  if (!req_) redirect('/inscription')
  if (req_.status === 'approved') redirect('/inscription/succes')

  // Paiement géré manuellement — lien envoyé par email après validation
  redirect('/inscription/succes')
}
