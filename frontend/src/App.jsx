import { Routes, Route, Navigate } from 'react-router'
import { ROLES } from './utils/constants.js'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import GuestRoute from './components/GuestRoute.jsx'
import Layout from './components/Layout.jsx'
import LoginPage from './pages/LoginPage.jsx'
import SignupPage from './pages/SignupPage.jsx'
import StoresPage from './pages/StoresPage.jsx'
import AdminDashboardPage from './pages/AdminDashboardPage.jsx'
import OwnerDashboardPage from './pages/OwnerDashboardPage.jsx'
import ChangePasswordPage from './pages/ChangePasswordPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'

const ALL_ROLES = Object.values(ROLES)

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Route>

      <Route element={<ProtectedRoute roles={ALL_ROLES} />}>
        <Route element={<Layout />}>
          <Route path="/password" element={<ChangePasswordPage />} />

          <Route element={<ProtectedRoute roles={[ROLES.USER]} />}>
            <Route path="/stores" element={<StoresPage />} />
          </Route>

          <Route element={<ProtectedRoute roles={[ROLES.ADMIN]} />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
          </Route>

          <Route element={<ProtectedRoute roles={[ROLES.OWNER]} />}>
            <Route path="/owner" element={<OwnerDashboardPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
