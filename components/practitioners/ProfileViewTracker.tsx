'use client'
import { useEffect } from 'react'

export default function ProfileViewTracker({ practitionerId }: { practitionerId: string }) {
  useEffect(() => {
    fetch('/api/track-view', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        practitioner_id: practitionerId,
        referrer: document.referrer || null,
      }),
    }).catch(() => {})
  }, [practitionerId])

  return null
}
