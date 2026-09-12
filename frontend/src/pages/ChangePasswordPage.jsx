import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import api, { getErrorMessage } from '../api/client.js'
import { updatePasswordSchema } from '../utils/validators.js'
import { cardClass } from '../utils/styles.js'
import Alert from '../components/Alert.jsx'
import FormField from '../components/FormField.jsx'
import PageHeader from '../components/PageHeader.jsx'
import { Button } from '../components/Button.jsx'

export default function ChangePasswordPage() {
  const [serverError, setServerError] = useState('')

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(updatePasswordSchema),
  })

  async function onSubmit({ currentPassword, newPassword }) {
    setServerError('')
    try {
      await api.patch('/auth/password', { currentPassword, newPassword })
      toast.success('Password updated')
      reset()
    } catch (error) {
      setServerError(getErrorMessage(error))
    }
  }

  return (
    <div className="max-w-md space-y-6">
      <PageHeader
        title="Change password"
        description="Use 8–16 characters with at least one uppercase letter and one special character."
      />

      <form onSubmit={handleSubmit(onSubmit)} className={`${cardClass} space-y-4 p-6`} noValidate>
        {serverError && <Alert>{serverError}</Alert>}

        <FormField label="Current password" type="password" error={errors.currentPassword} {...register('currentPassword')} />
        <FormField label="New password" type="password" error={errors.newPassword} {...register('newPassword')} />
        <FormField label="Confirm new password" type="password" error={errors.confirmPassword} {...register('confirmPassword')} />

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update password'}
          </Button>
        </div>
      </form>
    </div>
  )
}
