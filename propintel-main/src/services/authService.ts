import type { AccountType, User } from '../types'

// FRONTEND-ONLY MOCK AUTH SERVICE.
// No real authentication happens here — there is no backend, no password
// hashing, no session tokens and no real Google OAuth. Everything is kept in
// localStorage purely so the UI has something to demonstrate against.
//
// To connect a real provider later (e.g. Supabase Auth, Firebase Auth,
// NextAuth, a custom backend, or real Google OAuth):
//   1. Keep this exact function signature surface (signIn, signUp,
//      signInWithGoogle, signOut, getCurrentUser, onAuthChange).
//   2. Replace each function body with real API calls.
//   3. Nothing in the UI layer should need to change, since components only
//      ever call `authService.*`, never touch localStorage directly.

const STORAGE_KEY = 'propintel.currentUser'
const USERS_KEY = 'propintel.users'

const delay = <T,>(value: T, ms = 400): Promise<T> => new Promise((resolve) => setTimeout(() => resolve(value), ms))

const listeners = new Set<(user: User | null) => void>()
const notify = (user: User | null) => listeners.forEach((l) => l(user))

const readAllUsers = (): User[] => {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? '[]')
  } catch {
    return []
  }
}
const writeAllUsers = (users: User[]) => localStorage.setItem(USERS_KEY, JSON.stringify(users))

const readCurrentUser = (): User | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}
const writeCurrentUser = (user: User | null) => {
  if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  else localStorage.removeItem(STORAGE_KEY)
  notify(user)
}

const avatarPalette = ['#12202e', '#a3701f', '#2f6f5e', '#a8432e', '#6b4226']
const randomAvatarColor = () => avatarPalette[Math.floor(Math.random() * avatarPalette.length)]

export interface SignUpInput {
  fullName: string
  email: string
  password: string
  accountType: AccountType
}

export const authService = {
  /** Mock email/password sign-in. Any password is accepted for a known mock
   * email; unknown emails auto-create a demo buyer account so the prototype
   * never dead-ends. Replace with a real credential check later. */
  /** Mock email/password sign-in. Any password is accepted for a known mock
   * email; unknown emails auto-create a demo buyer account so the prototype
   * never dead-ends. Signing in with admin@propintel.ng (any password)
   * produces a demo admin account so the /admin dashboard is reachable —
   * this is purely a prototype convenience, not real authorization. Replace
   * this whole function with a real credential check later. */
  signIn: (email: string, _password: string): Promise<User> => {
    const users = readAllUsers()
    let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (!user && email.toLowerCase() === 'admin@propintel.ng') {
      user = {
        id: 'demo-admin',
        fullName: 'Demo Admin',
        email,
        avatarColor: '#a3701f',
        accountType: 'admin',
        verified: true,
        status: 'active',
        createdAt: new Date().toISOString(),
      }
      writeAllUsers([...users, user])
    }
    if (!user) {
      user = {
        id: `u-${Date.now()}`,
        fullName: email.split('@')[0],
        email,
        avatarColor: randomAvatarColor(),
        accountType: 'buyer',
        verified: false,
        status: 'active',
        createdAt: new Date().toISOString(),
      }
      writeAllUsers([...users, user])
    }
    writeCurrentUser(user)
    return delay(user)
  },

  signUp: (input: SignUpInput): Promise<User> => {
    const users = readAllUsers()
    const user: User = {
      id: `u-${Date.now()}`,
      fullName: input.fullName,
      email: input.email,
      avatarColor: randomAvatarColor(),
      accountType: input.accountType,
      verified: false,
      status: 'active',
      createdAt: new Date().toISOString(),
    }
    writeAllUsers([...users, user])
    writeCurrentUser(user)
    return delay(user)
  },

  /** Placeholder only. There is no Google OAuth client configured — this
   * clearly simulates the flow rather than pretending it's live, and is the
   * seam where a real @react-oauth/google (or similar) integration would
   * plug in. */
  signInWithGoogle: (): Promise<User> => {
    const mockGoogleUser: User = {
      id: `google-${Date.now()}`,
      fullName: 'Google Demo User',
      email: 'demo.user@gmail.com',
      avatarColor: randomAvatarColor(),
      accountType: 'buyer',
      verified: false,
      status: 'active',
      createdAt: new Date().toISOString(),
    }
    writeCurrentUser(mockGoogleUser)
    return delay(mockGoogleUser, 600)
  },

  signOut: (): Promise<void> => {
    writeCurrentUser(null)
    return delay(undefined)
  },

  getCurrentUser: (): User | null => readCurrentUser(),

  updateCurrentUser: (patch: Partial<User>): Promise<User | null> => {
    const current = readCurrentUser()
    if (!current) return delay(null)
    const updated = { ...current, ...patch }
    const users = readAllUsers().map((u) => (u.id === updated.id ? updated : u))
    writeAllUsers(users)
    writeCurrentUser(updated)
    return delay(updated)
  },

  /** Subscribe to auth state changes (mirrors Firebase/Supabase's
   * onAuthStateChange convention so a real provider drops in cleanly). */
  onAuthChange: (callback: (user: User | null) => void): (() => void) => {
    listeners.add(callback)
    return () => listeners.delete(callback)
  },
}
