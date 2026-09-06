import { Link } from 'react-router-dom'
import { BadgeCheck, Star } from 'lucide-react'
import type { Professional } from '../../types'

export default function ProfessionalCard({ pro }: { pro: Professional }) {
  return (
    <div className="flex flex-col rounded-md border border-stone-light bg-white p-5">
      <div className="flex items-center gap-3">
        <span
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full font-display text-xl font-semibold text-parchment"
          style={{ backgroundColor: pro.avatarColor }}
        >
          {pro.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
        </span>
        <div>
          <div className="flex items-center gap-1.5">
            <h3 className="font-display text-base font-semibold text-ink">{pro.name}</h3>
            {pro.verified && <BadgeCheck className="h-4 w-4 text-verdant" strokeWidth={2} />}
          </div>
          <p className="text-sm text-ink-light">{pro.category}</p>
          <p className="text-xs text-stone">{pro.company}</p>
        </div>
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-ink-light">{pro.bio}</p>

      <div className="mt-3 flex items-center gap-4 text-sm">
        <span className="flex items-center gap-1 font-medium text-ink">
          <Star className="h-3.5 w-3.5 fill-ochre text-ochre" /> {pro.rating}
        </span>
        <span className="text-stone">{pro.reviewCount} reviews</span>
        <span className="text-stone">{pro.yearsExperience} yrs exp.</span>
      </div>

      <p className="mt-2 text-xs text-stone">Serves {pro.statesServed.join(', ')}</p>

      <Link
        to={`/professionals/${pro.id}`}
        className="mt-4 rounded-full border border-stone-light py-2 text-center text-sm font-medium text-ink transition-colors hover:border-ochre-dark"
      >
        View profile
      </Link>
    </div>
  )
}
