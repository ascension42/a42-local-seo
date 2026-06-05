'use client'
import { useEffect, useRef } from 'react'
import type { Practitioner } from '@/lib/types'

interface Props {
  practitioners: Practitioner[]
}

export default function PractitionersMap({ practitioners }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<import('leaflet').Map | null>(null)

  useEffect(() => {
    if (!mapRef.current) return
    // Guard against React StrictMode double-invoke and re-renders
    if (mapInstanceRef.current) return
    // Guard against Leaflet container already initialized (StrictMode cleanup race)
    if ((mapRef.current as HTMLDivElement & { _leaflet_id?: number })._leaflet_id) return

    import('leaflet').then((L) => {
      if (!mapRef.current || mapInstanceRef.current) return

      // Fix default icon
      // @ts-expect-error
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      })

      const map = L.map(mapRef.current).setView([44.8378, -0.5792], 12)
      mapInstanceRef.current = map

      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap contributors © CARTO',
        maxZoom: 18,
      }).addTo(map)

      const greenIcon = L.divIcon({
        className: '',
        html: `<div style="width:28px;height:28px;border-radius:50% 50% 50% 0;background:#5cbe83;border:3px solid white;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(92,190,131,0.4)"></div>`,
        iconSize: [28, 28], iconAnchor: [14, 28], popupAnchor: [0, -30],
      })
      const premiumIcon = L.divIcon({
        className: '',
        html: `<div style="width:32px;height:32px;border-radius:50% 50% 50% 0;background:#2e5537;border:3px solid #5cbe83;transform:rotate(-45deg);box-shadow:0 2px 12px rgba(46,85,55,0.5)"></div>`,
        iconSize: [32, 32], iconAnchor: [16, 32], popupAnchor: [0, -34],
      })

      practitioners.filter((p) => p.lat && p.lng).forEach((p) => {
        const modeLabel = { cabinet: 'Cabinet', online: 'En ligne', both: 'Cabinet & En ligne' }
        const popup = `<div style="font-family:sans-serif;min-width:180px">
          <div style="font-weight:800;font-size:14px;color:#2e5537;margin-bottom:4px">${p.first_name} ${p.last_name}</div>
          <div style="font-size:11px;color:#7a7a7a;margin-bottom:4px">${p.neighborhood ?? ''} · ${p.hourly_rate ? p.hourly_rate + ' €' : ''}</div>
          <div style="font-size:10px;color:#5cbe83;font-weight:600;margin-bottom:8px">${modeLabel[p.consultation_mode]}</div>
          <a href="/praticiens/${p.slug}" style="display:block;background:#5cbe83;color:white;text-align:center;padding:6px 12px;border-radius:6px;font-size:11px;font-weight:700;text-decoration:none">Voir le profil →</a>
        </div>`
        L.marker([p.lat!, p.lng!], { icon: p.is_premium ? premiumIcon : greenIcon })
          .addTo(map).bindPopup(popup)
      })
    })

    return () => {
      mapInstanceRef.current?.remove()
      mapInstanceRef.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />
      <div ref={mapRef}
        style={{ height: '380px', width: '100%', borderRadius: '12px', zIndex: 1 }}
        className="border border-border overflow-hidden" />
    </>
  )
}
