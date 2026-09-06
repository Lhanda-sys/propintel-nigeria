import { ShieldCheck, ShieldAlert, ShieldQuestion } from 'lucide-react'

export default function VerificationBadge({ score, size = 'sm' }: { score: number; size?: 'sm' | 'md' }) {
  const tier = score >= 80 ? 'verified' : score >= 50 ? 'partial' : 'low'
  const styles = {
    verified: 'bg-verdant text-white',
    partial: 'bg-ochre text-ink',
    low: 'bg-rust text-white',
  }[tier]
  const Icon = tier === 'verified' ? ShieldCheck : tier === 'partial' ? ShieldAlert : ShieldQuestion
  const label = tier === 'verified' ? 'Verified' : tier === 'partial' ? 'Partly verified' : 'Low verification'

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-medium ${styles} ${
        size === 'sm' ? 'text-xs' : 'text-sm'
      }`}
    >
      <Icon className={size === 'sm' ? 'h-3.5 w-3.5' : 'h-4 w-4'} strokeWidth={2} />
      {label}
    </span>
  )
}
