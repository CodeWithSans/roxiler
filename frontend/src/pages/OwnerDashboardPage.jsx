import { useQuery, keepPreviousData } from '@tanstack/react-query'
import api from '../api/client.js'
import Alert from '../components/Alert.jsx'
import DataTable from '../components/DataTable.jsx'
import PageHeader from '../components/PageHeader.jsx'
import RatingBadge from '../components/RatingBadge.jsx'
import StatCard from '../components/StatCard.jsx'
import { useSort } from '../hooks/useSort.js'
import { cardClass } from '../utils/styles.js'

function ratingCount(total) {
  if (total === 0) return 'No ratings yet'
  return `Based on ${total} rating${total === 1 ? '' : 's'}`
}

export default function OwnerDashboardPage() {
  const { sortBy, order, toggleSort } = useSort('date', 'desc')

  const { data, isLoading, isError } = useQuery({
    queryKey: ['owner', 'dashboard', { sortBy, order }],
    queryFn: async () => (await api.get('/owner/dashboard', { params: { sortBy, order } })).data,
    placeholderData: keepPreviousData,
  })

  if (isLoading) return <p className="text-sm text-muted">Loading…</p>
  if (isError) return <Alert>Could not load dashboard</Alert>

  const { stores, raters } = data

  const columns = [
    {
      key: 'name',
      label: 'User',
      sortable: true,
      render: (rater) => <span className="font-medium text-ink">{rater.name}</span>,
    },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'store_name', label: 'Store' },
    { key: 'rating', label: 'Rating', sortable: true, render: (rater) => <RatingBadge value={rater.rating} /> },
    {
      key: 'date',
      label: 'Rated on',
      sortable: true,
      render: (rater) => <span className="text-muted">{new Date(rater.rated_at).toLocaleDateString()}</span>,
    },
  ]

  return (
    <div className="space-y-8">
      <PageHeader title="Your store" description="See how customers are rating you." />

      {stores.length === 0 ? (
        <p className={`${cardClass} p-6 text-sm text-muted`}>
          No store is linked to your account yet. Ask an admin to assign one.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stores.map((store) => (
            <StatCard
              key={store.id}
              label={store.name}
              value={
                store.average_rating ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="text-2xl text-star">★</span>
                    {store.average_rating}
                  </span>
                ) : (
                  <span className="text-faint">—</span>
                )
              }
              hint={ratingCount(store.total_ratings)}
            />
          ))}
        </div>
      )}

      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-ink">Users who rated your store</h2>
        <DataTable
          columns={columns}
          rows={raters}
          sortBy={sortBy}
          order={order}
          onSort={toggleSort}
          emptyText="No ratings yet"
        />
      </section>
    </div>
  )
}
