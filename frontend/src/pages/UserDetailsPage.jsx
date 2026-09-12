import { Link, useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import api, { getErrorMessage } from '../api/client.js'
import Alert from '../components/Alert.jsx'
import RatingBadge from '../components/RatingBadge.jsx'
import { ROLES, ROLE_LABELS } from '../utils/constants.js'
import { getInitials } from '../utils/format.js'
import { cardClass } from '../utils/styles.js'

export default function UserDetailsPage() {
  const { id } = useParams()

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['admin', 'user', id],
    queryFn: async () => (await api.get(`/admin/users/${id}`)).data.user,
  })

  const backLink = (
    <Link to="/admin/users" className="text-sm text-muted transition-colors hover:text-ink">
      ← Back to users
    </Link>
  )

  if (isLoading) return <p className="text-sm text-muted">Loading…</p>
  if (error) {
    return (
      <div className="max-w-2xl space-y-6">
        {backLink}
        <Alert>{getErrorMessage(error)}</Alert>
      </div>
    )
  }

  const details = [['Role', ROLE_LABELS[user.role]]]
  if (user.role === ROLES.OWNER) {
    details.push(['Store rating', <RatingBadge value={user.rating} emptyText="No ratings yet" />])
  }
  details.push(['Address', user.address])

  return (
    <div className="max-w-2xl space-y-6">
      {backLink}

      <div className={`${cardClass} p-6`}>
        <div className="flex items-center gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-subtle text-sm font-medium text-ink-soft">
            {getInitials(user.name)}
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold tracking-tight text-ink">{user.name}</h1>
            <p className="truncate text-sm text-muted">{user.email}</p>
          </div>
        </div>

        <dl className="mt-6 grid gap-x-6 gap-y-4 border-t border-line pt-6 sm:grid-cols-2">
          {details.map(([label, value]) => (
            <div key={label} className={label === 'Address' ? 'sm:col-span-2' : ''}>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted">{label}</dt>
              <dd className="mt-1 text-sm text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
