import type { Metadata } from 'next'
import { getNetworkCities } from '@/lib/queries'
import FranceMap from '@/components/network/FranceMap'

export const metadata: Metadata = {
  title: 'Réseau Sophrologues France — Annuaires certifiés par ville',
  description: 'Découvrez notre réseau d\'annuaires de sophrologues certifiés RNCP en France. Trouvez un sophrologue près de chez vous dans votre ville.',
  openGraph: {
    title: 'Réseau Sophrologues France — Annuaires certifiés par ville',
    description: 'Annuaires de sophrologues certifiés dans toutes les grandes villes françaises.',
    type: 'website',
  },
}

export const revalidate = 3600

export default async function VillesPage() {
  const cities = await getNetworkCities()
  const liveCities = cities.filter((c) => c.is_live)
  const totalPractitioners = cities.reduce((sum, c) => sum + c.practitioner_count, 0)

  return (
    <>
      <div className="bg-green-dark px-4 md:px-10 py-10 md:py-12 text-center">
        <p className="text-[10px] font-bold text-green-light uppercase tracking-[2px] mb-3">
          Notre réseau
        </p>
        <h1 className="text-[30px] font-extrabold text-white leading-[1.2] mb-3 tracking-tight">
          Des sophrologues certifiés<br />partout en France
        </h1>
        <p className="text-sm text-white/70 max-w-[480px] mx-auto leading-[1.65]">
          {liveCities.length} ville{liveCities.length > 1 ? 's' : ''} active{liveCities.length > 1 ? 's' : ''} · {totalPractitioners} praticien{totalPractitioners > 1 ? 's' : ''} référencé{totalPractitioners > 1 ? 's' : ''}
        </p>
      </div>

      <div className="max-w-[1060px] mx-auto px-4 md:px-10 py-8 md:py-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div>
          <FranceMap cities={cities} />
        </div>

        <div>
          <h2 className="text-xl font-extrabold text-green-dark mb-6 tracking-tight">
            Villes disponibles
          </h2>
          <div className="space-y-3">
            {cities.map((city) => (
              <div
                key={city.id}
                className={[
                  'flex items-center justify-between p-4 rounded-xl border-[1.5px]',
                  city.is_live
                    ? 'border-green bg-surface'
                    : 'border-border bg-white opacity-60',
                ].join(' ')}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${city.is_live ? 'bg-green' : 'bg-muted'}`} />
                  <div>
                    <p className="text-sm font-bold text-green-dark">{city.name}</p>
                    <p className="text-[10px] text-muted">{city.domain}</p>
                  </div>
                </div>
                <div className="text-right">
                  {city.is_live ? (
                    <>
                      <p className="text-sm font-bold text-green">{city.practitioner_count}</p>
                      <p className="text-[10px] text-muted">praticien{city.practitioner_count > 1 ? 's' : ''}</p>
                    </>
                  ) : (
                    <span className="text-[10px] font-semibold text-muted bg-bg-alt px-2 py-1 rounded-lg">
                      Bientôt
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
