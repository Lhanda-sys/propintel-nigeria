import type { AreaProfile } from '../../types'

export default function AreaIntelligence({ area }: { area: AreaProfile }) {
  const stats: { label: string; value: string }[] = [
    { label: 'Economic activity', value: area.economicActivity },
    { label: 'Residential density', value: area.residentialDensity },
    { label: 'Commercial activity', value: area.commercialActivity },
    { label: 'Industrial activity', value: area.industrialActivity },
    { label: 'Development trend', value: area.developmentTrend },
    { label: 'Road accessibility', value: area.roadAccessibility },
    { label: 'Electricity band', value: `Band ${area.electricityBand}` },
    { label: 'Estimated supply', value: area.estimatedSupplyHours },
  ]

  const counts: { label: string; value: number }[] = [
    { label: 'Landmarks nearby', value: area.nearbyLandmarks },
    { label: 'Schools nearby', value: area.schoolsNearby },
    { label: 'Hospitals nearby', value: area.hospitalsNearby },
    { label: 'Major roads nearby', value: area.majorRoadsNearby },
  ]

  return (
    <div className="rounded-md border border-stone-light bg-white p-5 sm:p-6">
      <h3 className="font-display text-lg font-semibold text-ink">Location intelligence</h3>

      <dl className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label}>
            <dt className="text-xs text-stone">{s.label}</dt>
            <dd className="mt-0.5 font-medium text-ink">{s.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-stone-light pt-5 sm:grid-cols-4">
        {counts.map((c) => (
          <div key={c.label} className="rounded-md bg-parchment-dim p-3 text-center">
            <div className="font-display text-2xl font-semibold text-ink">{c.value}</div>
            <div className="text-xs text-stone">{c.label}</div>
          </div>
        ))}
      </div>

      <p className="mt-5 rounded-md bg-verdant-light p-3 text-sm text-ink">
        <span className="font-medium">AI interpretation: </span>
        {area.interpretation}
      </p>
    </div>
  )
}
