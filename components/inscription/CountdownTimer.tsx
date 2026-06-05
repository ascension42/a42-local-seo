'use client'
import { useState, useEffect } from 'react'

const PROMO_END = new Date('2026-07-01T00:00:00')

export default function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    function update() {
      const diff = PROMO_END.getTime() - Date.now()
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }
      setTimeLeft({
        days:    Math.floor(diff / 86400000),
        hours:   Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  if (!mounted) return null

  const units = [
    { n: timeLeft.days,    label: 'jours' },
    { n: timeLeft.hours,   label: 'heures' },
    { n: timeLeft.minutes, label: 'min' },
    { n: timeLeft.seconds, label: 'sec' },
  ]

  return (
    <div className="bg-surface border border-green/30 rounded-xl px-5 py-4 mb-8">
      <p className="text-center text-[11px] font-bold text-green uppercase tracking-[1.5px] mb-3">
        Offre de lancement — se termine dans
      </p>
      <div className="flex justify-center gap-3">
        {units.map(({ n, label }) => (
          <div key={label} className="text-center bg-white rounded-lg px-3 py-2 min-w-[52px] border border-border">
            <span className="block text-[22px] font-extrabold text-green-dark tabular-nums leading-none">
              {String(n).padStart(2, '0')}
            </span>
            <span className="text-[9px] font-semibold text-muted uppercase tracking-[0.5px]">{label}</span>
          </div>
        ))}
      </div>
      <p className="text-center text-[11px] text-muted mt-2.5">
        Prix promotionnel valable jusqu&apos;au 1er juillet 2026
      </p>
    </div>
  )
}
