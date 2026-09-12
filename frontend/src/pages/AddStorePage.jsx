import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import api, { getErrorMessage } from '../api/client.js'
import { createStoreSchema } from '../utils/validators.js'
import { ROLES } from '../utils/constants.js'
import FormField from '../components/FormField.jsx'

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
      navigate('/admin/stores')
    } catch (error) {
      setServerError(getErrorMessage(error))
    }
  }

  return (
    <div className="max-w-lg rounded-lg bg-white p-6 shadow">
      <h1 className="mb-6 text-2xl font-semibold text-gray-800">Add store</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {serverError && <p className="rounded bg-red-50 p-2 text-sm text-red-700">{serverError}</p>}

        <FormField label="Store name" error={errors.name} {...register('name')} />
        <FormField label="Store email" type="email" error={errors.email} {...register('email')} />
        <FormField label="Address" rows={3} error={errors.address} {...register('address')} />
        <FormField label="Owner" options={ownerOptions} error={errors.ownerId} {...register('ownerId')} />

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Adding...' : 'Add store'}
          </button>
          <Link to="/admin/stores" className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-100">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
