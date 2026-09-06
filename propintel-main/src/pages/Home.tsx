import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, MapPinned, Sparkles, ScrollText, Handshake, ArrowRight } from 'lucide-react'
import SearchBar from '../components/search/SearchBar'
import PropertyCard from '../components/property/PropertyCard'
import { propertyService } from '../services/propertyService'
import { professionals } from '../data/professionals'
import type { Property } from '../types'

const exploreLocations = [
  { name: 'Lagos', seed: 'lagos-skyline' },
  { name: 'Abuja', seed: 'abuja-city' },
  { name: 'Port Harcourt', seed: 'ph-city' },
  { name: 'Ibadan', seed: 'ibadan-city' },
  { name: 'Enugu', seed: 'enugu-city' },
  { name: 'Kaduna', seed: 'kaduna-city' },
]

const steps = [
  { title: 'Find a property', description: 'Search by location, price, type or the use you have in mind.' },
  { title: 'Inspect the details', description: 'Photos, floor plans, size and full property specification.' },
  { title: 'Check the documents', description: 'See what has been uploaded and its verification status.' },
  { title: 'Understand the location', description: 'Road access, electricity, and what the AI expects the area to support.' },
  { title: 'Consult a professional', description: 'Bring in a solicitor, surveyor or engineer before you commit.' },
  { title: 'Decide with confidence', description: 'Chat directly with the seller and move at your own pace.' },
]

export default function Home() {
  const [featured, setFeatured] = useState<Property[]>([])
  const [verified, setVerified] = useState<Property[]>([])

  useEffect(() => {
    propertyService.getFeatured().then(setFeatured)
    propertyService.search({ verifiedOnly: true }).then((r) => setVerified(r.slice(0, 3)))
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-stone-light bg-gradient-to-b from-parchment-dim to-parchment px-5 pb-16 pt-14 lg:px-8 lg:pt-20">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            Find property. Understand property. Build smarter.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-ink-light">
            Discover land, homes, commercial and industrial property across Nigeria — backed by document verification
            and location intelligence, not just listings.
          </p>
        </div>
        <div className="mx-auto mt-9 max-w-3xl">
          <SearchBar large />
        </div>
        <div className="mx-auto mt-6 flex max-w-3xl flex-wrap justify-center gap-2">
          {[
            { label: 'Land', to: '/search?category=land' },
            { label: 'Homes', to: '/search?category=residential' },
            { label: 'Commercial', to: '/search?category=commercial' },
            { label: 'Industrial', to: '/search?category=industrial' },
            { label: 'Find professionals', to: '/professionals' },
          ].map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className="rounded-full border border-stone-light bg-white px-4 py-1.5 text-sm font-medium text-ink-light transition-colors hover:border-ochre-dark hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured properties */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Featured properties</h2>
            <p className="mt-1 text-ink-light">Hand-picked listings with strong verification and AI suitability scores.</p>
          </div>
          <Link to="/search" className="hidden items-center gap-1 text-sm font-medium text-ink-light hover:text-ink sm:flex">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </section>

      {/* Explore by location */}
      <section className="border-y border-stone-light bg-parchment-dim px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Explore by location</h2>
          <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {exploreLocations.map((l) => (
              <Link
                key={l.name}
                to={`/search?state=${encodeURIComponent(l.name === 'Abuja' ? 'FCT' : l.name)}`}
                className="group relative aspect-[4/5] overflow-hidden rounded-md"
              >
                <img
                  src={`https://picsum.photos/seed/${l.seed}/300/380`}
                  alt=""
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent" />
                <span className="absolute bottom-3 left-3 font-display text-lg font-semibold text-parchment">{l.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI intelligence pitch */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-verdant-light px-3 py-1 text-sm font-medium text-verdant">
              <Sparkles className="h-3.5 w-3.5" /> AI Property Intelligence
            </span>
            <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-ink">
              Don't just buy land. Know what it can become.
            </h2>
            <p className="mt-3 text-ink-light">
              Every listing includes a suitability breakdown across residential, commercial, hospitality and
              industrial use — each score explained in plain language, using location, accessibility, electricity
              and surrounding development as inputs. It's guidance, not a substitute for professional advice.
            </p>
            <Link
              to="/search"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-parchment hover:bg-ink-light"
            >
              See it on a listing <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="rounded-md border border-stone-light bg-white p-6">
            <div className="text-sm text-stone">Sample — 5-Acre Commercial Land, Lekki Phase 2</div>
            {[
              { use: 'Commercial Development', score: 91 },
              { use: 'Hospitality', score: 84 },
              { use: 'Residential Estate', score: 68 },
              { use: 'Industrial Warehouse', score: 39 },
            ].map((s) => (
              <div key={s.use} className="mt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-ink">{s.use}</span>
                  <span className="font-medium text-ink">{s.score}%</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-stone-light">
                  <div className="h-full rounded-full bg-gradient-to-r from-ochre to-verdant" style={{ width: `${s.score}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verified properties */}
      <section className="border-y border-stone-light bg-parchment-dim px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-verdant" />
            <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Verified properties</h2>
          </div>
          <p className="mt-1 text-ink-light">Listings with the strongest document verification scores on the platform.</p>
          <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {verified.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Find a professional */}
      <section className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="flex items-center gap-2">
          <Handshake className="h-5 w-5 text-ochre-dark" />
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">Find a professional</h2>
        </div>
        <p className="mt-1 text-ink-light">Solicitors, surveyors, engineers and contractors, verified and reviewed.</p>
        <div className="mt-7 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {professionals.slice(0, 6).map((p) => (
            <Link
              key={p.id}
              to={`/professionals/${p.id}`}
              className="flex flex-col items-center gap-2 rounded-md border border-stone-light bg-white p-4 text-center transition-colors hover:border-ochre-dark"
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full font-display text-base font-semibold text-parchment"
                style={{ backgroundColor: p.avatarColor }}
              >
                {p.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
              </span>
              <span className="text-xs font-medium text-ink">{p.category}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-stone-light bg-ink px-5 py-16 text-parchment lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-2">
            <MapPinned className="h-5 w-5 text-ochre" />
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">How it works</h2>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="rounded-md border border-parchment/15 p-5">
                <span className="font-display text-2xl font-semibold text-ochre">{i + 1}</span>
                <h3 className="mt-2 font-display text-lg font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-parchment/70">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust footer strip */}
      <section className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-5 py-14 text-center lg:px-8">
        <ScrollText className="h-6 w-6 text-stone" strokeWidth={1.5} />
        <p className="max-w-xl text-sm text-stone">
          AI insights and verification scores support your decision-making — they do not replace independent legal,
          valuation or engineering advice from a qualified professional.
        </p>
      </section>
    </div>
  )
}
