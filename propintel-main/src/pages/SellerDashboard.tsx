import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Home, Eye, MessageSquare, ShieldCheck, Plus } from 'lucide-react'
import { propertyService } from '../services/propertyService'
import StatCard from '../components/dashboard/StatCard'
import VerificationBadge from '../components/property/VerificationBadge'
import { formatNaira } from '../lib/format'
import type { Property } from '../types'

export default function SellerDashboard() {
  const [listings, setListings] = useState<Property[]>([])

  useEffect(() => {
    propertyService.list().then((all) => setListings(all.slice(0, 5)))
  }, [])

  const totalViews = listings.reduce((s, p) => s + p.views, 0)

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">Seller dashboard</h1>
          <p className="mt-1 text-ink-light">Adeyemi Land Ventures</p>
        </div>
        <Link to="/dashboard/listings/new" className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-parchment hover:bg-ink-light">
          <Plus className="h-4 w-4" /> List a property
        </Link>
      </div>

      <div className="mt-7 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Active listings" value={listings.length} icon={Home} accent="ink" />
        <StatCard label="Total views" value={totalViews.toLocaleString()} icon={Eye} accent="ochre" />
        <StatCard label="New enquiries" value={4} icon={MessageSquare} accent="verdant" />
        <StatCard label="Avg. verification" value={`${Math.round(listings.reduce((s, p) => s + p.verificationScore, 0) / (listings.length || 1))}`} icon={ShieldCheck} accent="rust" />
      </div>

      <h2 className="mt-10 font-display text-xl font-semibold text-ink">My listings</h2>
      <div className="mt-4 overflow-x-auto rounded-md border border-stone-light bg-white">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="border-b border-stone-light bg-parchment-dim text-xs uppercase tracking-wide text-stone">
            <tr>
              <th className="px-4 py-3 font-medium">Property</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Views</th>
              <th className="px-4 py-3 font-medium">Saves</th>
              <th className="px-4 py-3 font-medium">Verification</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {listings.map((p) => (
              <tr key={p.id} className="border-b border-stone-light last:border-0 hover:bg-parchment-dim/50">
                <td className="px-4 py-3">
                  <Link to={`/properties/${p.slug}`} className="flex items-center gap-3">
                    <img src={p.images[0]} alt="" className="h-10 w-14 rounded object-cover" />
                    <span className="font-medium text-ink">{p.title}</span>
                  </Link>
                </td>
                <td className="px-4 py-3 text-ink-light">{formatNaira(p.price)}</td>
                <td className="px-4 py-3 text-ink-light">{p.views.toLocaleString()}</td>
                <td className="px-4 py-3 text-ink-light">{p.saves}</td>
                <td className="px-4 py-3"><VerificationBadge score={p.verificationScore} /></td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-verdant-light px-2.5 py-1 text-xs font-medium text-verdant">Active</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="mt-10 font-display text-xl font-semibold text-ink">Verification queue</h2>
      <div className="mt-4 space-y-3">
        {listings.flatMap((p) => p.documents.filter((d) => d.status !== 'verified').map((d) => ({ p, d }))).map(({ p, d }) => (
          <div key={d.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-stone-light bg-white p-4">
            <div>
              <p className="font-medium text-ink">{d.type} — {p.title}</p>
              <p className="text-xs text-stone">{d.authority ?? 'Authority pending assignment'}</p>
            </div>
            <span className="rounded-full bg-ochre px-3 py-1 text-xs font-medium text-ink">{d.status.replace('-', ' ')}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
