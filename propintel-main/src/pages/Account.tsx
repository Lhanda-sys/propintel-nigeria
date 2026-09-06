import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { LogOut, ShieldCheck, ShieldQuestion, Briefcase } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { authService } from '../services/authService'
import StateSelect from '../components/ui/StateSelect'
import type { AccountType } from '../types'

const roleOptions: { value: AccountType; label: string }[] = [
  { value: 'buyer', label: 'Buyer' },
  { value: 'seller', label: 'Seller' },
  { value: 'buyer-seller', label: 'Buyer & Seller' },
]

export default function Account() {
  const { user, refresh } = useAuth()
  const navigate = useNavigate()
  const [bio, setBio] = useState(user?.bio ?? '')
  const [state, setState] = useState(user?.state ?? '')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setBio(user?.bio ?? '')
    setState(user?.state ?? '')
  }, [user])

  if (!user) return null

  const isProfessional = user.accountType === 'professional'

  const save = async () => {
    await authService.updateCurrentUser({ bio, state })
    refresh()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const setRole = async (accountType: AccountType) => {
    await authService.updateCurrentUser({ accountType })
    refresh()
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <div className="flex items-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-full font-display text-2xl font-semibold text-parchment" style={{ backgroundColor: user.avatarColor }}>
          {user.fullName.charAt(0)}
        </span>
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">{user.fullName}</h1>
          <p className="text-sm text-ink-light">{user.email}</p>
          <div className="mt-1 flex items-center gap-1.5 text-xs">
            {user.verified ? (
              <span className="flex items-center gap-1 text-verdant"><ShieldCheck className="h-3.5 w-3.5" /> Verified account</span>
            ) : (
              <span className="flex items-center gap-1 text-stone"><ShieldQuestion className="h-3.5 w-3.5" /> Not yet verified</span>
            )}
          </div>
        </div>
      </div>

      {isProfessional ? (
        <div className="mt-6 flex items-center justify-between rounded-md border border-stone-light bg-white p-4">
          <span className="flex items-center gap-2 text-sm text-ink"><Briefcase className="h-4 w-4 text-ochre-dark" /> Registered as a professional</span>
          <Link to="/register/professional" className="text-sm font-medium text-ochre-dark">Edit professional profile</Link>
        </div>
      ) : (
        <div className="mt-6">
          <p className="text-sm font-medium text-ink">Account type</p>
          <div className="mt-2 flex gap-2">
            {roleOptions.map((r) => (
              <button
                key={r.value}
                onClick={() => setRole(r.value)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium ${user.accountType === r.value ? 'border-ink bg-ink text-parchment' : 'border-stone-light text-ink-light'}`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <Link to="/register/professional" className="mt-3 inline-block text-sm font-medium text-ochre-dark">
            Register as a professional instead →
          </Link>
        </div>
      )}

      <div className="mt-8 space-y-5">
        <div>
          <label className="text-sm font-medium text-ink">State</label>
          <div className="mt-1.5 max-w-xs">
            <StateSelect value={state} onChange={setState} />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-ink">Short bio</label>
          <textarea
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell sellers or buyers a little about yourself…"
            className="mt-1.5 w-full rounded-md border border-stone-light px-3 py-2.5 text-sm outline-none focus:border-ochre-dark"
          />
        </div>
        <div className="flex items-center gap-3">
          <button onClick={save} className="rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-parchment hover:bg-ink-light">
            Save changes
          </button>
          {saved && <span className="text-sm text-verdant">Saved.</span>}
        </div>
      </div>

      <div className="mt-10 border-t border-stone-light pt-6">
        <button
          onClick={async () => {
            await authService.signOut()
            navigate('/')
          }}
          className="flex items-center gap-2 text-sm font-medium text-rust"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </button>
      </div>
    </div>
  )
}
