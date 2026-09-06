import { Link } from 'react-router-dom'
import { Heart, BedDouble, Bath, Ruler } from 'lucide-react'
import type { Property } from '../../types'
import { formatNaira, formatSqm, buildingAge, conditionLabel } from '../../lib/format'
import VerificationBadge from './VerificationBadge'

export default function PropertyCard({ property }: { property: Property }) {
  const age = buildingAge(property.yearBuilt)
  const topScore = property.suitability[0]

  return (
    <Link
      to={`/properties/${property.slug}`}
      className="group flex flex-col overflow-hidden rounded-md border border-stone-light bg-white transition-colors hover:border-ochre-dark"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-light">
        <img
          src={property.images[0]}
          alt={property.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <div className="absolute left-3 top-3">
          <VerificationBadge score={property.verificationScore} />
        </div>
        <button
          onClick={(e) => e.preventDefault()}
          aria-label="Save property"
          className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-ink-light transition-colors hover:text-rust"
        >
          <Heart className="h-4 w-4" strokeWidth={2} />
        </button>
        {property.condition !== 'fairly-used' && (
          <div className="absolute bottom-3 left-3 rounded-full bg-ink/85 px-2.5 py-1 text-xs font-medium text-parchment">
            {conditionLabel(property.condition)}
            {age !== undefined && property.condition !== 'new' && property.condition !== 'newly-built' ? ` \u00b7 ${age} yrs` : ''}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 font-display text-lg font-medium leading-snug text-ink">{property.title}</h3>
        <p className="text-sm text-ink-light">
          {property.neighbourhood}, {property.city}
        </p>

        <p className="mt-1 font-display text-xl font-semibold text-ink">
          {formatNaira(property.price)}
          {property.negotiable && <span className="ml-1.5 text-xs font-normal text-stone">negotiable</span>}
        </p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-light">
          {property.bedrooms !== undefined && (
            <span className="inline-flex items-center gap-1">
              <BedDouble className="h-4 w-4" strokeWidth={1.75} /> {property.bedrooms}
            </span>
          )}
          {property.bathrooms !== undefined && (
            <span className="inline-flex items-center gap-1">
              <Bath className="h-4 w-4" strokeWidth={1.75} /> {property.bathrooms}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Ruler className="h-4 w-4" strokeWidth={1.75} />
            {formatSqm(property.buildingSizeSqm ?? property.landSizeSqm)}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-stone-light pt-3">
          <span className="text-sm text-stone">Best AI-suggested use</span>
          <span className="font-display text-base font-semibold text-verdant">
            {topScore.use} {topScore.score}%
          </span>
        </div>
      </div>
    </Link>
  )
}
