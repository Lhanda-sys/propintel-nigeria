import { Link } from 'react-router-dom'
import { BadgeCheck, MessageCircle, Star } from 'lucide-react'
import type { Seller } from '../../types'

export default function SellerCard({ seller, propertyTitle }: { seller: Seller; propertyTitle: string }) {
  return (
    <div className="rounded-md border border-stone-light bg-white p-5">
      <div className="flex items-center gap-3">
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-display text-lg font-semibold text-parchment"
          style={{ backgroundColor: seller.avatarColor }}
        >
          {seller.name.charAt(0)}
        </span>
        <div>
          <div className="flex items-center gap-1.5">
            <h4 className="font-display text-base font-semibold text-ink">{seller.name}</h4>
            {seller.verified && <BadgeCheck className="h-4 w-4 text-verdant" strokeWidth={2} />}
          </div>
          <p className="text-sm text-stone">{seller.type} seller · {seller.yearsOnPlatform} yrs on PropIntel</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 border-y border-stone-light py-3 text-center">
        <div>
          <div className="flex items-center justify-center gap-1 font-display text-base font-semibold text-ink">
            <Star className="h-3.5 w-3.5 fill-ochre text-ochre" /> {seller.rating}
          </div>
          <div className="text-xs text-stone">{seller.reviewCount} reviews</div>
        </div>
        <div>
          <div className="font-display text-base font-semibold text-ink">{seller.activeListings}</div>
          <div className="text-xs text-stone">Active listings</div>
        </div>
        <div>
          <div className="font-display text-base font-semibold text-ink">{seller.responseRate}%</div>
          <div className="text-xs text-stone">Response rate</div>
        </div>
      </div>

      <p className="mt-3 text-sm text-ink-light">Usually responds within {seller.responseTime}.</p>

      <Link
        to={`/messages?new=${encodeURIComponent(seller.name)}&property=${encodeURIComponent(propertyTitle)}`}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-parchment transition-colors hover:bg-ink-light"
      >
        <MessageCircle className="h-4 w-4" strokeWidth={1.75} />
        Chat with seller
      </Link>
    </div>
  )
}
