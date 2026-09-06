import { professionals, getProfessionalById } from '../data/professionals'
import { conversations, getConversationById } from '../data/conversations'
import type { Property, VerificationStatus } from '../types'

const delay = <T,>(value: T, ms = 200): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms))

// mapService — swap for real Google Maps JS API / Places API calls.
// Read the key from an environment variable, never hard-code it:
//   const key = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
export const mapService = {
  /** True only when a real key has been configured in the environment.
   * Components should check this before claiming Google Maps is live —
   * see LocationPanel for the graceful-placeholder pattern. */
  hasGoogleMapsKey: (): boolean => Boolean(import.meta.env.VITE_GOOGLE_MAPS_API_KEY),
  geocode: (address: string) => delay({ address, latitude: 0, longitude: 0 }),
  reverseGeocode: (lat: number, lng: number) => delay({ lat, lng, address: 'Unresolved (mock)' }),
  getNearbyPlaces: (_lat: number, _lng: number) =>
    delay([
      { name: 'Local market', type: 'market', distanceKm: 1.2 },
      { name: 'Primary/secondary school', type: 'school', distanceKm: 0.8 },
      { name: 'Health centre', type: 'hospital', distanceKm: 2.1 },
    ]),
  getDirections: (_from: string, _to: string) => delay({ durationMins: 25, distanceKm: 12 }),
}

// documentService — swap for real upload storage + backend records.
export const documentService = {
  upload: (file: { name: string; type: string }) =>
    delay({ id: `doc-${Date.now()}`, name: file.name, status: 'submitted' as VerificationStatus }),
  getDocuments: (property: Property) => delay(property.documents),
  requestVerification: (documentId: string) => delay({ documentId, status: 'pending' as VerificationStatus }),
  getVerificationStatus: (documentId: string) => delay({ documentId, status: 'pending' as VerificationStatus }),
}

// verificationService — state-specific verification providers are modelled
// as data, not hard-coded logic, so new states/providers can be added
// without changing UI code.
export const verificationProviders: Record<string, { provider: string; method: string }> = {
  Lagos: { provider: 'Lagos State Ministry of Lands', method: 'manual' },
  FCT: { provider: 'Abuja Geographic Information Systems', method: 'portal' },
  Ogun: { provider: 'Ogun State Bureau of Lands', method: 'manual' },
  Rivers: { provider: 'Rivers State Ministry of Lands', method: 'manual' },
  Oyo: { provider: 'Oyo State Ministry of Lands', method: 'manual' },
}

const CAC_STORAGE_KEY = 'propintel.cacSubmission'

export const verificationService = {
  submit: (documentId: string, state: string) =>
    delay({ documentId, state, provider: verificationProviders[state]?.provider ?? 'Unknown authority', status: 'submitted' as VerificationStatus }),
  getStatus: (documentId: string) => delay({ documentId, status: 'pending' as VerificationStatus }),
  getVerificationHistory: (property: Property) => delay(property.documents),

  // CAC (Corporate Affairs Commission) business verification for
  // professional/business accounts. This is a frontend mock only — no CAC
  // API is called. Swap the body of these two functions for a real CAC
  // lookup once a backend/proxy exists; keep the same shape so
  // ProfessionalOnboarding and the admin dashboard don't need to change.
  submitCAC: (cacNumber: string, documentName?: string) => {
    const record = { cacNumber, documentName, status: 'submitted' as const, submittedAt: new Date().toISOString() }
    localStorage.setItem(CAC_STORAGE_KEY, JSON.stringify(record))
    return delay(record)
  },
  getCACStatus: () => {
    try {
      const raw = localStorage.getItem(CAC_STORAGE_KEY)
      return delay(raw ? JSON.parse(raw) : null)
    } catch {
      return delay(null)
    }
  },
}

// professionalService
export const professionalService = {
  list: () => delay(professionals),
  getById: (id: string) => delay(getProfessionalById(id)),
  search: (filters: { category?: string; state?: string }) => {
    let results = [...professionals]
    if (filters.category) {
      const category = filters.category
      results = results.filter((p) => p.category === category)
    }
    if (filters.state) {
      const state = filters.state
      results = results.filter((p) => p.statesServed.includes(state))
    }
    return delay(results)
  },
}

// messageService
export const messageService = {
  listConversations: () => delay(conversations),
  getConversation: (id: string) => delay(getConversationById(id)),
}
