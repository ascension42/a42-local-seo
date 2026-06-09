'use client'

import { track } from '@/lib/analytics'

interface Props {
  href: string
  practitionerId: string
  children: React.ReactNode
  className?: string
}

export default function BookingButton({ href, practitionerId, children, className }: Props) {
  function handleClick() {
    track({ name: 'booking_button_clicked', properties: { practitioner_id: practitionerId } })
    // Compatibilité avec l'ancienne API Supabase track-click
    fetch('/api/track-click', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ practitioner_id: practitionerId }),
    }).catch(() => {})
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={className}
    >
      {children}
    </a>
  )
}
