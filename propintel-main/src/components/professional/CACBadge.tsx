import { BadgeCheck, Clock, HelpCircle, XCircle } from 'lucide-react'
import type { CACStatus } from '../../types'

const meta: Record<CACStatus, { label: string; className: string; icon: typeof BadgeCheck }> = {
  verified: { label: 'CAC Verified', className: 'bg-verdant text-white', icon: BadgeCheck },
  'under-review': { label: 'CAC Under Review', className: 'bg-ochre text-ink', icon: Clock },
  submitted: { label: 'CAC Submitted', className: 'bg-parchment-dim text-ink-light', icon: Clock },
  'not-submitted': { label: 'CAC Not Submitted', className: 'bg-stone-light text-stone', icon: HelpCircle },
  rejected: { label: 'CAC Rejected', className: 'bg-rust text-white', icon: XCircle },
}

export default function CACBadge({ status }: { status: CACStatus }) {
  const m = meta[status]
  const Icon = m.icon
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${m.className}`}>
      <Icon className="h-3.5 w-3.5" strokeWidth={2} />
      {m.label}
    </span>
  )
}
