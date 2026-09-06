import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Search, MessageCircle, Sparkles, ScrollText } from 'lucide-react'
import { propertyService } from '../services/propertyService'
import StatCard from '../components/dashboard/StatCard'
import PropertyCard from '../components/property/PropertyCard'
import type { Property } from '../types'

export default function BuyerDashboard() {
  const [saved, setSaved] = useState<Property[]>([])
  const [recommended, setRecommended] = useState<Property[]>([])

  useEffect(() => {
    propertyService.list().then((all) => {
      setSaved([all[0], all[3], all[5]].filter(Boolean))
      setRecommended([all[1], all[6], all[8]].filter(Boolean))
    })
  }, [])

  const recentSearches = ['Land in Lekki', '4-bedroom in Abuja under ₦200m', 'Warehouse near Agbara']

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <h1 className="font-display text-3xl font-semibold text-ink">Welcome back, Tunde</h1>
      <p className="mt-1 text-ink-light">Here is what's happening with your property search.</p>

      <div className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Saved properties" value={saved.length} icon={Heart} accent="rust" />
        <StatCard label="Recent searches" value={recentSearches.length} icon={Search} accent="ink" />
        <StatCard label="Active conversations" value={2} icon={MessageCircle} accent="ochre" />
        <StatCard label="Verification requests" value={0} icon={ScrollText} accent="verdant" />
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="font-display text-xl font-semibold text-ink">Saved properties</h2>
        <Link to="/search" className="text-sm font-medium text-ink-light hover:text-ink">Browse more</Link>
      </div>
      {saved.length ? (
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((p) => <PropertyCard key={p.id} property={p} />)}
        </div>
      ) : (
        <div className="mt-4 rounded-md border border-dashed border-stone-light py-12 text-center">
          <p className="font-medium text-ink">You haven't saved any properties yet.</p>
          <Link to="/search" className="mt-3 inline-block rounded-full bg-ink px-4 py-2 text-sm font-medium text-parchment">Explore properties</Link>
        </div>
      )}

      <div className="mt-10 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-ochre-dark" />
        <h2 className="font-display text-xl font-semibold text-ink">Recommended for you</h2>
      </div>
      <p className="mt-1 text-sm text-ink-light">
        You viewed commercial land in Lekki — these have similar size, price and stronger commercial suitability scores.
      </p>
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {recommended.map((p) => <PropertyCard key={p.id} property={p} />)}
      </div>

      <div className="mt-10">
        <h2 className="font-display text-xl font-semibold text-ink">Recent searches</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {recentSearches.map((s) => (
            <Link key={s} to={`/search?q=${encodeURIComponent(s)}`} className="rounded-full border border-stone-light bg-white px-4 py-2 text-sm text-ink-light hover:border-ochre-dark hover:text-ink">
              {s}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
