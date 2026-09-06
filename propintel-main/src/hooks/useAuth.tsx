import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { authService } from '../services/authService'
import type { User } from '../types'

interface AuthContextValue {
  user: User | null
  loading: boolean
  refresh: () => void
}

const AuthContext = createContext<AuthContextValue>({ user: null, loading: true, refresh: () => {} })

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setUser(authService.getCurrentUser())
    setLoading(false)
    const unsubscribe = authService.onAuthChange(setUser)
    return unsubscribe
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, refresh: () => setUser(authService.getCurrentUser()) }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
