'use client'

interface Props {
  href: string
  practitionerId: string
  children: React.ReactNode
  className?: string
}

export default function BookingButton({ href, practitionerId, children, className }: Props) {
  function handleClick() {
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
