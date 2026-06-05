/**
 * One-shot Stripe setup for sophrologue-bordeaux.fr
 * Usage: STRIPE_SECRET_KEY=sk_test_... npx tsx scripts/setup-stripe.ts
 *
 * Creates:
 *  - Product: Annuaire Sophrologue Bordeaux
 *  - Price: 24€/month recurring
 *  - Coupon: 100% off, limité à 3 utilisations
 *  - Promo code: LANCEMENT (ou valeur de PROMO_CODE)
 *  - Webhook endpoint: /api/stripe/webhook
 */

import Stripe from 'stripe'

const key = process.env.STRIPE_SECRET_KEY
if (!key) {
  console.error('❌  Manque STRIPE_SECRET_KEY')
  console.error('   Usage: STRIPE_SECRET_KEY=sk_test_... npx tsx scripts/setup-stripe.ts')
  process.exit(1)
}

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sophrologue-bordeaux.fr'
const promoCode = process.env.PROMO_CODE ?? 'LANCEMENT'
const maxRedemptions = parseInt(process.env.MAX_REDEMPTIONS ?? '3')

const stripe = new Stripe(key, { apiVersion: '2026-05-27.dahlia' })

async function main() {
  console.log('\n🚀 Setup Stripe — sophrologue-bordeaux.fr\n')
  console.log(`   Site URL     : ${siteUrl}`)
  console.log(`   Code promo   : ${promoCode}`)
  console.log(`   Utilisations : ${maxRedemptions} maximum\n`)

  // ── 1. Produit ──────────────────────────────────────────────────────────────
  console.log('1/5  Création du produit...')
  const product = await stripe.products.create({
    name: 'Annuaire Sophrologue Bordeaux',
    description: 'Inscription mensuelle à l\'annuaire sophrologue-bordeaux.fr',
    metadata: { project: 'a42-local-seo' },
  })
  console.log(`     ✓ Product: ${product.id}`)

  // ── 2. Prix 24€/mois ────────────────────────────────────────────────────────
  console.log('2/5  Création du prix (24€/mois)...')
  const price = await stripe.prices.create({
    product: product.id,
    unit_amount: 2400,
    currency: 'eur',
    recurring: { interval: 'month' },
    nickname: 'Mensuel 24€',
  })
  console.log(`     ✓ Price: ${price.id}`)

  // ── 3. Coupon 100% off, max 3 utilisations ──────────────────────────────────
  console.log(`3/5  Création du coupon (100% off, ${maxRedemptions} utilisations max)...`)
  const coupon = await stripe.coupons.create({
    percent_off: 100,
    duration: 'once',
    max_redemptions: maxRedemptions,
    name: `Lancement — ${maxRedemptions} premiers sophrologues`,
    metadata: { project: 'a42-local-seo' },
  })
  console.log(`     ✓ Coupon: ${coupon.id}`)

  // ── 4. Code promo ───────────────────────────────────────────────────────────
  console.log(`4/5  Création du code promo "${promoCode}"...`)
  const promo = await stripe.promotionCodes.create({
    promotion: { coupon: coupon.id, type: 'coupon' },
    code: promoCode,
    max_redemptions: maxRedemptions,
    metadata: { project: 'a42-local-seo' },
  })
  console.log(`     ✓ Promo code: ${promo.id} → code: ${promo.code}`)

  // ── 5. Webhook ──────────────────────────────────────────────────────────────
  console.log('5/5  Création du webhook endpoint...')
  const webhookUrl = `${siteUrl}/api/stripe/webhook`
  const webhook = await stripe.webhookEndpoints.create({
    url: webhookUrl,
    enabled_events: ['checkout.session.completed'],
    description: 'a42-local-seo — paiement inscription',
  })
  console.log(`     ✓ Webhook: ${webhook.id}`)
  console.log(`     ✓ URL: ${webhookUrl}`)

  // ── Résumé ──────────────────────────────────────────────────────────────────
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('✅  Setup terminé ! Copie ces variables dans ton .env.local :\n')
  console.log(`STRIPE_SECRET_KEY=${key}`)
  console.log(`STRIPE_PRICE_ID=${price.id}`)
  console.log(`STRIPE_WEBHOOK_SECRET=${webhook.secret}`)
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`\n🎟️  Code promo à partager : "${promo.code}"`)
  console.log(`   Valable pour les ${maxRedemptions} premières inscriptions uniquement.`)
  console.log('\n⚠️  Note: STRIPE_WEBHOOK_SECRET n\'est affiché qu\'une seule fois.')
  console.log('   Sauvegarde-le maintenant dans .env.local !\n')
}

main().catch((err) => {
  console.error('\n❌  Erreur Stripe:', err.message)
  process.exit(1)
})
