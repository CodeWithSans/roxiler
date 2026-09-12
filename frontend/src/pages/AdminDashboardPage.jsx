import { useQuery } from '@tanstack/react-query'
import api from '../api/client.js'
import Alert from '../components/Alert.jsx'
import PageHeader from '../components/PageHeader.jsx'
import StatCard from '../components/StatCard.jsx'
import { cardClass } from '../utils/styles.js'

export default function AdminDashboardPage() {
  const { data: stats, isLoading, isError } = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: async () => (await api.get('/admin/dashboard')).data.stats,
  })

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" description="An overview of everything on the platform." />

      {isError ? (
        <Alert>Could not load dashboard</Alert>
      ) : (
        <div className="grid gap-4 sm:grid-cols-3">
          {isLoading ? (
            [1, 2, 3].map((n) => <div key={n} className={`${cardClass} h-28 animate-pulse`} />)
          ) : (
            <>
              <StatCard label="Total users" value={stats.total_users} />
              <StatCard label="Total stores" value={stats.total_stores} />
              <StatCard label="Total ratings" value={stats.total_ratings} />
            </>
          )}
        </div>
      )}
    </div>
  )
}
