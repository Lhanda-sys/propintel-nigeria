import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, MapPin, Upload, Landmark, Building2, Factory, Wrench, Briefcase, TreeDeciduous } from 'lucide-react'
import { buildingAge } from '../lib/format'
import StateSelect from '../components/ui/StateSelect'

type StepId = 'type' | 'basics' | 'location' | 'documents' | 'review'
const steps: { id: StepId; label: string }[] = [
  { id: 'type', label: 'Property type' },
  { id: 'basics', label: 'Basic information' },
  { id: 'location', label: 'Location' },
  { id: 'documents', label: 'Documents' },
  { id: 'review', label: 'Review & publish' },
]

const propertyTypes = [
  { id: 'land', label: 'Land', icon: TreeDeciduous },
  { id: 'residential', label: 'Residential Property', icon: Landmark },
  { id: 'commercial', label: 'Commercial Property', icon: Building2 },
  { id: 'industrial', label: 'Industrial Property', icon: Factory },
  { id: 'equipment', label: 'Equipment', icon: Wrench },
  { id: 'business', label: 'Business / Company', icon: Briefcase },
]

const docChecklist = ['Certificate of Occupancy', 'Survey Plan', 'Deed of Assignment', 'Approved Building Plan']

export default function ListingWizard() {
  const navigate = useNavigate()
  const [stepIndex, setStepIndex] = useState(0)
  const [type, setType] = useState('')
  const [condition, setCondition] = useState<'new' | 'old'>('new')
  const [yearBuilt, setYearBuilt] = useState<number | ''>('')
  const [title, setTitle] = useState('')
  const [price, setPrice] = useState('')
  const [state, setState] = useState('Lagos')
  const [pinDropped, setPinDropped] = useState(false)
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)

  const step = steps[stepIndex]
  const age = typeof yearBuilt === 'number' ? buildingAge(yearBuilt) : undefined

  const trustScore = useMemo(() => {
    let score = 10 // identity baseline
    if (title.trim().length > 4) score += 10
    if (price) score += 10
    if (pinDropped) score += 15
    score += uploadedDocs.length * (65 / docChecklist.length)
    return Math.min(100, Math.round(score))
  }, [title, price, pinDropped, uploadedDocs])

  const toggleDoc = (doc: string) =>
    setUploadedDocs((prev) => (prev.includes(doc) ? prev.filter((d) => d !== doc) : [...prev, doc]))

  const canProceed = () => {
    if (step.id === 'type') return !!type
    if (step.id === 'basics') return title.trim().length > 3 && !!price
    if (step.id === 'location') return pinDropped
    return true
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-verdant-light text-verdant">
          <Check className="h-7 w-7" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-semibold text-ink">Listing submitted</h1>
        <p className="mt-2 text-ink-light">
          "{title || 'Your property'}" has been created with a starting trust score of {trustScore}/100. Documents you
          marked as uploaded now show as "Submitted" and will move to "Verification Pending" once reviewed.
        </p>
        <button
          onClick={() => navigate('/dashboard/seller')}
          className="mt-6 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-parchment hover:bg-ink-light"
        >
          Go to seller dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 lg:px-8">
      <h1 className="font-display text-3xl font-semibold text-ink">List a property</h1>

      {/* Stepper */}
      <ol className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-b border-stone-light pb-5">
        {steps.map((s, i) => (
          <li key={s.id} className={`flex items-center gap-2 text-sm ${i === stepIndex ? 'font-semibold text-ink' : i < stepIndex ? 'text-verdant' : 'text-stone'}`}>
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${i === stepIndex ? 'bg-ink text-parchment' : i < stepIndex ? 'bg-verdant text-white' : 'bg-stone-light text-stone'}`}>
              {i < stepIndex ? <Check className="h-3 w-3" /> : i + 1}
            </span>
            {s.label}
          </li>
        ))}
      </ol>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_260px]">
        <div>
          {step.id === 'type' && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {propertyTypes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setType(t.id)}
                  className={`flex flex-col items-center gap-2 rounded-md border p-6 text-center transition-colors ${type === t.id ? 'border-ochre-dark bg-parchment-dim' : 'border-stone-light hover:border-stone'}`}
                >
                  <t.icon className="h-6 w-6 text-ink-light" strokeWidth={1.5} />
                  <span className="text-sm font-medium text-ink">{t.label}</span>
                </button>
              ))}
            </div>
          )}

          {step.id === 'basics' && (
            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium text-ink">Listing title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. 4 Bedroom Detached Duplex, Lekki Phase 1" className="mt-1.5 w-full rounded-md border border-stone-light px-3 py-2.5 text-sm outline-none focus:border-ochre-dark" />
              </div>
              <div>
                <label className="text-sm font-medium text-ink">Description</label>
                <textarea rows={4} placeholder="Describe the property, its condition and standout features…" className="mt-1.5 w-full rounded-md border border-stone-light px-3 py-2.5 text-sm outline-none focus:border-ochre-dark" />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-ink">Asking price (₦)</label>
                  <input value={price} onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ''))} placeholder="150000000" className="mt-1.5 w-full rounded-md border border-stone-light px-3 py-2.5 text-sm outline-none focus:border-ochre-dark" />
                </div>
                <div>
                  <label className="text-sm font-medium text-ink">Condition</label>
                  <div className="mt-1.5 flex gap-2">
                    {(['new', 'old'] as const).map((c) => (
                      <button key={c} onClick={() => setCondition(c)} className={`flex-1 rounded-md border py-2.5 text-sm font-medium ${condition === c ? 'border-ink bg-ink text-parchment' : 'border-stone-light text-ink-light'}`}>
                        {c === 'new' ? 'New / Newly Built' : 'Old / Existing'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {condition === 'old' && (
                <div className="rounded-md bg-parchment-dim p-4">
                  <label className="text-sm font-medium text-ink">Year built</label>
                  <input
                    type="number"
                    value={yearBuilt}
                    onChange={(e) => setYearBuilt(e.target.value ? Number(e.target.value) : '')}
                    placeholder="e.g. 2009"
                    className="mt-1.5 w-40 rounded-md border border-stone-light px-3 py-2 text-sm outline-none focus:border-ochre-dark"
                  />
                  {age !== undefined && (
                    <p className="mt-2 text-sm text-ink-light">
                      Building age is calculated automatically: <span className="font-semibold text-ink">{age} years</span>
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {step.id === 'location' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-ink">State</label>
                  <div className="mt-1.5">
                    <StateSelect value={state} onChange={setState} />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-ink">Local Government Area</label>
                  <input placeholder="e.g. Eti-Osa" className="mt-1.5 w-full rounded-md border border-stone-light px-3 py-2.5 text-sm outline-none focus:border-ochre-dark" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-ink">Street address / landmark</label>
                <input placeholder="e.g. Off Admiralty Way, near Elegushi Beach" className="mt-1.5 w-full rounded-md border border-stone-light px-3 py-2.5 text-sm outline-none focus:border-ochre-dark" />
              </div>
              <div>
                <label className="text-sm font-medium text-ink">Pin the exact location on the map</label>
                <button
                  onClick={() => setPinDropped(true)}
                  className={`mt-1.5 flex aspect-[16/7] w-full items-center justify-center rounded-md border-2 border-dashed transition-colors ${pinDropped ? 'border-verdant bg-verdant-light' : 'border-stone-light bg-parchment-dim hover:border-ochre-dark'}`}
                >
                  <span className="flex flex-col items-center gap-2 text-sm">
                    <MapPin className={`h-6 w-6 ${pinDropped ? 'text-verdant' : 'text-stone'}`} />
                    {pinDropped ? 'Pin dropped — coordinates captured' : 'Tap to drop a pin at the property location'}
                  </span>
                </button>
              </div>
            </div>
          )}

          {step.id === 'documents' && (
            <div className="space-y-3">
              <p className="text-sm text-ink-light">
                Upload the documents you currently have. You can add more later — buyers see verification progress in
                real time.
              </p>
              {docChecklist.map((doc) => (
                <button
                  key={doc}
                  onClick={() => toggleDoc(doc)}
                  className={`flex w-full items-center justify-between rounded-md border p-4 text-left transition-colors ${uploadedDocs.includes(doc) ? 'border-verdant bg-verdant-light' : 'border-stone-light hover:border-stone'}`}
                >
                  <span className="flex items-center gap-3">
                    <Upload className={`h-4 w-4 ${uploadedDocs.includes(doc) ? 'text-verdant' : 'text-stone'}`} />
                    <span className="font-medium text-ink">{doc}</span>
                  </span>
                  <span className={`text-xs font-medium ${uploadedDocs.includes(doc) ? 'text-verdant' : 'text-stone'}`}>
                    {uploadedDocs.includes(doc) ? 'Uploaded' : 'Tap to upload (mock)'}
                  </span>
                </button>
              ))}
            </div>
          )}

          {step.id === 'review' && (
            <div className="space-y-4">
              <div className="rounded-md border border-stone-light bg-white p-5">
                <h3 className="font-display text-lg font-semibold text-ink">{title || 'Untitled listing'}</h3>
                <p className="mt-1 text-sm text-ink-light">{state} · {condition === 'old' && age !== undefined ? `${age} years old` : 'New / newly built'}</p>
                <p className="mt-1 font-display text-xl font-semibold text-ink">₦{price ? Number(price).toLocaleString('en-NG') : '—'}</p>
              </div>
              <p className="text-sm text-ink-light">
                Your listing will be published immediately and enter the verification queue for any documents marked
                as uploaded. You can edit it at any time from your seller dashboard.
              </p>
            </div>
          )}

          <div className="mt-8 flex items-center justify-between">
            <button
              onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
              disabled={stepIndex === 0}
              className="rounded-full border border-stone-light px-5 py-2.5 text-sm font-medium text-ink-light disabled:opacity-40"
            >
              Back
            </button>
            {step.id === 'review' ? (
              <button onClick={() => setSubmitted(true)} className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-parchment hover:bg-ink-light">
                Publish listing
              </button>
            ) : (
              <button
                onClick={() => setStepIndex((i) => Math.min(steps.length - 1, i + 1))}
                disabled={!canProceed()}
                className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-parchment hover:bg-ink-light disabled:opacity-40"
              >
                Continue
              </button>
            )}
          </div>
        </div>

        {/* Live trust score sidebar */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-md border border-stone-light bg-white p-5">
            <p className="text-sm text-ink-light">Live trust score</p>
            <div className="mt-1 flex items-end gap-2">
              <span className="font-display text-4xl font-semibold text-ink">{trustScore}</span>
              <span className="mb-1 text-sm text-stone">/ 100</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-stone-light">
              <div className={`h-full rounded-full ${trustScore >= 80 ? 'bg-verdant' : trustScore >= 50 ? 'bg-ochre' : 'bg-rust'}`} style={{ width: `${trustScore}%` }} />
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-center gap-2 text-ink-light"><Check className="h-3.5 w-3.5 text-verdant" /> Seller identity verified</li>
              <li className={`flex items-center gap-2 ${title ? 'text-ink-light' : 'text-stone'}`}><Check className={`h-3.5 w-3.5 ${title ? 'text-verdant' : 'text-stone-light'}`} /> Listing details supplied</li>
              <li className={`flex items-center gap-2 ${pinDropped ? 'text-ink-light' : 'text-stone'}`}><Check className={`h-3.5 w-3.5 ${pinDropped ? 'text-verdant' : 'text-stone-light'}`} /> Location supplied</li>
              {docChecklist.map((d) => (
                <li key={d} className={`flex items-center gap-2 ${uploadedDocs.includes(d) ? 'text-ink-light' : 'text-stone'}`}>
                  <Check className={`h-3.5 w-3.5 ${uploadedDocs.includes(d) ? 'text-verdant' : 'text-stone-light'}`} /> {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
