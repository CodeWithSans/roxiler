import { useState } from 'react'
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { toast } from 'sonner'
import api, { getErrorMessage } from '../api/client.js'
import Alert from '../components/Alert.jsx'
import DataTable from '../components/DataTable.jsx'
import PageHeader from '../components/PageHeader.jsx'
import RatingBadge from '../components/RatingBadge.jsx'
import StarRating from '../components/StarRating.jsx'
import { useDebounce } from '../hooks/useDebounce.js'
import { useSort } from '../hooks/useSort.js'
import { inputClass } from '../utils/styles.js'

export default function StoresPage() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const { sortBy, order, toggleSort } = useSort('name')
  const queryClient = useQueryClient()

  const { data: stores, isLoading, isError } = useQuery({
    queryKey: ['stores', { search: debouncedSearch, sortBy, order }],
    queryFn: async () => {
      const { data } = await api.get('/stores', { params: { search: debouncedSearch, sortBy, order } })
      return data.stores
    },
    placeholderData: keepPreviousData,
  })

  const rateMutation = useMutation({
    mutationFn: ({ storeId, rating }) => api.put(`/stores/${storeId}/rating`, { rating }),
    onMutate: ({ storeId, rating }) => {
      queryClient.setQueriesData({ queryKey: ['stores'] }, (old) =>
        old?.map((store) => (store.id === storeId ? { ...store, user_rating: rating } : store))
      )
    },
    onSuccess: (_response, { rating }) => toast.success(`Rated ${rating} out of 5`),
    onError: (error) => toast.error(getErrorMessage(error)),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['stores'] }),
  })

  const columns = [
    {
      key: 'name',
      label: 'Store',
      sortable: true,
      render: (store) => <span className="font-medium text-ink">{store.name}</span>,
    },
    { key: 'address', label: 'Address', sortable: true },
    {
      key: 'rating',
      label: 'Overall',
      sortable: true,
      render: (store) => <RatingBadge value={store.overall_rating} />,
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
          <span className="text-xs text-faint">
            {store.user_rating ? 'Click a star to change' : 'Click a star to rate'}
          </span>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader title="Stores" description="Find a store and rate your experience." />

      <div className="relative max-w-md">
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint"
        >
          <circle cx="9" cy="9" r="6" />
          <path d="m17 17-3.5-3.5" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or address"
          aria-label="Search stores"
          className={`${inputClass} pl-9`}
        />
      </div>

      {isError && <Alert>Could not load stores</Alert>}

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
