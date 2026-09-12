import { Routes, Route, Navigate } from 'react-router'
import { useAuth } from './hooks/useAuth.js'
import { ROLES } from './utils/constants.js'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import GuestRoute from './components/GuestRoute.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import StoresPage from './pages/StoresPage.jsx'
import AdminDashboardPage from './pages/AdminDashboardPage.jsx'
import OwnerDashboardPage from './pages/OwnerDashboardPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

export default function App() {
  const { user, logout } = useAuth()

  return (
    <>
      {/* temporary: replaced by the Navbar in Step 22 */}
      {user && (
        <button className="m-4 rounded bg-gray-600 px-3 py-1 text-white" onClick={logout}>
          Logout ({user.role})
        </button>
      )}

      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route element={<GuestRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>

        <Route element={<ProtectedRoute roles={[ROLES.USER]} />}>
          <Route path="/stores" element={<StoresPage />} />
        </Route>

        <Route element={<ProtectedRoute roles={[ROLES.ADMIN]} />}>
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Route>

        <Route element={<ProtectedRoute roles={[ROLES.OWNER]} />}>
          <Route path="/owner" element={<OwnerDashboardPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}
