import { useState } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import api from '../api/client.js'
import Alert from '../components/Alert.jsx'
import DataTable from '../components/DataTable.jsx'
import PageHeader from '../components/PageHeader.jsx'
import RatingBadge from '../components/RatingBadge.jsx'
import { Button, LinkButton } from '../components/Button.jsx'
import { useDebounce } from '../hooks/useDebounce.js'
import { useSort } from '../hooks/useSort.js'
import { inputClass } from '../utils/styles.js'

const EMPTY_FILTERS = { name: '', email: '', address: '' }

export default function AdminStoresPage() {
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const debouncedFilters = useDebounce(filters)
  const { sortBy, order, toggleSort } = useSort('name')

  const { data: stores, isLoading, isError } = useQuery({
    queryKey: ['admin', 'stores', { ...debouncedFilters, sortBy, order }],
    queryFn: async () => {
      const { data } = await api.get('/admin/stores', { params: { ...debouncedFilters, sortBy, order } })
      return data.stores
    },
    placeholderData: keepPreviousData,
  })

  function updateFilter(e) {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (store) => <span className="font-medium text-ink">{store.name}</span>,
    },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (store) => <RatingBadge value={store.rating} />,
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stores"
        description="Every store registered on the platform."
        action={<LinkButton to="/admin/stores/new">Add store</LinkButton>}
      />

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto]">
        <input name="name" value={filters.name} onChange={updateFilter} placeholder="Name" aria-label="Filter by name" className={inputClass} />
        <input name="email" value={filters.email} onChange={updateFilter} placeholder="Email" aria-label="Filter by email" className={inputClass} />
        <input name="address" value={filters.address} onChange={updateFilter} placeholder="Address" aria-label="Filter by address" className={inputClass} />
        <Button variant="secondary" onClick={() => setFilters(EMPTY_FILTERS)}>
          Clear
        </Button>
      </div>

      {isError && <Alert>Could not load stores</Alert>}

      <DataTable
        columns={columns}
        rows={stores}
        sortBy={sortBy}
        order={order}
        onSort={toggleSort}
        isLoading={isLoading}
        emptyText="No stores match these filters"
      />
    </div>
  )
}
