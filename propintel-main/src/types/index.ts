export type PropertyCategory =
  | 'land'
  | 'residential'
  | 'commercial'
  | 'industrial'
  | 'equipment'
  | 'business'

export type PropertyCondition =
  | 'new'
  | 'newly-built'
  | 'renovated'
  | 'fairly-used'
  | 'old'
  | 'requires-renovation'

export type VerificationStatus =
  | 'not-submitted'
  | 'submitted'
  | 'pending'
  | 'under-review'
  | 'verified'
  | 'rejected'
  | 'requires-info'

export type ElectricityBand = 'A' | 'B' | 'C' | 'D' | 'E' | 'Unknown'

export interface PropertyDocument {
  id: string
  type: string
  status: VerificationStatus
  authority?: string
  reference?: string
  submittedDate?: string
  verifiedDate?: string
  notes?: string
}

export interface SuitabilityScore {
  use: string
  score: number
  reasons: string[]
}

export interface AreaProfile {
  economicActivity: 'Low' | 'Medium' | 'High' | 'Very High'
  residentialDensity: 'Low' | 'Medium' | 'High'
  commercialActivity: 'Low' | 'Medium' | 'High' | 'Very High'
  industrialActivity: 'Low' | 'Medium' | 'High'
  developmentTrend: 'Declining' | 'Stable' | 'Growing' | 'Rapidly Growing'
  roadAccessibility: 'Poor' | 'Fair' | 'Good' | 'Excellent'
  electricityReliability: 'Poor' | 'Moderate' | 'Good'
  electricityBand: ElectricityBand
  estimatedSupplyHours: string
  nearbyLandmarks: number
  schoolsNearby: number
  hospitalsNearby: number
  majorRoadsNearby: number
  interpretation: string
}

export interface Seller {
  id: string
  name: string
  type: 'Individual' | 'Company' | 'Agency'
  verified: boolean
  activeListings: number
  yearsOnPlatform: number
  rating: number
  reviewCount: number
  responseRate: number
  responseTime: string
  avatarColor: string
}

export interface Property {
  id: string
  slug: string
  title: string
  description: string
  category: PropertyCategory
  subcategory: string
  condition: PropertyCondition
  yearBuilt?: number
  landSizeSqm?: number
  buildingSizeSqm?: number
  bedrooms?: number
  bathrooms?: number
  floors?: number
  parkingSpaces?: number
  price: number
  negotiable: boolean
  state: string
  lga: string
  city: string
  neighbourhood: string
  address: string
  latitude: number
  longitude: number
  images: string[]
  documents: PropertyDocument[]
  verificationScore: number
  seller: Seller
  suitability: SuitabilityScore[]
  areaProfile: AreaProfile
  views: number
  saves: number
  createdAt: string
  featured?: boolean
  // Optional — not required on existing mock properties. `intendedUse` is
  // set by a seller/buyer stating a goal (e.g. via the AI "analyse for my
  // goal" flow); `aiRecommendations` is a cache slot a real backend could
  // populate so the client doesn't need to recompute suitability every time.
  intendedUse?: string
  aiRecommendations?: SuitabilityScore[]
}

export type ProfessionCategory =
  | 'Solicitor'
  | 'Surveyor'
  | 'Architect'
  | 'Civil Engineer'
  | 'Quantity Surveyor'
  | 'Estate Surveyor & Valuer'
  | 'Building Contractor'
  | 'Interior Designer'
  | 'Property Manager'
  // Added for the professional registration flow — kept distinct from the
  // categories above rather than merging them, since existing mock
  // professionals/directory filters already depend on the original values.
  | 'Real Estate Agent'
  | 'Realtor'
  | 'Property Developer'
  | 'Estate Manager'
  | 'Property Valuer'
  | 'Land Surveyor'
  | 'Real Estate Lawyer'
  | 'Mortgage/Finance Professional'
  | 'Construction/Engineering Professional'
  | 'Real Estate Company'
  | 'Other'

/** CAC (Corporate Affairs Commission) business-verification status. No real
 * verification happens client-side — this only models the states a real
 * backend/CAC-API integration would eventually drive. */
export type CACStatus = 'not-submitted' | 'submitted' | 'under-review' | 'verified' | 'rejected'

export interface Professional {
  id: string
  name: string
  category: ProfessionCategory
  company: string
  bio: string
  verified: boolean
  rating: number
  reviewCount: number
  statesServed: string[]
  services: string[]
  credentials: string[]
  portfolio: { title: string; description: string }[]
  yearsExperience: number
  avatarColor: string
  // Optional — populated by the professional registration flow. Existing
  // mock professionals simply omit these rather than being forced to
  // fabricate CAC numbers.
  specialisation?: string
  professionalRegistrationNumber?: string
  cacNumber?: string
  cacStatus?: CACStatus
  cacDocumentName?: string
  email?: string
  phone?: string
}

export interface Message {
  id: string
  senderId: string
  content: string
  createdAt: string
  read: boolean
}

export interface Conversation {
  id: string
  participantName: string
  participantType: 'Seller' | 'Professional'
  propertyTitle?: string
  lastMessage: string
  updatedAt: string
  unread: number
  online: boolean
  messages: Message[]
}

// ---------------------------------------------------------------------------
// Accounts, authentication and admin — added to support login/registration,
// buyer/seller/professional accounts and the admin dashboard. Frontend-only:
// see authService/adminService for how these are (mock-)populated.
// ---------------------------------------------------------------------------

/** What an account can do on the platform. A user can be both buyer and
 * seller at once; 'professional' and 'admin' are separate account types. */
export type AccountType = 'buyer' | 'seller' | 'buyer-seller' | 'professional' | 'admin'

export type UserStatus = 'active' | 'suspended' | 'banned'

export interface User {
  id: string
  fullName: string
  email: string
  phone?: string
  avatarColor: string
  accountType: AccountType
  state?: string
  bio?: string
  verified: boolean
  status: UserStatus
  /** Present only when accountType is 'professional' — links to the fuller
   * ProfessionalProfile record created during professional onboarding. */
  professionalId?: string
  createdAt: string
}

/** Profession-specific fields captured during onboarding. All optional
 * because the registration form only shows/collects the fields relevant to
 * the professional's chosen category (see ProfessionalOnboarding page). */
export interface ProfessionalProfileDraft {
  category: ProfessionCategory
  company?: string
  yearsExperience?: number
  statesServed: string[]
  specialisation?: string
  professionalRegistrationNumber?: string
  developmentTypes?: string
  bio?: string
  cacNumber?: string
  cacDocumentName?: string
}

export interface Report {
  id: string
  type: 'property' | 'user' | 'professional'
  targetId: string
  targetLabel: string
  reason: string
  reportedBy: string
  createdAt: string
  status: 'open' | 'resolved' | 'dismissed'
}

export interface AdminAction {
  id: string
  actor: string
  action: string
  targetLabel: string
  createdAt: string
}
