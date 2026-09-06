import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { X, Sparkles } from 'lucide-react'
import { propertyService } from '../services/propertyService'
import { aiService } from '../services/aiService'
import { formatNaira, formatSqm } from '../lib/format'
import type { Property } from '../types'

export default function Compare() {
  const [params] = useSearchParams()
  const [all, setAll] = useState<Property[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [aiAnswer, setAiAnswer] = useState<string | null>(null)
  const [question, setQuestion] = useState('')

  useEffect(() => {
    propertyService.list().then((list) => {
      setAll(list)
      const withSlug = params.get('with')
      const initial = withSlug ? list.find((p) => p.slug === withSlug) : list[0]
      setSelectedIds([initial?.id, list[1]?.id].filter((id): id is string => !!id && id !== undefined))
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const selected = selectedIds.map((id) => all.find((p) => p.id === id)).filter((p): p is Property => !!p)

  const addProperty = (id: string) => {
    if (selectedIds.length >= 3 || selectedIds.includes(id)) return
    setSelectedIds((s) => [...s, id])
  }
  const removeProperty = (id: string) => setSelectedIds((s) => s.filter((x) => x !== id))

  const rows: { label: string; render: (p: Property) => string }[] = [
    { label: 'Price', render: (p) => formatNaira(p.price) },
    { label: 'Size', render: (p) => formatSqm(p.buildingSizeSqm ?? p.landSizeSqm) },
    { label: 'Location', render: (p) => `${p.neighbourhood}, ${p.city}` },
    { label: 'Road access', render: (p) => p.areaProfile.roadAccessibility },
    { label: 'Electricity', render: (p) => `Band ${p.areaProfile.electricityBand}` },
    { label: 'Verification', render: (p) => `${p.verificationScore}%` },
    { label: 'Top AI use', render: (p) => `${p.suitability[0].use} — ${p.suitability[0].score}%` },
  ]

  const [conclusions, setConclusions] = useState<Awaited<ReturnType<typeof aiService.compareProperties>>>([])

  useEffect(() => {
    if (selected.length >= 2) aiService.compareProperties(selected).then(setConclusions)
  }, [selected.map((p) => p.id).join(',')])

  const askAI = async () => {
    if (!question.trim() || selected.length < 2) return
    setAiAnswer('Thinking…')
    const goal = /invest/i.test(question) ? 'investment' : /cheap|budget|low.?cost/i.test(question) ? 'lowest-cost' : undefined
    const compared = await aiService.compareProperties(selected, goal ? { goal } : undefined)
    setConclusions(compared)
    const best = [...compared].sort((a, b) => (b.topUse?.score ?? 0) - (a.topUse?.score ?? 0))[0]
    setAiAnswer(
      `Based on the available data, "${best.title}" shows the strongest fit for that kind of use, with a ${best.topUse?.use.toLowerCase()} suitability score of ${best.topUse?.score}%${best.bestFor.length ? ` — also standing out for: ${best.bestFor.join(', ').toLowerCase()}` : ''}. This is a data-driven estimate, not a professional recommendation — worth confirming with a surveyor or town planner before you commit.`
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 lg:px-8">
      <h1 className="font-display text-3xl font-semibold text-ink">Compare properties</h1>
      <p className="mt-1 text-ink-light">Compare up to 3 properties side by side.</p>

      {selected.length < 3 && (
        <div className="mt-5">
          <label className="text-sm font-medium text-ink">Add a property to compare</label>
          <select
            onChange={(e) => e.target.value && addProperty(e.target.value)}
            value=""
            className="mt-1.5 block w-full max-w-md rounded-md border border-stone-light px-3 py-2.5 text-sm outline-none focus:border-ochre-dark"
          >
            <option value="">Select a property…</option>
            {all.filter((p) => !selectedIds.includes(p.id)).map((p) => (
              <option key={p.id} value={p.id}>{p.title} — {p.neighbourhood}</option>
            ))}
          </select>
        </div>
      )}

      {selected.length >= 2 ? (
        <>
          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="w-32 py-3 text-left text-xs uppercase tracking-wide text-stone">Feature</th>
                  {selected.map((p) => (
                    <th key={p.id} className="border-l border-stone-light px-4 py-3 text-left">
                      <div className="flex items-start justify-between gap-2">
                        <Link to={`/properties/${p.slug}`} className="font-display font-semibold text-ink hover:text-ochre-dark">{p.title}</Link>
                        <button onClick={() => removeProperty(p.id)} aria-label="Remove"><X className="h-4 w-4 text-stone hover:text-rust" /></button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-t border-stone-light">
                    <td className="py-3 pr-4 font-medium text-ink-light">{row.label}</td>
                    {selected.map((p) => (
                      <td key={p.id} className="border-l border-stone-light px-4 py-3 text-ink">{row.render(p)}</td>
                    ))}
                  </tr>
                ))}
                <tr className="border-t border-stone-light align-top">
                  <td className="py-3 pr-4 font-medium text-ink-light">AI: best for</td>
                  {selected.map((p) => {
                    const c = conclusions.find((x) => x.id === p.id)
                    return (
                      <td key={p.id} className="border-l border-stone-light px-4 py-3">
                        <div className="flex flex-wrap gap-1.5">
                          {c?.bestFor.length ? c.bestFor.map((b) => (
                            <span key={b} className="rounded-full bg-verdant-light px-2 py-0.5 text-xs font-medium text-verdant">{b}</span>
                          )) : <span className="text-xs text-stone">—</span>}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-8 rounded-md border border-stone-light bg-white p-5">
            <div className="flex items-center gap-2 text-ink-light">
              <Sparkles className="h-4 w-4 text-ochre-dark" />
              <span className="text-sm font-medium">Ask AI to compare</span>
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); askAI() }}
              className="mt-3 flex flex-col gap-2 sm:flex-row"
            >
              <input
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g. Which property is better for building a shopping centre?"
                className="flex-1 rounded-full border border-stone-light px-4 py-2 text-sm outline-none focus:border-ochre-dark"
              />
              <button type="submit" className="rounded-full bg-ink px-5 py-2 text-sm font-medium text-parchment hover:bg-ink-light">Ask</button>
            </form>
            {aiAnswer && <p className="mt-4 rounded-md bg-parchment-dim p-4 text-sm text-ink">{aiAnswer}</p>}
          </div>
        </>
      ) : (
        <div className="mt-10 rounded-md border border-dashed border-stone-light py-16 text-center">
          <p className="font-medium text-ink">Add at least two properties to compare.</p>
        </div>
      )}
    </div>
  )
}
