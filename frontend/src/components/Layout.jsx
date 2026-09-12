import { NavLink, Outlet, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth.js'
import { NAV_LINKS, ROLE_LABELS } from '../utils/constants.js'
import { getInitials } from '../utils/format.js'
import { Button } from './Button.jsx'
import Logo from './Logo.jsx'

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  const linkClass = ({ isActive }) =>
    `rounded-md px-3 py-1.5 text-sm transition-colors ${
      isActive ? 'bg-subtle font-medium text-ink' : 'text-muted hover:text-ink'
    }`

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-line bg-surface/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Logo />
            <nav className="flex flex-wrap items-center gap-1">
              {NAV_LINKS[user.role].map((link) => (
                <NavLink key={link.to} to={link.to} end={link.end} className={linkClass}>
                  {link.label}
                </NavLink>
              ))}
              <NavLink to="/password" className={linkClass}>Change password</NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="max-w-48 truncate text-sm font-medium leading-tight text-ink">{user.name}</p>
              <p className="text-xs text-muted">{ROLE_LABELS[user.role]}</p>
            </div>
            <span
              aria-hidden="true"
              className="flex size-8 items-center justify-center rounded-full bg-subtle text-xs font-medium text-ink-soft"
            >
              {getInitials(user.name)}
            </span>
            <Button variant="ghost" onClick={handleLogout}>
              Log out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  )
}
