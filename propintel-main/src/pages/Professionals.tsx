import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { professionalService } from '../services'
import ProfessionalCard from '../components/professional/ProfessionalCard'
import type { Professional, ProfessionCategory } from '../types'

const categories: ProfessionCategory[] = [
  'Solicitor',
  'Surveyor',
  'Architect',
  'Civil Engineer',
  'Quantity Surveyor',
  'Estate Surveyor & Valuer',
  'Building Contractor',
  'Interior Designer',
  'Property Manager',
]

export default function Professionals() {
  const [params, setParams] = useSearchParams()
  const [pros, setPros] = useState<Professional[]>([])
  const activeCategory = params.get('category') || ''

  useEffect(() => {
    professionalService.search({ category: activeCategory || undefined }).then(setPros)
  }, [activeCategory])

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <h1 className="font-display text-3xl font-semibold text-ink">Find a real estate professional</h1>
      <p className="mt-2 max-w-2xl text-ink-light">
        Solicitors, surveyors, engineers, contractors and other verified professionals to help you buy, sell, build or
        renovate with confidence.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setParams({})}
          className={`rounded-full border px-3.5 py-1.5 text-sm font-medium ${!activeCategory ? 'border-ink bg-ink text-parchment' : 'border-stone-light text-ink-light'}`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setParams({ category: c })}
            className={`rounded-full border px-3.5 py-1.5 text-sm font-medium ${activeCategory === c ? 'border-ink bg-ink text-parchment' : 'border-stone-light text-ink-light'}`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {pros.map((p) => (
          <ProfessionalCard key={p.id} pro={p} />
        ))}
      </div>

      {!pros.length && (
        <div className="mt-10 rounded-md border border-dashed border-stone-light py-16 text-center">
          <p className="font-display text-lg font-medium text-ink">No professionals in this category yet</p>
          <p className="mt-1 text-sm text-stone">Try another category or check back soon.</p>
        </div>
      )}
    </div>
  )
}
