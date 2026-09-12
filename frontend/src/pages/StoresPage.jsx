import { useState } from 'react'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import api from '../api/client.js'
import DataTable from '../components/DataTable.jsx'
import { useDebounce } from '../hooks/useDebounce.js'
import { useSort } from '../hooks/useSort.js'

export default function StoresPage() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const { sortBy, order, toggleSort } = useSort('name')

  const { data: stores, isLoading, isError } = useQuery({
    queryKey: ['stores', { search: debouncedSearch, sortBy, order }],
    queryFn: async () => {
      const { data } = await api.get('/stores', { params: { search: debouncedSearch, sortBy, order } })
      return data.stores
    },
    placeholderData: keepPreviousData,
  })

  const columns = [
    { key: 'name', label: 'Store', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    {
      key: 'rating',
      label: 'Overall rating',
      sortable: true,
      render: (store) => store.overall_rating ?? 'No ratings',
    },
    { key: 'user_rating', label: 'Your rating', render: (store) => store.user_rating ?? '—' },
  ]

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-gray-800">Stores</h1>

      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or address..."
        className="w-full max-w-md rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
      />

      {isError && <p className="text-red-600">Could not load stores</p>}

      <DataTable
        columns={columns}
        rows={stores}
        sortBy={sortBy}
        order={order}
        onSort={toggleSort}
        isLoading={isLoading}
        emptyText="No stores match your search"
      />
    </div>
  )
}
