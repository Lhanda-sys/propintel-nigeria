import type { AdminAction, Report, UserStatus, CACStatus } from '../types'

// FRONTEND-ONLY MOCK. No server enforces any of these actions — they only
// mutate localStorage/in-memory state so the admin dashboard has something
// real to click through. A production version needs a backend that actually
// owns user/listing/report state and enforces admin authorization.

const delay = <T,>(value: T, ms = 300): Promise<T> => new Promise((resolve) => setTimeout(() => resolve(value), ms))

const LOG_KEY = 'propintel.adminLog'

const readLog = (): AdminAction[] => {
  try {
    return JSON.parse(localStorage.getItem(LOG_KEY) ?? '[]')
  } catch {
    return []
  }
}
const writeLog = (log: AdminAction[]) => localStorage.setItem(LOG_KEY, JSON.stringify(log))

const record = (action: string, targetLabel: string) => {
  const entry: AdminAction = {
    id: `act-${Date.now()}`,
    actor: 'admin@propintel.ng (mock session)',
    action,
    targetLabel,
    createdAt: new Date().toISOString(),
  }
  writeLog([entry, ...readLog()])
  return entry
}

export const mockReports: Report[] = [
  {
    id: 'rep-1',
    type: 'property',
    targetId: 'p3',
    targetLabel: '5-Acre Commercial Land, Lekki Phase 2',
    reason: 'Price appears inconsistent with similar plots nearby',
    reportedBy: 'buyer_musa88',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'open',
  },
  {
    id: 'rep-2',
    type: 'user',
    targetId: 'u-42',
    targetLabel: 'seller_ade_props',
    reason: 'Multiple duplicate listings for the same property',
    reportedBy: 'buyer_ngozi',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    status: 'open',
  },
]

export const adminService = {
  getStats: () =>
    delay({
      totalUsers: 1284,
      activeSellers: 96,
      activeListings: 341,
      propertiesSold: 58,
      pendingVerification: 12,
      professionals: 74,
      openReports: mockReports.filter((r) => r.status === 'open').length,
      suspendedUsers: 3,
    }),

  getReports: (): Promise<Report[]> => delay(mockReports),
  getAuditLog: (): Promise<AdminAction[]> => delay(readLog()),

  resolveReport: (reportId: string, outcome: 'resolved' | 'dismissed') => {
    const r = mockReports.find((x) => x.id === reportId)
    if (r) r.status = outcome
    record(`Report ${outcome}`, r?.targetLabel ?? reportId)
    return delay(r)
  },

  setUserStatus: (userLabel: string, status: UserStatus) => {
    record(`User status → ${status}`, userLabel)
    return delay({ userLabel, status })
  },

  approveListing: (listingTitle: string) => {
    record('Listing approved', listingTitle)
    return delay({ listingTitle, status: 'approved' })
  },
  rejectListing: (listingTitle: string) => {
    record('Listing rejected', listingTitle)
    return delay({ listingTitle, status: 'rejected' })
  },

  approveProfessional: (name: string) => {
    record('Professional approved', name)
    return delay({ name, status: 'approved' })
  },
  rejectProfessional: (name: string) => {
    record('Professional rejected', name)
    return delay({ name, status: 'rejected' })
  },

  setCACStatus: (name: string, status: CACStatus) => {
    record(`CAC status → ${status}`, name)
    return delay({ name, status })
  },
}
