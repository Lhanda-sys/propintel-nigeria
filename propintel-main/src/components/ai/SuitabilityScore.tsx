import { useState } from 'react'
import { ChevronDown, Sparkles } from 'lucide-react'
import type { SuitabilityScore as Score } from '../../types'

function ScoreRow({ item }: { item: Score }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="border-b border-stone-light py-3 last:border-0">
      <button
        onClick={() => setExpanded((v) => !v)}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <span className="font-medium text-ink">{item.use}</span>
        <span className="flex items-center gap-3">
          <span className="h-1.5 w-24 overflow-hidden rounded-full bg-stone-light sm:w-40">
            <span
              className="block h-full rounded-full bg-verdant"
              style={{ width: `${item.score}%` }}
            />
          </span>
          <span className="w-10 text-right font-display text-base font-semibold text-ink">{item.score}%</span>
          <ChevronDown className={`h-4 w-4 text-stone transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </span>
      </button>
      {expanded && (
        <ul className="mt-2 space-y-1.5 pl-1 text-sm text-ink-light">
          {item.reasons.map((r, i) => (
            <li key={i} className="flex gap-2">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ochre-dark" />
              {r}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function SuitabilityScore({ scores }: { scores: Score[] }) {
  const overall = Math.round(scores.reduce((s, x) => s + x.score, 0) / scores.length)

  return (
    <div className="rounded-md border border-stone-light bg-white p-5 sm:p-6">
      <div className="flex items-center gap-2 text-ink-light">
        <Sparkles className="h-4 w-4 text-ochre-dark" strokeWidth={1.75} />
        <span className="text-sm">AI Property Intelligence</span>
      </div>

      <div className="mt-3 flex items-end gap-4">
        <span className="font-display text-4xl font-semibold text-ink">{overall}%</span>
        <span className="mb-1.5 text-sm text-ink-light">overall development potential</span>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-stone-light">
        <div className="h-full rounded-full bg-gradient-to-r from-ochre to-verdant" style={{ width: `${overall}%` }} />
      </div>

      <div className="mt-5">
        {scores.map((s) => (
          <ScoreRow key={s.use} item={s} />
        ))}
      </div>

      <p className="mt-4 text-xs text-stone">
        AI-generated insight based on available location and property data. This is not
        professional planning, legal, valuation or engineering advice.
      </p>
    </div>
  )
}
