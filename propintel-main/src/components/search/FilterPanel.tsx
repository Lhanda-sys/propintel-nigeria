import type { PropertyCategory } from '../../types'
import StateSelect from '../ui/StateSelect'

export interface Filters {
  category?: PropertyCategory
  state?: string
  maxPrice?: number
  bedrooms?: number
  verifiedOnly?: boolean
}

const categories: { value: PropertyCategory; label: string }[] = [
  { value: 'land', label: 'Land' },
  { value: 'residential', label: 'Residential' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'industrial', label: 'Industrial' },
]

const priceCaps = [
  { label: 'Any price', value: undefined },
  { label: 'Under ₦50m', value: 50_000_000 },
  { label: 'Under ₦150m', value: 150_000_000 },
  { label: 'Under ₦500m', value: 500_000_000 },
  { label: 'Under ₦1bn', value: 1_000_000_000 },
]

export default function FilterPanel({ filters, onChange }: { filters: Filters; onChange: (f: Filters) => void }) {
  return (
    <div className="space-y-6 rounded-md border border-stone-light bg-white p-5">
      <div>
        <h4 className="text-sm font-semibold text-ink">Property type</h4>
        <div className="mt-2.5 flex flex-wrap gap-2">
          <button
            onClick={() => onChange({ ...filters, category: undefined })}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium ${!filters.category ? 'border-ink bg-ink text-parchment' : 'border-stone-light text-ink-light'}`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.value}
              onClick={() => onChange({ ...filters, category: c.value })}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium ${filters.category === c.value ? 'border-ink bg-ink text-parchment' : 'border-stone-light text-ink-light'}`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-ink">State</h4>
        <div className="mt-2.5">
          <StateSelect
            value={filters.state ?? ''}
            onChange={(s) => onChange({ ...filters, state: s || undefined })}
            allowAny
            placeholder="Any state"
          />
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-ink">Price</h4>
        <select
          value={filters.maxPrice ?? ''}
          onChange={(e) => onChange({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
          className="mt-2.5 w-full rounded-md border border-stone-light bg-parchment px-3 py-2 text-sm text-ink outline-none focus:border-ochre-dark"
        >
          {priceCaps.map((p) => (
            <option key={p.label} value={p.value ?? ''}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-ink">Bedrooms</h4>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {[undefined, 1, 2, 3, 4, 5].map((b) => (
            <button
              key={b ?? 'any'}
              onClick={() => onChange({ ...filters, bedrooms: b })}
              className={`h-8 w-10 rounded-full border text-xs font-medium ${filters.bedrooms === b ? 'border-ink bg-ink text-parchment' : 'border-stone-light text-ink-light'}`}
            >
              {b ? `${b}+` : 'Any'}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 border-t border-stone-light pt-4 text-sm text-ink">
        <input
          type="checkbox"
          checked={!!filters.verifiedOnly}
          onChange={(e) => onChange({ ...filters, verifiedOnly: e.target.checked })}
          className="h-4 w-4 rounded border-stone-light accent-verdant"
        />
        Verified properties only
      </label>
    </div>
  )
}
