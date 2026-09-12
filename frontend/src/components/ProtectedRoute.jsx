import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../hooks/useAuth.js'
import { HOME_BY_ROLE } from '../utils/constants.js'

export default function ProtectedRoute({ roles }) {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-muted">Loading…</div>
  }
  if (!user) return <Navigate to="/login" replace />
  if (!roles.includes(user.role)) return <Navigate to={HOME_BY_ROLE[user.role]} replace />

  return <Outlet />
}
