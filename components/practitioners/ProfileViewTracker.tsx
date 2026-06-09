'use client'
import { useEffect } from 'react'
import { track } from '@/lib/analytics'

export default function ProfileViewTracker({ practitionerId }: { practitionerId: string }) {
  useEffect(() => {
    const referrer = document.referrer || null
    track({ name: 'practitioner_profile_viewed', properties: { practitioner_id: practitionerId, referrer } })
    // Compatibilité avec l'ancienne API Supabase track-view
    fetch('/api/track-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ practitioner_id: practitionerId, referrer }),
    }).catch(() => {})
  }, [practitionerId])

  return null
}
