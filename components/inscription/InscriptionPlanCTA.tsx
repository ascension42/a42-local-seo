'use client'

import { track } from '@/lib/analytics'

type Plan = 'standard' | 'premium'
type Location = 'cards' | 'bottom_cta'

interface Props {
  plan: Plan
  href: string
  className: string
  children: React.ReactNode
  location: Location
}

export default function InscriptionPlanCTA({ plan, href, className, children, location }: Props) {
  return (
    <a
      href={href}
      onClick={() => track({ name: 'inscription_plan_cta_clicked', properties: { plan, location } })}
      className={className}
    >
      {children}
    </a>
  )
}
