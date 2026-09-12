import { useState } from 'react'
import { Link } from 'react-router'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import api from '../api/client.js'
import DataTable from '../components/DataTable.jsx'
import { useDebounce } from '../hooks/useDebounce.js'
import { useSort } from '../hooks/useSort.js'

const EMPTY_FILTERS = { name: '', email: '', address: '' }
const inputClass =
  'rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none'

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
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    {
      key: 'rating',
      label: 'Rating',
      sortable: true,
      render: (store) => (store.rating ? `★ ${store.rating}` : 'No ratings'),
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-gray-800">Stores</h1>
        <Link
          to="/admin/stores/new"
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Add store
        </Link>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        <input name="name" value={filters.name} onChange={updateFilter} placeholder="Filter by name" className={inputClass} />
        <input name="email" value={filters.email} onChange={updateFilter} placeholder="Filter by email" className={inputClass} />
        <input name="address" value={filters.address} onChange={updateFilter} placeholder="Filter by address" className={inputClass} />
        <button
          type="button"
          onClick={() => setFilters(EMPTY_FILTERS)}
          className="rounded border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100"
        >
          Clear filters
        </button>
      </div>

      {isError && <p className="text-red-600">Could not load stores</p>}

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
