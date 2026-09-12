import { useAuth } from './hooks/useAuth.js'

export default function App() {
  const { user, isLoading, login, logout } = useAuth()

  if (isLoading) return <p className="p-8">Loading...</p>

  return (
    <div className="p-8 space-y-4">
      {user
        ? <p>Logged in as <b>{user.name}</b> ({user.role})</p>
        : <p>Not logged in</p>}

      <div className="space-x-2">
        <button
          className="rounded bg-blue-600 px-4 py-2 text-white"
          onClick={() => login('admin@test.com', 'Test@1234')}
        >
          Test login
        </button>
        <button className="rounded bg-gray-600 px-4 py-2 text-white" onClick={logout}>
          Logout
        </button>
      </div>
    </div>
  )
}
