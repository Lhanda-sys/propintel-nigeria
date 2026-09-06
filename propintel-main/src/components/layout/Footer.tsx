import { Link } from 'react-router-dom'
import { Landmark } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-stone-light bg-ink text-parchment">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <Landmark className="h-6 w-6 text-ochre" strokeWidth={1.75} />
              <span className="font-display text-xl font-semibold">PropIntel</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-parchment/70">
              A trusted Nigerian property marketplace connecting buyers, sellers and verified
              professionals — with location intelligence to help you decide with confidence.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-parchment">Marketplace</h3>
            <ul className="mt-4 space-y-3 text-sm text-parchment/70">
              <li><Link to="/search?category=land" className="hover:text-parchment">Land</Link></li>
              <li><Link to="/search?category=residential" className="hover:text-parchment">Residential</Link></li>
              <li><Link to="/search?category=commercial" className="hover:text-parchment">Commercial</Link></li>
              <li><Link to="/search?category=industrial" className="hover:text-parchment">Industrial</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-parchment">Platform</h3>
            <ul className="mt-4 space-y-3 text-sm text-parchment/70">
              <li><Link to="/professionals" className="hover:text-parchment">Find a professional</Link></li>
              <li><Link to="/map" className="hover:text-parchment">Map search</Link></li>
              <li><Link to="/dashboard/listings/new" className="hover:text-parchment">List a property</Link></li>
              <li><Link to="/compare" className="hover:text-parchment">Compare properties</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-parchment">Trust & safety</h3>
            <ul className="mt-4 space-y-3 text-sm text-parchment/70">
              <li>Document verification</li>
              <li>Verified sellers</li>
              <li>Report a listing</li>
              <li>Independent due diligence guide</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-parchment/15 pt-6 text-xs text-parchment/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Find Property, Understand Propery. Build Smarter.
          </p>
          <p>&copy; 2026 PropIntel Nigeria. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}
