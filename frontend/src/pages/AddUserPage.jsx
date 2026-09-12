import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import api, { getErrorMessage } from '../api/client.js'
import { createUserSchema } from '../utils/validators.js'
import { ROLES, ROLE_LABELS } from '../utils/constants.js'
import FormField from '../components/FormField.jsx'

const ROLE_OPTIONS = Object.values(ROLES).map((role) => ({ value: role, label: ROLE_LABELS[role] }))

export default function AddUserPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [serverError, setServerError] = useState('')

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(createUserSchema),
    defaultValues: { role: ROLES.USER },
  })

  async function onSubmit(values) {
    setServerError('')
    try {
      await api.post('/admin/users', values)
      await queryClient.invalidateQueries({ queryKey: ['admin'] })
      navigate('/admin/users')
    } catch (error) {
      setServerError(getErrorMessage(error))
    }
  }

  return (
    <div className="max-w-lg rounded-lg bg-white p-6 shadow">
      <h1 className="mb-6 text-2xl font-semibold text-gray-800">Add user</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {serverError && <p className="rounded bg-red-50 p-2 text-sm text-red-700">{serverError}</p>}

        <FormField label="Full name" error={errors.name} {...register('name')} />
        <FormField label="Email" type="email" error={errors.email} {...register('email')} />
        <FormField label="Address" rows={3} error={errors.address} {...register('address')} />
        <FormField label="Password" type="password" error={errors.password} {...register('password')} />
        <FormField label="Role" options={ROLE_OPTIONS} error={errors.role} {...register('role')} />

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Adding...' : 'Add user'}
          </button>
          <Link to="/admin/users" className="rounded border border-gray-300 px-4 py-2 hover:bg-gray-100">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
