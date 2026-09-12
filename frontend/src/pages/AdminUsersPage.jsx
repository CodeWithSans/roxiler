import { useState } from 'react'
import { Link } from 'react-router'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import api from '../api/client.js'
import DataTable from '../components/DataTable.jsx'
import { useDebounce } from '../hooks/useDebounce.js'
import { useSort } from '../hooks/useSort.js'
import { ROLES, ROLE_LABELS } from '../utils/constants.js'

const EMPTY_FILTERS = { name: '', email: '', address: '', role: '' }
const inputClass =
  'rounded border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none'

export default function AdminUsersPage() {
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const debouncedFilters = useDebounce(filters)
  const { sortBy, order, toggleSort } = useSort('name')

  const { data: users, isLoading, isError } = useQuery({
    queryKey: ['admin', 'users', { ...debouncedFilters, sortBy, order }],
    queryFn: async () => {
      const { data } = await api.get('/admin/users', { params: { ...debouncedFilters, sortBy, order } })
      return data.users
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
      render: (user) => (
        <Link to={`/admin/users/${user.id}`} className="text-blue-600 hover:underline">
          {user.name}
        </Link>
      ),
    },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    { key: 'role', label: 'Role', sortable: true, render: (user) => ROLE_LABELS[user.role] },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-gray-800">Users</h1>
        <Link
          to="/admin/users/new"
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Add user
        </Link>
      </div>

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
        <input name="name" value={filters.name} onChange={updateFilter} placeholder="Filter by name" className={inputClass} />
        <input name="email" value={filters.email} onChange={updateFilter} placeholder="Filter by email" className={inputClass} />
        <input name="address" value={filters.address} onChange={updateFilter} placeholder="Filter by address" className={inputClass} />
        <select name="role" value={filters.role} onChange={updateFilter} className={inputClass}>
          <option value="">All roles</option>
          {Object.values(ROLES).map((role) => (
            <option key={role} value={role}>{ROLE_LABELS[role]}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setFilters(EMPTY_FILTERS)}
          className="rounded border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100"
        >
          Clear filters
        </button>
      </div>

      {isError && <p className="text-red-600">Could not load users</p>}

      <DataTable
        columns={columns}
        rows={users}
        sortBy={sortBy}
        order={order}
        onSort={toggleSort}
        isLoading={isLoading}
        emptyText="No users match these filters"
      />
    </div>
  )
}
