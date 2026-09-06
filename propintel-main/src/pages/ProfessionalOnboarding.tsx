import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check, Upload } from 'lucide-react'
import StateSelect from '../components/ui/StateSelect'
import { authService } from '../services/authService'
import { verificationService } from '../services'
import type { ProfessionCategory, ProfessionalProfileDraft } from '../types'

const categories: ProfessionCategory[] = [
  'Real Estate Agent',
  'Realtor',
  'Property Developer',
  'Estate Manager',
  'Property Valuer',
  'Land Surveyor',
  'Architect',
  'Quantity Surveyor',
  'Real Estate Lawyer',
  'Mortgage/Finance Professional',
  'Property Manager',
  'Construction/Engineering Professional',
  'Real Estate Company',
  'Other',
]

/** Which optional fields are relevant for a given profession. This is the
 * single place that decides "which fields does this professional see" — add
 * a new profession by adding a case here rather than branching in the JSX. */
function fieldsForCategory(category: ProfessionCategory | '') {
  const none = {
    company: false,
    yearsExperience: false,
    statesServed: true,
    bio: true,
    professionalRegistrationNumber: false,
    specialisation: false,
    developmentTypes: false,
  }
  switch (category) {
    case 'Real Estate Agent':
    case 'Realtor':
      return { ...none, yearsExperience: true, company: true }
    case 'Land Surveyor':
    case 'Architect':
    case 'Quantity Surveyor':
    case 'Construction/Engineering Professional':
      return { ...none, yearsExperience: true, professionalRegistrationNumber: true, specialisation: true }
    case 'Property Developer':
      return { ...none, yearsExperience: true, company: true, developmentTypes: true }
    case 'Real Estate Lawyer':
      return { ...none, yearsExperience: true, professionalRegistrationNumber: true }
    case 'Mortgage/Finance Professional':
      return { ...none, yearsExperience: true, company: true }
    case 'Property Manager':
    case 'Estate Manager':
      return { ...none, yearsExperience: true, company: true }
    case 'Property Valuer':
      return { ...none, yearsExperience: true, professionalRegistrationNumber: true }
    case 'Real Estate Company':
      return { ...none, company: true }
    default:
      return { ...none, yearsExperience: true }
  }
}

const steps = ['Profession', 'Details', 'CAC verification', 'Review'] as const

