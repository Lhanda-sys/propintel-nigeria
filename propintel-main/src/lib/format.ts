export const formatNaira = (amount: number): string => {
  if (amount >= 1_000_000_000) return `\u20a6${(amount / 1_000_000_000).toFixed(amount % 1_000_000_000 === 0 ? 0 : 1)}bn`
  if (amount >= 1_000_000) return `\u20a6${(amount / 1_000_000).toFixed(amount % 1_000_000 === 0 ? 0 : 1)}m`
  return `\u20a6${amount.toLocaleString('en-NG')}`
}

export const formatFullNaira = (amount: number): string => `\u20a6${amount.toLocaleString('en-NG')}`

export const formatSqm = (sqm?: number): string => (sqm ? `${sqm.toLocaleString('en-NG')} sqm` : '')

export const buildingAge = (yearBuilt?: number): number | undefined => {
  if (!yearBuilt) return undefined
  return new Date().getFullYear() - yearBuilt
}

export const timeAgo = (dateStr: string): string => {
  const diffMs = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diffMs / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export const conditionLabel = (condition: string): string =>
  condition
    .split('-')
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ')
