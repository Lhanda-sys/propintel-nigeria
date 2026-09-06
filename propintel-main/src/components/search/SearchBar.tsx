import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import StateSelect from '../ui/StateSelect'

export default function SearchBar({ initialQuery = '', large = false }: { initialQuery?: string; large?: boolean }) {
  const [query, setQuery] = useState(initialQuery)
  const [location, setLocation] = useState('')
  const navigate = useNavigate()

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    if (location) params.set('state', location)
    navigate(`/search?${params.toString()}`)
  }

  return (
    <form
      onSubmit={submit}
      className={`flex w-full flex-col gap-2 rounded-2xl bg-white p-2 shadow-lg shadow-ink/5 sm:flex-row sm:items-center sm:gap-0 sm:rounded-full ${
        large ? '' : ''
      }`}
    >
      <div className="flex flex-1 items-center gap-3 rounded-full px-4 py-2.5">
        <Search className="h-5 w-5 shrink-0 text-stone" strokeWidth={1.75} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Land in Lekki, warehouse near Agbara, 4-bedroom in Abuja…"
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-stone"
        />
      </div>
      <div className="hidden h-8 w-px bg-stone-light sm:block" />
      <div className="border-t border-stone-light px-2 py-1.5 sm:min-w-[180px] sm:border-t-0">
        <StateSelect value={location} onChange={setLocation} allowAny placeholder="All of Nigeria" />
      </div>
      <button
        type="submit"
        className="m-1 shrink-0 rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-parchment transition-colors hover:bg-ink-light"
      >
        Search
      </button>
    </form>
  )
}
