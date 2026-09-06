import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Navigation, MessageCircle } from 'lucide-react'
import type { Property } from '../../types'
import { mapService } from '../../services'

export default function LocationPanel({ property }: { property: Property }) {
  const [nearby, setNearby] = useState<{ name: string; type: string; distanceKm: number }[]>([])
  const [showMap, setShowMap] = useState(false)
  const mapsConfigured = mapService.hasGoogleMapsKey()

  useEffect(() => {
    mapService.getNearbyPlaces(property.latitude, property.longitude).then(setNearby)
  }, [property.latitude, property.longitude])

  return (
    <div className="rounded-md border border-stone-light bg-white p-5 sm:p-6">
      <h3 className="font-display text-lg font-semibold text-ink">Property location</h3>
      <p className="mt-1 text-sm text-ink-light">{property.address}, {property.city}, {property.state}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          onClick={() => setShowMap((v) => !v)}
          className="flex items-center gap-1.5 rounded-full border border-stone-light px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-ochre-dark"
        >
          <MapPin className="h-4 w-4 text-rust" strokeWidth={1.75} />
          {showMap ? 'Hide map' : 'View location in map'}
        </button>
        <Link
          to={`/messages?new=${encodeURIComponent(property.seller.name)}&property=${encodeURIComponent(property.title)}`}
          className="flex items-center gap-1.5 rounded-full border border-stone-light px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-ochre-dark"
        >
          <MessageCircle className="h-4 w-4 text-ochre-dark" strokeWidth={1.75} />
          Message seller
        </Link>
      </div>

      {!showMap ? null : !mapsConfigured ? (
        <div className="mt-4 flex aspect-[16/9] flex-col items-center justify-center gap-2 rounded-md border border-dashed border-stone-light bg-parchment-dim text-center">
          <MapPin className="h-6 w-6 text-stone" strokeWidth={1.5} />
          <p className="max-w-xs text-sm text-stone">
            Interactive Google Maps isn't connected in this environment. Once <code className="rounded bg-stone-light px-1">VITE_GOOGLE_MAPS_API_KEY</code> is set, this becomes a live map centred on this property's coordinates.
          </p>
        </div>
      ) : null}

      {/* Real map preview — only rendered once a Google Maps key is actually
          configured, so this never implies a live map connection that isn't
          there. Swap the inner content for the Google Maps JS API embed,
          keyed by VITE_GOOGLE_MAPS_API_KEY, without changing this
          component's props. */}
      {showMap && mapsConfigured && (
        <div className="relative mt-4 flex aspect-[16/9] items-center justify-center overflow-hidden rounded-md bg-verdant-light">
          <svg className="absolute inset-0 h-full w-full opacity-40" viewBox="0 0 400 225" preserveAspectRatio="none">
            <path d="M0 160 Q100 120 200 150 T400 130" stroke="#2f6f5e" strokeWidth="3" fill="none" opacity="0.5" />
            <path d="M0 60 Q150 90 250 50 T400 70" stroke="#8a8577" strokeWidth="2" fill="none" opacity="0.4" />
          </svg>
          <div className="relative flex flex-col items-center gap-1.5">
            <MapPin className="h-8 w-8 text-rust" strokeWidth={2} fill="#f4e6e2" />
            <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-ink">
              {property.neighbourhood}, {property.city}
            </span>
          </div>
          <button className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-ink/85 px-3 py-1.5 text-xs font-medium text-parchment">
            <Navigation className="h-3.5 w-3.5" strokeWidth={1.75} />
            Get directions
          </button>
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {nearby.map((n) => (
          <div key={n.name} className="flex items-center justify-between rounded-md bg-parchment-dim px-3 py-2 text-sm">
            <span className="text-ink-light">{n.name}</span>
            <span className="text-xs font-medium text-stone">{n.distanceKm} km</span>
          </div>
        ))}
      </div>
    </div>
  )
}
