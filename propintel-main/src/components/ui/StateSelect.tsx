import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Search } from 'lucide-react'
import { NIGERIAN_STATE_NAMES } from '../../data/nigeriaStates'

export default function StateSelect({
  value,
  onChange,
  placeholder = 'Select a state',
  allowAny = false,
}: {
  value: string
  onChange: (state: string) => void
  placeholder?: string
  allowAny?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const options = (allowAny ? ['Any state', ...NIGERIAN_STATE_NAMES] : NIGERIAN_STATE_NAMES).filter((s) =>
    s.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-md border border-stone-light bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-ochre-dark"
      >
        <span className={value ? 'text-ink' : 'text-stone'}>{value || placeholder}</span>
        <ChevronDown className="h-4 w-4 text-stone" />
      </button>

      {open && (
        <div className="absolute z-30 mt-1 w-full rounded-md border border-stone-light bg-white shadow-lg">
          <div className="flex items-center gap-2 border-b border-stone-light px-3 py-2">
            <Search className="h-4 w-4 text-stone" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search states…"
              className="w-full text-sm outline-none"
            />
          </div>
          <ul className="max-h-56 overflow-y-auto py-1">
            {options.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(s === 'Any state' ? '' : s)
                    setOpen(false)
                    setQuery('')
                  }}
                  className={`block w-full px-3 py-2 text-left text-sm hover:bg-parchment-dim ${value === s ? 'font-medium text-ochre-dark' : 'text-ink'}`}
                >
                  {s}
                </button>
              </li>
            ))}
            {!options.length && <li className="px-3 py-2 text-sm text-stone">No matching states</li>}
          </ul>
        </div>
      )}
    </div>
  )
}
