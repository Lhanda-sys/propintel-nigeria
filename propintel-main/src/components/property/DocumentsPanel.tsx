import { CheckCircle2, Clock, AlertTriangle, HelpCircle, XCircle } from 'lucide-react'
import type { Property, VerificationStatus } from '../../types'

const statusMeta: Record<VerificationStatus, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  verified: { label: 'Verified', color: 'text-verdant', icon: CheckCircle2 },
  pending: { label: 'Verification pending', color: 'text-ochre-dark', icon: Clock },
  'under-review': { label: 'Under review', color: 'text-ochre-dark', icon: Clock },
  submitted: { label: 'Submitted', color: 'text-ink-light', icon: Clock },
  'not-submitted': { label: 'Not submitted', color: 'text-stone', icon: HelpCircle },
  'requires-info': { label: 'Requires more information', color: 'text-rust', icon: AlertTriangle },
  rejected: { label: 'Rejected', color: 'text-rust', icon: XCircle },
}

export default function DocumentsPanel({ property }: { property: Property }) {
  const verifiedCount = property.documents.filter((d) => d.status === 'verified').length

  return (
    <div className="rounded-md border border-stone-light bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-lg font-semibold text-ink">Property verification</h3>
        <div className="flex items-center gap-2">
          <span className="font-display text-2xl font-semibold text-ink">{property.verificationScore}</span>
          <span className="text-sm text-stone">/ 100</span>
        </div>
      </div>

      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-stone-light">
        <div
          className={`h-full rounded-full ${property.verificationScore >= 80 ? 'bg-verdant' : property.verificationScore >= 50 ? 'bg-ochre' : 'bg-rust'}`}
          style={{ width: `${property.verificationScore}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-stone">
        {verifiedCount} of {property.documents.length} submitted documents verified. Verification does not guarantee title or ownership.
      </p>

      <ul className="mt-5 divide-y divide-stone-light border-t border-stone-light">
        {property.documents.map((doc) => {
          const meta = statusMeta[doc.status]
          const Icon = meta.icon
          return (
            <li key={doc.id} className="flex items-start gap-3 py-3">
              <Icon className={`mt-0.5 h-4.5 w-4.5 shrink-0 ${meta.color}`} strokeWidth={1.75} />
              <div className="flex-1">
                <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-0.5">
                  <span className="font-medium text-ink">{doc.type}</span>
                  <span className={`text-sm font-medium ${meta.color}`}>{meta.label}</span>
                </div>
                <p className="text-xs text-stone">
                  {doc.authority && `${doc.authority} · `}
                  {doc.reference && `Ref ${doc.reference} · `}
                  {doc.verifiedDate
                    ? `Verified ${new Date(doc.verifiedDate).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}`
                    : doc.submittedDate
                      ? `Submitted ${new Date(doc.submittedDate).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}`
                      : ''}
                </p>
                {doc.notes && <p className="mt-1 text-xs text-ink-light">{doc.notes}</p>}
              </div>
            </li>
          )
        })}
      </ul>

      <p className="mt-4 rounded-md bg-parchment-dim p-3 text-xs text-ink-light">
        Platform verification reflects checks against the relevant state land authority where available. Buyers should
        still commission independent legal due diligence before any transaction.
      </p>
    </div>
  )
}
