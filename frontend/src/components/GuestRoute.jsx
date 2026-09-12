import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../hooks/useAuth.js'
import { HOME_BY_ROLE } from '../utils/constants.js'

export default function GuestRoute() {
  const { user, isLoading } = useAuth()

  if (isLoading) return <p className="p-8">Loading...</p>
  if (user) return <Navigate to={HOME_BY_ROLE[user.role]} replace />

  return <Outlet />
}
