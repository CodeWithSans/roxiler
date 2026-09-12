import { Link, useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import api, { getErrorMessage } from '../api/client.js'
import { ROLES, ROLE_LABELS } from '../utils/constants.js'

export default function UserDetailsPage() {
  const { id } = useParams()

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['admin', 'user', id],
    queryFn: async () => (await api.get(`/admin/users/${id}`)).data.user,
  })

  if (isLoading) return <p className="text-gray-500">Loading...</p>
  if (error) return <p className="text-red-600">{getErrorMessage(error)}</p>

  const details = [
    ['Name', user.name],
    ['Email', user.email],
    ['Address', user.address],
    ['Role', ROLE_LABELS[user.role]],
  ]
  if (user.role === ROLES.OWNER) {
    details.push(['Store rating', user.rating ? `★ ${user.rating}` : 'No ratings yet'])
  }

  return (
    <div className="max-w-lg space-y-4">
      <Link to="/admin/users" className="text-sm text-blue-600 hover:underline">← Back to users</Link>

      <div className="rounded-lg bg-white p-6 shadow">
        <h1 className="mb-4 text-2xl font-semibold text-gray-800">User details</h1>
        <dl className="space-y-3">
          {details.map(([label, value]) => (
            <div key={label}>
              <dt className="text-sm text-gray-500">{label}</dt>
              <dd className="text-gray-800">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
