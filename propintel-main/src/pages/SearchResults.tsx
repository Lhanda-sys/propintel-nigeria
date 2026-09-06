import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { List, Map as MapIcon, SlidersHorizontal, X } from 'lucide-react'
import SearchBar from '../components/search/SearchBar'
import FilterPanel, { type Filters } from '../components/search/FilterPanel'
import PropertyCard from '../components/property/PropertyCard'
import { propertyService } from '../services/propertyService'
import { formatNaira } from '../lib/format'
import type { Property } from '../types'

export default function SearchResults({ forceMap = false }: { forceMap?: boolean }) {
  const [params] = useSearchParams()
  const [results, setResults] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'list' | 'map'>(forceMap ? 'map' : 'list')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [selected, setSelected] = useState<Property | null>(null)

  const filters = useMemo<Filters>(
    () => ({
      category: (params.get('category') as Filters['category']) || undefined,
      state: params.get('state') || undefined,
      maxPrice: params.get('maxPrice') ? Number(params.get('maxPrice')) : undefined,
      bedrooms: params.get('bedrooms') ? Number(params.get('bedrooms')) : undefined,
      verifiedOnly: params.get('verifiedOnly') === 'true',
    }),
    [params]
  )
  const [localFilters, setLocalFilters] = useState<Filters>(filters)

  useEffect(() => setLocalFilters(filters), [filters])

  useEffect(() => {
    setLoading(true)
    propertyService.search({ ...localFilters, query: params.get('q') || undefined }).then((r) => {
      setResults(r)
      setLoading(false)
      setSelected(r[0] ?? null)
    })
  }, [localFilters, params])

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
      <SearchBar initialQuery={params.get('q') || ''} />

      <div className="mt-6 flex items-center justify-between">
        <p className="text-sm text-ink-light">
          {loading ? 'Searching…' : `${results.length} propert${results.length === 1 ? 'y' : 'ies'} found`}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center gap-1.5 rounded-full border border-stone-light px-3 py-1.5 text-sm text-ink-light lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
          <div className="flex overflow-hidden rounded-full border border-stone-light">
            <button
              onClick={() => setView('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium ${view === 'list' ? 'bg-ink text-parchment' : 'text-ink-light'}`}
            >
              <List className="h-4 w-4" /> List
            </button>
            <button
              onClick={() => setView('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium ${view === 'map' ? 'bg-ink text-parchment' : 'text-ink-light'}`}
            >
              <MapIcon className="h-4 w-4" /> Map
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block">
          <FilterPanel filters={localFilters} onChange={setLocalFilters} />
        </aside>

        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-50 flex flex-col justify-end bg-ink/50 lg:hidden">
            <div className="max-h-[85vh] overflow-y-auto rounded-t-2xl bg-parchment p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold text-ink">Filters</h3>
                <button onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="mt-4">
                <FilterPanel filters={localFilters} onChange={setLocalFilters} />
              </div>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="mt-4 w-full rounded-full bg-ink py-2.5 text-sm font-medium text-parchment"
              >
                Show {results.length} results
              </button>
            </div>
          </div>
        )}

        <div>
          {view === 'list' ? (
            loading ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="aspect-[4/3] animate-pulse rounded-md bg-stone-light" />
                ))}
              </div>
            ) : results.length ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {results.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            ) : (
              <div className="rounded-md border border-dashed border-stone-light py-20 text-center">
                <p className="font-display text-lg font-medium text-ink">No properties match these filters</p>
                <p className="mt-1 text-sm text-stone">Try widening your price range or removing a filter.</p>
              </div>
            )
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_320px]">
              <div className="relative aspect-[4/3] overflow-hidden rounded-md bg-verdant-light lg:aspect-auto">
                <svg className="absolute inset-0 h-full w-full opacity-30" viewBox="0 0 600 500" preserveAspectRatio="none">
                  <path d="M0 380 Q150 320 300 360 T600 320" stroke="#2f6f5e" strokeWidth="4" fill="none" />
                  <path d="M0 150 Q200 200 350 120 T600 180" stroke="#8a8577" strokeWidth="3" fill="none" />
                </svg>
                {results.map((p, i) => (
                  <button
                    key={p.id}
                    onClick={() => setSelected(p)}
                    style={{
                      left: `${15 + ((i * 137) % 70)}%`,
                      top: `${15 + ((i * 91) % 65)}%`,
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-full rounded-full px-2.5 py-1 text-xs font-semibold shadow-md transition-transform hover:scale-110 ${
                      selected?.id === p.id ? 'bg-rust text-white' : 'bg-white text-ink'
                    }`}
                  >
                    {formatNaira(p.price)}
                  </button>
                ))}
              </div>
              <div className="max-h-[70vh] space-y-4 overflow-y-auto">
                {selected && <PropertyCard property={selected} />}
                {results
                  .filter((p) => p.id !== selected?.id)
                  .slice(0, 4)
                  .map((p) => (
                    <button key={p.id} onClick={() => setSelected(p)} className="block w-full text-left">
                      <PropertyCard property={p} />
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