export default function ProfessionalOnboarding() {
  const navigate = useNavigate()
  const [stepIndex, setStepIndex] = useState(0)
  const [category, setCategory] = useState<ProfessionCategory | ''>('')
  const [draft, setDraft] = useState<ProfessionalProfileDraft>({
    category: 'Other',
    statesServed: [],
  })
  const [cacUploaded, setCacUploaded] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const fields = useMemo(() => fieldsForCategory(category), [category])
  const step = steps[stepIndex]

  const canProceed = () => {
    if (step === 'Profession') return !!category
    if (step === 'Details') return draft.statesServed.length > 0
    return true
  }

  const submit = async () => {
    await authService.updateCurrentUser({ accountType: 'professional' })
    if (draft.cacNumber) {
      await verificationService.submitCAC(draft.cacNumber, draft.cacDocumentName)
    }
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-verdant-light text-verdant">
          <Check className="h-7 w-7" />
        </span>
        <h1 className="mt-5 font-display text-2xl font-semibold text-ink">Professional profile submitted</h1>
        <p className="mt-2 text-ink-light">
          Your {category} profile has been created. {draft.cacNumber ? 'Your CAC number is recorded with status "Submitted" — this is not yet verified.' : ''}
        </p>
        <button
          onClick={() => navigate('/account')}
          className="mt-6 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-parchment hover:bg-ink-light"
        >
          Go to my account
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <h1 className="font-display text-3xl font-semibold text-ink">Professional registration</h1>
      <p className="mt-1 text-ink-light">Tell us about your profession so buyers and sellers can find and trust you.</p>

      <ol className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-b border-stone-light pb-4">
        {steps.map((s, i) => (
          <li key={s} className={`flex items-center gap-2 text-sm ${i === stepIndex ? 'font-semibold text-ink' : i < stepIndex ? 'text-verdant' : 'text-stone'}`}>
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-xs ${i === stepIndex ? 'bg-ink text-parchment' : i < stepIndex ? 'bg-verdant text-white' : 'bg-stone-light text-stone'}`}>
              {i < stepIndex ? <Check className="h-3 w-3" /> : i + 1}
            </span>
            {s}
          </li>
        ))}
      </ol>

      <div className="mt-8">
        {step === 'Profession' && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => {
                  setCategory(c)
                  setDraft((d) => ({ ...d, category: c }))
                }}
                className={`rounded-md border p-3 text-center text-sm font-medium transition-colors ${category === c ? 'border-ochre-dark bg-parchment-dim text-ink' : 'border-stone-light text-ink-light hover:border-stone'}`}
              >
                {c}
              </button>
            ))}
          </div>
        )}

        {step === 'Details' && (
          <div className="space-y-5">
            {fields.company && (
              <div>
                <label className="text-sm font-medium text-ink">Company / agency name</label>
                <input
                  value={draft.company ?? ''}
                  onChange={(e) => setDraft((d) => ({ ...d, company: e.target.value }))}
                  className="mt-1.5 w-full rounded-md border border-stone-light px-3 py-2.5 text-sm outline-none focus:border-ochre-dark"
                />
              </div>
            )}
            {fields.yearsExperience && (
              <div>
                <label className="text-sm font-medium text-ink">Years of experience</label>
                <input
                  type="number"
                  value={draft.yearsExperience ?? ''}
                  onChange={(e) => setDraft((d) => ({ ...d, yearsExperience: Number(e.target.value) }))}
                  className="mt-1.5 w-32 rounded-md border border-stone-light px-3 py-2.5 text-sm outline-none focus:border-ochre-dark"
                />
              </div>
            )}
            {fields.professionalRegistrationNumber && (
              <div>
                <label className="text-sm font-medium text-ink">Professional registration number</label>
                <input
                  value={draft.professionalRegistrationNumber ?? ''}
                  onChange={(e) => setDraft((d) => ({ ...d, professionalRegistrationNumber: e.target.value }))}
                  placeholder="e.g. SURCON/2014/00231"
                  className="mt-1.5 w-full rounded-md border border-stone-light px-3 py-2.5 text-sm outline-none focus:border-ochre-dark"
                />
              </div>
            )}
            {fields.specialisation && (
              <div>
                <label className="text-sm font-medium text-ink">Specialisation</label>
                <input
                  value={draft.specialisation ?? ''}
                  onChange={(e) => setDraft((d) => ({ ...d, specialisation: e.target.value }))}
                  placeholder="e.g. Structural engineering, boundary surveys"
                  className="mt-1.5 w-full rounded-md border border-stone-light px-3 py-2.5 text-sm outline-none focus:border-ochre-dark"
                />
              </div>
            )}
            {fields.developmentTypes && (
              <div>
                <label className="text-sm font-medium text-ink">Types of development</label>
                <input
                  value={draft.developmentTypes ?? ''}
                  onChange={(e) => setDraft((d) => ({ ...d, developmentTypes: e.target.value }))}
                  placeholder="e.g. Residential estates, mixed-use, industrial parks"
                  className="mt-1.5 w-full rounded-md border border-stone-light px-3 py-2.5 text-sm outline-none focus:border-ochre-dark"
                />
              </div>
            )}
            {fields.statesServed && (
              <div>
                <label className="text-sm font-medium text-ink">Primary state served</label>
                <div className="mt-1.5">
                  <StateSelect
                    value={draft.statesServed[0] ?? ''}
                    onChange={(s) => setDraft((d) => ({ ...d, statesServed: s ? [s] : [] }))}
                  />
                </div>
              </div>
            )}
            {fields.bio && (
              <div>
                <label className="text-sm font-medium text-ink">Professional description</label>
                <textarea
                  rows={3}
                  value={draft.bio ?? ''}
                  onChange={(e) => setDraft((d) => ({ ...d, bio: e.target.value }))}
                  className="mt-1.5 w-full rounded-md border border-stone-light px-3 py-2.5 text-sm outline-none focus:border-ochre-dark"
                />
              </div>
            )}
          </div>
        )}

        {step === 'CAC verification' && (
          <div className="space-y-5">
            <p className="text-sm text-ink-light">
              Optional for individuals, recommended for companies and agencies. This is not verified automatically —
              it will show as "Submitted" until an administrator (or, in future, a real CAC API) reviews it.
            </p>
            <div>
              <label className="text-sm font-medium text-ink">CAC registration number</label>
              <input
                value={draft.cacNumber ?? ''}
                onChange={(e) => setDraft((d) => ({ ...d, cacNumber: e.target.value }))}
                placeholder="RC1234567"
                className="mt-1.5 w-full max-w-xs rounded-md border border-stone-light px-3 py-2.5 text-sm outline-none focus:border-ochre-dark"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink">CAC certificate (optional upload)</label>
              <button
                onClick={() => {
                  setCacUploaded(true)
                  setDraft((d) => ({ ...d, cacDocumentName: 'cac-certificate.pdf' }))
                }}
                className={`mt-1.5 flex w-full max-w-xs items-center justify-center gap-2 rounded-md border-2 border-dashed py-6 text-sm transition-colors ${cacUploaded ? 'border-verdant bg-verdant-light text-verdant' : 'border-stone-light text-stone hover:border-ochre-dark'}`}
              >
                <Upload className="h-4 w-4" />
                {cacUploaded ? 'cac-certificate.pdf uploaded (mock)' : 'Tap to upload (mock)'}
              </button>
            </div>
          </div>
        )}

        {step === 'Review' && (
          <div className="space-y-3 rounded-md border border-stone-light bg-white p-5">
            <p><span className="font-medium text-ink">Profession:</span> <span className="text-ink-light">{category}</span></p>
            {draft.company && <p><span className="font-medium text-ink">Company:</span> <span className="text-ink-light">{draft.company}</span></p>}
            {draft.yearsExperience !== undefined && <p><span className="font-medium text-ink">Experience:</span> <span className="text-ink-light">{draft.yearsExperience} years</span></p>}
            {draft.statesServed[0] && <p><span className="font-medium text-ink">State:</span> <span className="text-ink-light">{draft.statesServed[0]}</span></p>}
            {draft.cacNumber && <p><span className="font-medium text-ink">CAC number:</span> <span className="text-ink-light">{draft.cacNumber} (pending review)</span></p>}
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
          {step === 'Review' ? (
            <button onClick={submit} className="rounded-full bg-ink px-6 py-2.5 text-sm font-medium text-parchment hover:bg-ink-light">
              Submit profile
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
    </div>
  )
}
