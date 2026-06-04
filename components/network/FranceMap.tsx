'use client'
import { useState } from 'react'
import type { NetworkCity } from '@/lib/queries'

interface Props {
  cities: NetworkCity[]
}

// Projection simple : France métropolitaine bbox
// lng: -5.0 à 9.5 → x: 0 à 500
// lat: 41.3 à 51.1 → y: 500 à 0 (inversé)
function project(lat: number, lng: number): [number, number] {
  const x = ((lng - (-5.0)) / (9.5 - (-5.0))) * 500
  const y = 500 - ((lat - 41.3) / (51.1 - 41.3)) * 500
  return [x, y]
}

export default function FranceMap({ cities }: Props) {
  const [hovered, setHovered] = useState<NetworkCity | null>(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  return (
    <div className="relative w-full max-w-[700px] mx-auto">
      <svg
        viewBox="0 0 500 500"
        className="w-full"
        style={{ filter: 'drop-shadow(0 4px 32px rgba(92,190,131,0.08))' }}
      >
        {/* Fond de carte simplifié — rectangle représentant la France */}
        <rect x="0" y="0" width="500" height="500" fill="#f5f4f0" rx="12" />

        {/* Contour France simplifié (hexagone approximatif) */}
        <path
          d="M 160 30 L 340 30 L 460 140 L 460 340 L 380 470 L 120 470 L 40 340 L 40 140 Z"
          fill="#eaf7ef"
          stroke="#d1f0df"
          strokeWidth="2"
        />

        {/* Points des villes */}
        {cities.map((city) => {
          const [cx, cy] = project(city.lat, city.lng)
          const isLive = city.is_live

          return (
            <g
              key={city.id}
              onMouseEnter={(e) => {
                setHovered(city)
                const rect = (e.currentTarget.closest('svg') as SVGSVGElement).getBoundingClientRect()
                void rect
                setTooltipPos({ x: cx, y: cy })
              }}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer"
            >
              {/* Halo animé pour les villes live */}
              {isLive && (
                <>
                  <circle cx={cx} cy={cy} r="18" fill="#5cbe83" opacity="0.12">
                    <animate attributeName="r" values="14;22;14" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.12;0.04;0.12" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={cx} cy={cy} r="10" fill="#5cbe83" opacity="0.25">
                    <animate attributeName="r" values="8;13;8" dur="2s" repeatCount="indefinite" begin="0.5s" />
                    <animate attributeName="opacity" values="0.25;0.08;0.25" dur="2s" repeatCount="indefinite" begin="0.5s" />
                  </circle>
                </>
              )}

              {/* Point principal */}
              <circle
                cx={cx}
                cy={cy}
                r={isLive ? 7 : 5}
                fill={isLive ? '#5cbe83' : '#80d3a2'}
                stroke="white"
                strokeWidth={isLive ? 2.5 : 1.5}
                opacity={isLive ? 1 : 0.6}
              />
            </g>
          )
        })}
      </svg>

      {/* Tooltip */}
      {hovered && (
        <div
          className="absolute pointer-events-none z-10 bg-green-deep text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-lg whitespace-nowrap"
          style={{
            left: `${(tooltipPos.x / 500) * 100}%`,
            top: `${(tooltipPos.y / 500) * 100}%`,
            transform: 'translate(-50%, -130%)',
          }}
        >
          <div className="font-bold">{hovered.name}</div>
          {hovered.is_live ? (
            <div className="text-green-light text-[10px]">
              {hovered.practitioner_count} praticien{hovered.practitioner_count > 1 ? 's' : ''}
            </div>
          ) : (
            <div className="text-white/50 text-[10px]">Bientôt disponible</div>
          )}
        </div>
      )}
    </div>
  )
}
