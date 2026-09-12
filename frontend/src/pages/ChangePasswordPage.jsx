import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import api, { getErrorMessage } from '../api/client.js'
import { updatePasswordSchema } from '../utils/validators.js'
import FormField from '../components/FormField.jsx'

export default function ChangePasswordPage() {
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState('')

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(updatePasswordSchema),
  })

  async function onSubmit({ currentPassword, newPassword }) {
    setServerError('')
    setSuccess('')
    try {
      await api.patch('/auth/password', { currentPassword, newPassword })
      setSuccess('Password updated successfully')
      reset()
    } catch (error) {
      setServerError(getErrorMessage(error))
    }
  }

  return (
    <div className="max-w-md rounded-lg bg-white p-6 shadow">
      <h1 className="mb-6 text-2xl font-semibold text-gray-800">Change password</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {serverError && <p className="rounded bg-red-50 p-2 text-sm text-red-700">{serverError}</p>}
        {success && <p className="rounded bg-green-50 p-2 text-sm text-green-700">{success}</p>}

        <FormField label="Current password" type="password" error={errors.currentPassword} {...register('currentPassword')} />
        <FormField label="New password" type="password" error={errors.newPassword} {...register('newPassword')} />
        <FormField label="Confirm new password" type="password" error={errors.confirmPassword} {...register('confirmPassword')} />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded bg-blue-600 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? 'Updating...' : 'Update password'}
        </button>
      </form>
    </div>
  )
}
