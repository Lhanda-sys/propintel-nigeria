import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { BedDouble, Bath, Ruler, Car, Layers, CalendarClock, Scale, ChevronRight } from 'lucide-react'
import { propertyService } from '../services/propertyService'
import { formatFullNaira, formatSqm, buildingAge, conditionLabel } from '../lib/format'
import type { Property } from '../types'
import VerificationBadge from '../components/property/VerificationBadge'
import PropertyGallery from '../components/property/PropertyGallery'
import DocumentsPanel from '../components/property/DocumentsPanel'
import SellerCard from '../components/property/SellerCard'
import SimilarProperties from '../components/property/SimilarProperties'
import LocationPanel from '../components/property/LocationPanel'
import SuitabilityScore from '../components/ai/SuitabilityScore'
import AreaIntelligence from '../components/ai/AreaIntelligence'
import AIChat from '../components/ai/AIChat'

const professionalPrompts = [
  { role: 'Solicitor', reason: 'Confirm title and review outstanding documents' },
  { role: 'Surveyor', reason: 'Verify boundaries against the survey plan' },
  { role: 'Engineer', reason: 'Assess ground and structural condition' },
]

export default function PropertyDetails() {
  const { slug } = useParams()
  const [property, setProperty] = useState<Property | undefined>()
  const [similar, setSimilar] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    propertyService.getBySlug(slug ?? '').then(async (p) => {
      setProperty(p)
      setLoading(false)
      if (p) setSimilar(await propertyService.getSimilar(p))
    })
    window.scrollTo(0, 0)
  }, [slug])

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
        <div className="aspect-[16/9] animate-pulse rounded-md bg-stone-light" />
      </div>
    )
  }

  if (!property) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <p className="font-display text-2xl font-semibold text-ink">Property not found</p>
        <p className="mt-2 text-ink-light">It may have been sold or removed.</p>
        <Link to="/search" className="mt-6 inline-block rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-parchment">
          Back to search
        </Link>
      </div>
    )
  }

  const age = buildingAge(property.yearBuilt)

  const specs = [
    property.bedrooms !== undefined && { icon: BedDouble, label: `${property.bedrooms} Bedrooms` },
    property.bathrooms !== undefined && { icon: Bath, label: `${property.bathrooms} Bathrooms` },
    property.parkingSpaces !== undefined && { icon: Car, label: `${property.parkingSpaces} Parking` },
    property.floors !== undefined && { icon: Layers, label: `${property.floors} Floors` },
    { icon: Ruler, label: formatSqm(property.buildingSizeSqm ?? property.landSizeSqm) },
    property.yearBuilt && { icon: CalendarClock, label: age === 0 ? `Built ${property.yearBuilt}` : `${age} yrs old · Built ${property.yearBuilt}` },
    { icon: Scale, label: property.negotiable ? 'Price negotiable' : 'Fixed price' },
  ].filter(Boolean) as { icon: typeof BedDouble; label: string }[]

  return (
    <div className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
      <nav className="mb-4 flex items-center gap-1.5 text-sm text-stone">
        <Link to="/" className="hover:text-ink">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link to={`/search?category=${property.category}`} className="capitalize hover:text-ink">{property.category}</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-ink-light">{property.title}</span>
      </nav>

      <PropertyGallery images={property.images} title={property.title} />

      <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_340px]">
        <div className="space-y-8">
          {/* Title + price */}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <VerificationBadge score={property.verificationScore} size="md" />
              <span className="rounded-full bg-parchment-dim px-2.5 py-1 text-xs font-medium text-ink-light">
                {conditionLabel(property.condition)}
              </span>
              <span className="text-xs text-stone">{property.views.toLocaleString()} views · {property.saves} saves</span>
            </div>
            <h1 className="mt-3 font-display text-3xl font-semibold text-ink sm:text-4xl">{property.title}</h1>
            <p className="mt-1 text-ink-light">
              {property.address}, {property.neighbourhood}, {property.city}, {property.state} State
            </p>
            <p className="mt-3 font-display text-2xl font-semibold text-ink sm:text-3xl">
              {formatFullNaira(property.price)}
              {property.negotiable && <span className="ml-2 text-sm font-normal text-stone">negotiable</span>}
            </p>
          </div>

          {/* Key specs */}
          <div className="grid grid-cols-2 gap-3 rounded-md border border-stone-light bg-white p-5 sm:grid-cols-3">
            {specs.map((s) => (
              <div key={s.label} className="flex items-center gap-2 text-sm text-ink-light">
                <s.icon className="h-4 w-4 text-stone" strokeWidth={1.75} />
                {s.label}
              </div>
            ))}
          </div>

          {/* Description */}
          <div>
            <h2 className="font-display text-xl font-semibold text-ink">About this property</h2>
            <p className="mt-2 whitespace-pre-line leading-relaxed text-ink-light">{property.description}</p>
          </div>

          {/* AI Property Intelligence */}
          <div>
            <h2 className="font-display text-xl font-semibold text-ink">AI Property Intelligence</h2>
            <div className="mt-3">
              <SuitabilityScore scores={property.suitability} />
            </div>
          </div>

          {/* Area intelligence */}
          <AreaIntelligence area={property.areaProfile} />

          {/* AI chat */}
          <AIChat property={property} />

          {/* Location */}
          <LocationPanel property={property} />

          {/* Documents */}
          <DocumentsPanel property={property} />

          {/* Recommended professionals */}
          <div className="rounded-md border border-stone-light bg-white p-5 sm:p-6">
            <h3 className="font-display text-lg font-semibold text-ink">Need help with this property?</h3>
            <p className="mt-1 text-sm text-ink-light">Based on this property's stage, these professionals can help.</p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              {professionalPrompts.map((p) => (
                <Link
                  key={p.role}
                  to={`/professionals?category=${encodeURIComponent(p.role)}`}
                  className="rounded-md border border-stone-light p-3 transition-colors hover:border-ochre-dark"
                >
                  <p className="font-medium text-ink">{p.role}</p>
                  <p className="mt-0.5 text-xs text-stone">{p.reason}</p>
                </Link>
              ))}
            </div>
          </div>

          <SimilarProperties properties={similar} />
        </div>

        {/* Sidebar */}
        <div className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <SellerCard seller={property.seller} propertyTitle={property.title} />
          <Link
            to={`/compare?with=${property.slug}`}
            className="block rounded-md border border-dashed border-stone-light p-4 text-center text-sm font-medium text-ink-light transition-colors hover:border-ochre-dark hover:text-ink"
          >
            Add to comparison
          </Link>
        </div>
      </div>
    </div>
  )
}
