import { useState } from 'react'
import { Link } from 'react-router'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import api from '../api/client.js'
import Alert from '../components/Alert.jsx'
import DataTable from '../components/DataTable.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { Button, LinkButton } from '../components/Button.jsx'
import { useDebounce } from '../hooks/useDebounce.js'
import { useSort } from '../hooks/useSort.js'
import { ROLES, ROLE_LABELS } from '../utils/constants.js'
import { inputClass } from '../utils/styles.js'

const EMPTY_FILTERS = { name: '', email: '', address: '', role: '' }

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
        <Link to={`/admin/users/${user.id}`} className="font-medium text-ink underline-offset-4 hover:underline">
          {user.name}
        </Link>
      ),
    },
    { key: 'email', label: 'Email', sortable: true },
    { key: 'address', label: 'Address', sortable: true },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (user) => (
        <span className="inline-flex whitespace-nowrap rounded-full border border-line px-2 py-0.5 text-xs font-medium text-ink-soft">
          {ROLE_LABELS[user.role]}
        </span>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Everyone with an account on the platform."
        action={<LinkButton to="/admin/users/new">Add user</LinkButton>}
      />

      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_12rem_auto]">
        <input name="name" value={filters.name} onChange={updateFilter} placeholder="Name" aria-label="Filter by name" className={inputClass} />
        <input name="email" value={filters.email} onChange={updateFilter} placeholder="Email" aria-label="Filter by email" className={inputClass} />
        <input name="address" value={filters.address} onChange={updateFilter} placeholder="Address" aria-label="Filter by address" className={inputClass} />
        <select name="role" value={filters.role} onChange={updateFilter} aria-label="Filter by role" className={inputClass}>
          <option value="">All roles</option>
          {Object.values(ROLES).map((role) => (
            <option key={role} value={role}>{ROLE_LABELS[role]}</option>
          ))}
        </select>
        <Button variant="secondary" onClick={() => setFilters(EMPTY_FILTERS)}>
          Clear
        </Button>
      </div>

      {isError && <Alert>Could not load users</Alert>}

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
