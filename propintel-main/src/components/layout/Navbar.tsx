import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, MessageCircle, Heart, User, Landmark, ShieldCheck } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

const links = [
  { to: '/search?category=land', label: 'Land' },
  { to: '/search?category=residential', label: 'Homes' },
  { to: '/search?category=commercial', label: 'Commercial' },
  { to: '/search?category=industrial', label: 'Industrial' },
  { to: '/professionals', label: 'Professionals' },
  { to: '/map', label: 'Map' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()

  return (
    <header className="sticky top-0 z-40 border-b border-stone-light bg-parchment/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <Landmark className="h-6 w-6 text-ochre-dark" strokeWidth={1.75} />
          <span className="font-display text-xl font-semibold tracking-tight text-ink">PropIntel</span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.label}
              to={l.to}
              className="text-[15px] font-medium text-ink-light transition-colors hover:text-ochre-dark"
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-1 lg:flex">
          <Link
            to="/messages"
            className="rounded-full p-2 text-ink-light transition-colors hover:bg-stone-light/60 hover:text-ink"
            aria-label="Messages"
          >
            <MessageCircle className="h-5 w-5" strokeWidth={1.75} />
          </Link>
          <Link
            to="/dashboard/buyer"
            className="rounded-full p-2 text-ink-light transition-colors hover:bg-stone-light/60 hover:text-ink"
            aria-label="Saved properties"
          >
            <Heart className="h-5 w-5" strokeWidth={1.75} />
          </Link>
          {user?.accountType === 'admin' && (
            <Link
              to="/admin"
              className="rounded-full p-2 text-ink-light transition-colors hover:bg-stone-light/60 hover:text-ink"
              aria-label="Admin dashboard"
            >
              <ShieldCheck className="h-5 w-5" strokeWidth={1.75} />
            </Link>
          )}
          {user ? (
            <Link
              to="/account"
              className="ml-2 flex items-center gap-2 rounded-full border border-stone-light py-1.5 pl-1.5 pr-4 text-sm font-medium text-ink transition-colors hover:border-ochre-dark"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full font-display text-sm font-semibold text-parchment" style={{ backgroundColor: user.avatarColor }}>
                {user.fullName.charAt(0)}
              </span>
              {user.fullName.split(' ')[0]}
            </Link>
          ) : (
            <Link
              to="/login"
              className="ml-2 flex items-center gap-2 rounded-full border border-stone-light py-1.5 pl-1.5 pr-4 text-sm font-medium text-ink transition-colors hover:border-ochre-dark"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-parchment">
                <User className="h-4 w-4" strokeWidth={1.75} />
              </span>
              Sign in
            </Link>
          )}
          <Link
            to="/dashboard/listings/new"
            className="ml-2 rounded-full bg-ink px-5 py-2 text-sm font-medium text-parchment transition-colors hover:bg-ink-light"
          >
            List a property
          </Link>
        </div>

        <button
          className="p-2 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-stone-light px-5 py-4 lg:hidden">
          <nav className="flex flex-col gap-4">
            {links.map((l) => (
              <NavLink key={l.label} to={l.to} onClick={() => setOpen(false)} className="text-base font-medium text-ink">
                {l.label}
              </NavLink>
            ))}
            <div className="mt-2 flex flex-col gap-3 border-t border-stone-light pt-4">
              <Link to="/messages" onClick={() => setOpen(false)} className="text-base font-medium text-ink-light">
                Messages
              </Link>
              <Link to="/dashboard/buyer" onClick={() => setOpen(false)} className="text-base font-medium text-ink-light">
                Saved properties
              </Link>
              <Link to={user ? '/account' : '/login'} onClick={() => setOpen(false)} className="text-base font-medium text-ink-light">
                {user ? 'My account' : 'Sign in'}
              </Link>
              {user?.accountType === 'admin' && (
                <Link to="/admin" onClick={() => setOpen(false)} className="text-base font-medium text-ink-light">
                  Admin dashboard
                </Link>
              )}
              <Link
                to="/dashboard/listings/new"
                onClick={() => setOpen(false)}
                className="rounded-full bg-ink px-5 py-2.5 text-center text-sm font-medium text-parchment"
              >
                List a property
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
