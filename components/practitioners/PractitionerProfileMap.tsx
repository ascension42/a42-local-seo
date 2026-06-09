'use client'
import { useEffect, useRef } from 'react'
import type { Practitioner } from '@/lib/types'

interface Props {
  practitioner: Practitioner
}

export default function PractitionerProfileMap({ practitioner: p }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<import('leaflet').Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return
    if (!p.lat || !p.lng) return
    if ((mapRef.current as HTMLDivElement & { _leaflet_id?: number })._leaflet_id) return

    import('leaflet').then((L) => {
      if (!mapRef.current || mapInstanceRef.current) return

      // @ts-expect-error
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })

      const map = L.map(mapRef.current, { zoomControl: true }).setView([p.lat!, p.lng!], 15)
      mapInstanceRef.current = map

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors © CARTO',
        maxZoom: 18,
      }).addTo(map)

      const icon = L.divIcon({
        className: '',
        html: `<div style="width:28px;height:28px;border-radius:50% 50% 50% 0;background:#5cbe83;border:3px solid white;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(92,190,131,0.4)"></div>`,
        iconSize: [28, 28], iconAnchor: [14, 28], popupAnchor: [0, -30],
      })

      const address = p.cabinet_address ?? p.neighborhood ?? ''
      const gmapsQuery = encodeURIComponent(`${p.first_name} ${p.last_name}${address ? ' ' + address : ''}`)
      const gmapsUrl = `https://www.google.com/maps/search/?api=1&query=${gmapsQuery}`

      const popup = `<div style="font-family:sans-serif;min-width:170px;padding:2px 0">
        <div style="font-weight:800;font-size:13px;color:#2e5537;margin-bottom:3px">${p.first_name} ${p.last_name}</div>
        ${address ? `<div style="font-size:11px;color:#7a7a7a;margin-bottom:8px;line-height:1.4">${address}</div>` : ''}
        <a href="${gmapsUrl}" target="_blank" rel="noopener noreferrer"
          style="display:flex;align-items:center;gap:5px;background:#5cbe83;color:white;padding:6px 10px;border-radius:6px;font-size:11px;font-weight:700;text-decoration:none">
          <svg width="11" height="11" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 1.5C7 1.5 4.5 4 4.5 7c0 4.5 5.5 11.5 5.5 11.5S15.5 11.5 15.5 7c0-3-2.5-5.5-5.5-5.5z" stroke="white" stroke-width="1.5" fill="rgba(255,255,255,0.25)"/>
            <circle cx="10" cy="7" r="2" stroke="white" stroke-width="1.5"/>
          </svg>
          Ouvrir dans Google Maps
        </a>
      </div>`

      L.marker([p.lat!, p.lng!], { icon })
        .addTo(map)
        .bindPopup(popup, { maxWidth: 220 })
        .openPopup()
    })

    return () => {
      mapInstanceRef.current?.remove()
      mapInstanceRef.current = null
    }
  }, [p.lat, p.lng]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!p.lat || !p.lng) return null

  return (
    <>
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
      <div
        ref={mapRef}
        style={{ height: '200px', width: '100%', borderRadius: '12px', zIndex: 1 }}
        className="border border-border overflow-hidden"
      />
    </>
  )
}
