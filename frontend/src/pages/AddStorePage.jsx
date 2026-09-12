import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import api, { getErrorMessage } from '../api/client.js'
import { createStoreSchema } from '../utils/validators.js'
import { ROLES } from '../utils/constants.js'
import { cardClass } from '../utils/styles.js'
import Alert from '../components/Alert.jsx'
import FormField from '../components/FormField.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { Button, LinkButton } from '../components/Button.jsx'

export default function AddStorePage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [serverError, setServerError] = useState('')

  const { data: owners = [] } = useQuery({
    queryKey: ['admin', 'users', { role: ROLES.OWNER }],
    queryFn: async () => (await api.get('/admin/users', { params: { role: ROLES.OWNER } })).data.users,
  })

  const ownerOptions = [
    { value: '', label: 'No owner yet' },
    ...owners.map((owner) => ({ value: owner.id, label: `${owner.name} (${owner.email})` })),
  ]

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(createStoreSchema),
    defaultValues: { ownerId: '' },
  })

  async function onSubmit(values) {
    setServerError('')
    try {
      await api.post('/admin/stores', { ...values, ownerId: values.ownerId || undefined })
      await queryClient.invalidateQueries({ queryKey: ['admin'] })
      toast.success(`${values.name} was added`)
      navigate('/admin/stores')
    } catch (error) {
      setServerError(getErrorMessage(error))
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <Link to="/admin/stores" className="text-sm text-muted transition-colors hover:text-ink">
        ← Back to stores
      </Link>

      <PageHeader
        title="Add store"
        description="Store names need at least 20 characters. The owner can be linked later."
      />

      <form onSubmit={handleSubmit(onSubmit)} className={`${cardClass} space-y-4 p-6`} noValidate>
        {serverError && <Alert>{serverError}</Alert>}

        <FormField label="Store name" error={errors.name} {...register('name')} />
        <FormField label="Store email" type="email" error={errors.email} {...register('email')} />
        <FormField label="Address" rows={3} error={errors.address} {...register('address')} />
        <FormField label="Owner" options={ownerOptions} error={errors.ownerId} {...register('ownerId')} />

        <div className="flex justify-end gap-2 pt-2">
          <LinkButton to="/admin/stores" variant="secondary">
            Cancel
          </LinkButton>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add store'}
          </Button>
        </div>
      </form>
    </div>
  )
}
