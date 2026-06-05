import { redirect } from 'next/navigation'
import Stripe from 'stripe'
import { createStaticClient } from '@/lib/supabase/static'

export default async function PaiementPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const { id } = await searchParams

  if (!id) redirect('/inscription')

  // Verify inscription exists and is pending
  const supabase = createStaticClient()
  const { data: req_ } = await supabase
    .from('inscription_requests')
    .select('id, first_name, last_name, email, status')
    .eq('id', id)
    .single()

  if (!req_) redirect('/inscription')

  if (req_.status === 'approved') {
    redirect('/inscription/succes')
  }

  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PRICE_ID) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-muted text-sm">Paiement non configuré. Contactez l&apos;administrateur.</p>
      </div>
    )
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2026-05-27.dahlia' })
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sophrologue-bordeaux.fr'

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: req_.email,
    line_items: [{ price: process.env.STRIPE_PRICE_ID, quantity: 1 }],
    metadata: { inscription_request_id: req_.id },
    allow_promotion_codes: true,
    success_url: `${origin}/inscription/succes?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/inscription/formulaire`,
    subscription_data: { trial_period_days: 30 },
  })

  redirect(session.url!)
}
