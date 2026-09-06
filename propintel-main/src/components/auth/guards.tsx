import { type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

// IMPORTANT: these guards are frontend-only convenience redirects. They stop
// a logged-out user from seeing a page in this SPA, but they provide NO real
// security — anyone can still call underlying data functions directly, and
// there is no server enforcing these checks. Real authorization must happen
// server-side once a backend exists.

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return null
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  return <>{children}</>
}

export function RequireAdmin({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user || user.accountType !== 'admin') {
    return (
      <div className="mx-auto max-w-lg px-5 py-24 text-center">
        <p className="font-display text-2xl font-semibold text-ink">Admins only</p>
        <p className="mt-2 text-ink-light">
          This area is restricted to admin accounts. Note this check runs entirely in the browser and is not a
          substitute for real server-side authorization.
        </p>
      </div>
    )
  }
  return <>{children}</>
}
