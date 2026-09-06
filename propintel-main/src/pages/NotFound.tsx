import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-5 py-32 text-center">
      <h1 className="font-display text-4xl font-semibold text-ink">404</h1>
      <p className="mt-2 text-ink-light">We couldn't find that page.</p>
      <Link to="/" className="mt-6 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-parchment hover:bg-ink-light">
        Back to homepage
      </Link>
    </div>
  )
}
