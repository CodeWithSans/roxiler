import { useQuery, keepPreviousData } from '@tanstack/react-query'
import api from '../api/client.js'
import DataTable from '../components/DataTable.jsx'
import StatCard from '../components/StatCard.jsx'
import { useSort } from '../hooks/useSort.js'

export default function OwnerDashboardPage() {
  const { sortBy, order, toggleSort } = useSort('date', 'desc')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['owner', 'dashboard', { sortBy, order }],
    queryFn: async () => (await api.get('/owner/dashboard', { params: { sortBy, order } })).data,
    placeholderData: keepPreviousData,
  })

  if (isLoading) return <p className="text-gray-500">Loading...</p>
  if (isError) return <p className="text-red-600">Could not load dashboard</p>

  const { stores, raters } = data

  const columns = [
    { key: 'name', label: 'User', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'store_name', label: 'Store' },
    { key: 'rating', label: 'Rating', sortable: true, render: (rater) => `★ ${rater.rating}` },
    {
      key: 'date',
      label: 'Rated on',
      sortable: true,
      render: (rater) => new Date(rater.rated_at).toLocaleDateString(),
    },
  ]

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">Owner dashboard</h1>

      {stores.length === 0 ? (
        <p className="rounded-lg bg-white p-6 text-gray-600 shadow">
          No store is linked to your account yet. Ask an admin to assign one.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => (
            <StatCard
              key={store.id}
              label={`${store.name} · ${store.total_ratings} ratings`}
              value={store.average_rating ? `★ ${store.average_rating}` : 'No ratings yet'}
            />
          ))}
        </div>
      )}

      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-800">Users who rated your store</h2>
        <DataTable
          columns={columns}
          rows={raters}
          sortBy={sortBy}
          order={order}
          onSort={toggleSort}
          emptyText="No ratings yet"
        />
      </div>
    </div>
  )
}
