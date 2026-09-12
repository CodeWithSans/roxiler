import { LinkButton } from '../components/Button.jsx'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
      <p className="text-sm font-medium text-muted">404</p>
      <h1 className="text-2xl font-semibold tracking-tight text-ink">Page not found</h1>
      <p className="text-sm text-muted">The page you're looking for doesn't exist.</p>
      <LinkButton to="/" className="mt-3">
        Go home
      </LinkButton>
    </div>
  )
}
