import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import api, { getErrorMessage } from '../api/client.js'
import { createUserSchema } from '../utils/validators.js'
import { ROLES, ROLE_LABELS } from '../utils/constants.js'
import { cardClass } from '../utils/styles.js'
import Alert from '../components/Alert.jsx'
import FormField from '../components/FormField.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { Button, LinkButton } from '../components/Button.jsx'

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
      toast.success(`${values.name} was added`)
      navigate('/admin/users')
    } catch (error) {
      setServerError(getErrorMessage(error))
    }
  }

  return (
    <div className="max-w-lg space-y-6">
      <Link to="/admin/users" className="text-sm text-muted transition-colors hover:text-ink">
        ← Back to users
      </Link>

      <PageHeader title="Add user" description="Create an account for an admin, store owner or normal user." />

      <form onSubmit={handleSubmit(onSubmit)} className={`${cardClass} space-y-4 p-6`} noValidate>
        {serverError && <Alert>{serverError}</Alert>}

        <FormField label="Full name" error={errors.name} {...register('name')} />
        <FormField label="Email" type="email" error={errors.email} {...register('email')} />
        <FormField label="Address" rows={3} error={errors.address} {...register('address')} />
        <FormField label="Password" type="password" error={errors.password} {...register('password')} />
        <FormField label="Role" options={ROLE_OPTIONS} error={errors.role} {...register('role')} />

        <div className="flex justify-end gap-2 pt-2">
          <LinkButton to="/admin/users" variant="secondary">
            Cancel
          </LinkButton>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add user'}
          </Button>
        </div>
      </form>
    </div>
  )
}
