import type { Property } from '../../types'
import PropertyCard from './PropertyCard'

export default function SimilarProperties({ properties }: { properties: Property[] }) {
  if (!properties.length) return null
  return (
    <div>
      <h3 className="font-display text-lg font-semibold text-ink">Similar properties</h3>
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>
    </div>
  )
}
