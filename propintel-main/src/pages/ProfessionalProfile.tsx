import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { BadgeCheck, Star, MessageCircle, MapPin, GraduationCap } from 'lucide-react'
import { professionalService } from '../services'
import CACBadge from '../components/professional/CACBadge'
import type { Professional } from '../types'

export default function ProfessionalProfile() {
  const { id } = useParams()
  const [pro, setPro] = useState<Professional | undefined>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    professionalService.getById(id ?? '').then((p) => {
      setPro(p)
      setLoading(false)
    })
    window.scrollTo(0, 0)
  }, [id])

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-5 py-10">
        <div className="h-40 animate-pulse rounded-md bg-stone-light" />
      </div>
    )
  }

  if (!pro) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <p className="font-display text-2xl font-semibold text-ink">Professional not found</p>
        <Link to="/professionals" className="mt-6 inline-block rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-parchment">
          Back to professionals
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 lg:px-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
        <div>
          <div className="flex items-center gap-4">
            <span
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full font-display text-2xl font-semibold text-parchment"
              style={{ backgroundColor: pro.avatarColor }}
            >
              {pro.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl font-semibold text-ink sm:text-3xl">{pro.name}</h1>
                {pro.verified && <BadgeCheck className="h-5 w-5 text-verdant" strokeWidth={2} />}
              </div>
              <p className="text-ink-light">{pro.category} · {pro.company}</p>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-stone">
                <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5 fill-ochre text-ochre" /> {pro.rating} ({pro.reviewCount})</span>
                <span>{pro.yearsExperience} yrs experience</span>
                {pro.cacStatus && <CACBadge status={pro.cacStatus} />}
              </div>
            </div>
          </div>

          <p className="mt-6 leading-relaxed text-ink-light">{pro.bio}</p>

          <div className="mt-8">
            <h2 className="font-display text-lg font-semibold text-ink">Services</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {pro.services.map((s) => (
                <span key={s} className="rounded-full bg-parchment-dim px-3 py-1.5 text-sm text-ink-light">{s}</span>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
              <GraduationCap className="h-5 w-5 text-stone" /> Credentials
            </h2>
            <ul className="mt-3 space-y-1.5 text-sm text-ink-light">
              {pro.credentials.map((c) => (
                <li key={c} className="flex gap-2"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ochre-dark" />{c}</li>
              ))}
            </ul>
          </div>

          <div className="mt-8">
            <h2 className="font-display text-lg font-semibold text-ink">Portfolio</h2>
            <div className="mt-3 space-y-3">
              {pro.portfolio.map((item) => (
                <div key={item.title} className="rounded-md border border-stone-light bg-white p-4">
                  <p className="font-medium text-ink">{item.title}</p>
                  <p className="mt-1 text-sm text-ink-light">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center gap-2 text-sm text-ink-light">
            <MapPin className="h-4 w-4 text-stone" /> Serves {pro.statesServed.join(', ')}
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-md border border-stone-light bg-white p-5">
            <p className="text-sm text-ink-light">Usually responds within a few hours</p>
            <Link
              to={`/messages?new=${encodeURIComponent(pro.name)}`}
              className="mt-4 flex items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-medium text-parchment transition-colors hover:bg-ink-light"
            >
              <MessageCircle className="h-4 w-4" /> Chat with {pro.name.split(' ')[0]}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
