import type { LucideIcon } from 'lucide-react'

export default function StatCard({
  label,
  value,
  icon: Icon,
  accent = 'ink',
}: {
  label: string
  value: string | number
  icon: LucideIcon
  accent?: 'ink' | 'verdant' | 'ochre' | 'rust'
}) {
  const colors: Record<string, string> = {
    ink: 'bg-ink text-parchment',
    verdant: 'bg-verdant-light text-verdant',
    ochre: 'bg-parchment-dim text-ochre-dark',
    rust: 'bg-rust-light text-rust',
  }
  return (
    <div className="flex items-center gap-4 rounded-md border border-stone-light bg-white p-5">
      <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${colors[accent]}`}>
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </span>
      <div>
        <div className="font-display text-2xl font-semibold text-ink">{value}</div>
        <div className="text-sm text-stone">{label}</div>
      </div>
    </div>
  )
}
