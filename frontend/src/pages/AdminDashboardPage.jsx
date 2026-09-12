import { useQuery } from '@tanstack/react-query'
import api from '../api/client.js'
import StatCard from '../components/StatCard.jsx'

export default function AdminDashboardPage() {
  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => (await api.get('/admin/dashboard')).data.stats,
  })

  if (isLoading) return <p className="text-gray-500">Loading...</p>
  if (isError) return <p className="text-red-600">Could not load dashboard</p>

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-gray-800">Admin dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total users" value={stats.total_users} />
        <StatCard label="Total stores" value={stats.total_stores} />
        <StatCard label="Total ratings" value={stats.total_ratings} />
      </div>
    </div>
  )
}
