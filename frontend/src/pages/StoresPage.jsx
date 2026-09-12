import { useState } from 'react'
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import api, { getErrorMessage } from '../api/client.js'
import DataTable from '../components/DataTable.jsx'
import StarRating from '../components/StarRating.jsx'
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

    const queryClient = useQueryClient()
  const [rateError, setRateError] = useState('')

  const rateMutation = useMutation({
    mutationFn: ({ storeId, rating }) => api.put(`/stores/${storeId}/rating`, { rating }),
    onMutate: ({ storeId, rating }) => {
      setRateError('')
      queryClient.setQueriesData({ queryKey: ['stores'] }, (old) =>
        old?.map((store) => (store.id === storeId ? { ...store, user_rating: rating } : store))
      )
    },
    onError: (error) => setRateError(getErrorMessage(error)),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['stores'] }),
  })


  const columns = [
    { key: 'name', label: 'Store', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
        {
      key: 'rating',
      label: 'Overall rating',
      sortable: true,
      render: (store) => (store.overall_rating ? `★ ${store.overall_rating}` : 'No ratings'),
    },
    {
      key: 'user_rating',
      label: 'Your rating',
      render: (store) => (
        <div className="space-y-1">
          <StarRating
            value={store.user_rating}
            onRate={(rating) => rateMutation.mutate({ storeId: store.id, rating })}
            disabled={rateMutation.isPending}
          />
          <span className="text-xs text-gray-500">
            {store.user_rating ? 'Click a star to change' : 'Click a star to rate'}
          </span>
        </div>
      ),
    },

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
      {rateError && <p className="rounded bg-red-50 p-2 text-sm text-red-700">{rateError}</p>}


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
