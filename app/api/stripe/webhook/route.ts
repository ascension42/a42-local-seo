import Stripe from 'stripe'
import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-05-27.dahlia' })

export async function POST(req: Request) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session

    // Accept both normal payment and 100%-off promo codes
    const isPaid = session.payment_status === 'paid' || session.payment_status === 'no_payment_required'
    if (!isPaid) return NextResponse.json({ received: true })

    const inscriptionId = session.metadata?.inscription_request_id
    if (!inscriptionId) return NextResponse.json({ received: true })

    const supabase = createServiceClient()

    // 1. Fetch the inscription request
    const { data: req_ } = await supabase
      .from('inscription_requests')
      .select('*')
      .eq('id', inscriptionId)
      .single()

    if (!req_) return NextResponse.json({ received: true })

    // 2. Mark inscription as approved
    await supabase
      .from('inscription_requests')
      .update({ status: 'approved' })
      .eq('id', inscriptionId)

    // 3. Look up city + specialty IDs from siteConfig defaults
    const citySlug = process.env.NEXT_PUBLIC_CITY ?? 'bordeaux'
    const specialtySlug = process.env.NEXT_PUBLIC_SPECIALTY ?? 'sophrologue'

    const [{ data: city }, { data: specialty }] = await Promise.all([
      supabase.from('cities').select('id').eq('slug', citySlug).single(),
      supabase.from('specialties').select('id').eq('slug', specialtySlug).single(),
    ])

    if (!city || !specialty) return NextResponse.json({ received: true })

    // 4. Generate slug from name
    const baseSlug = `${req_.first_name}-${req_.last_name}`
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // 5. Ensure slug is unique
    let slug = baseSlug
    const { data: existing } = await supabase
      .from('practitioners')
      .select('slug')
      .like('slug', `${baseSlug}%`)
    if (existing && existing.length > 0) {
      slug = `${baseSlug}-${existing.length + 1}`
    }

    // 6. Create the practitioner profile (pending admin review / visible once is_verified set)
    await supabase.from('practitioners').insert({
      slug,
      first_name: req_.first_name,
      last_name: req_.last_name,
      city_id: city.id,
      specialty_id: specialty.id,
      bio: req_.bio ?? null,
      certification: req_.certification ?? null,
      school: req_.school ?? null,
      years_active: req_.years_active ?? null,
      hourly_rate: req_.hourly_rate ?? null,
      consultation_mode: req_.consultation_mode ?? 'cabinet',
      neighborhood: req_.neighborhood ?? null,
      website_url: req_.website_url ?? null,
      doctolib_url: req_.booking_url ?? null,
      is_premium: false,
      is_verified: false,   // Admin sets this to true after certification check
      accepting_patients: true,
    })
  }

  return NextResponse.json({ received: true })
}
